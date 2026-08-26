require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true },
});

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.set('io', io); // Share socket instance with routes

// ── Database ──────────────────────────────────────────────────────────────────
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth', require('./routes/auth'));
app.use('/api/rides', require('./routes/rides'));
const { messagesRouter, ratingsRouter } = require('./routes/messages');
app.use('/api/messages', messagesRouter);
app.use('/api/ratings', ratingsRouter);

// Health check
app.get('/health', (_, res) => res.json({ status: 'ok', app: 'GU RideShare API' }));

// 404 handler
app.use((_, res) => res.status(404).json({ error: 'Route not found' }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// ── Socket.io — Real-time chat + location ─────────────────────────────────────
const connectedUsers = new Map(); // userId → socketId

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  // Register user
  socket.on('register', (userId) => {
    connectedUsers.set(userId, socket.id);
    socket.join(userId);
    console.log(`User ${userId} registered on socket ${socket.id}`);
  });

  // Send message
  socket.on('send_message', (data) => {
    // data: { senderId, receiverId, text, rideId }
    io.to(data.receiverId).emit('message', {
      ...data,
      time: new Date().toISOString(),
    });
  });

  // Driver location update
  socket.on('location_update', (data) => {
    // data: { rideId, driverId, lat, lng }
    // Emit to all passengers of this ride
    socket.to(`ride_${data.rideId}`).emit('driver_location', {
      lat: data.lat,
      lng: data.lng,
      timestamp: Date.now(),
    });
  });

  // Join a ride room (for tracking)
  socket.on('join_ride_room', (rideId) => {
    socket.join(`ride_${rideId}`);
  });

  socket.on('disconnect', () => {
    for (const [uid, sid] of connectedUsers.entries()) {
      if (sid === socket.id) { connectedUsers.delete(uid); break; }
    }
    console.log('Socket disconnected:', socket.id);
  });
});

// ── Start ─────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`\n🚀 GU RideShare API running on port ${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/health`);
  console.log(`   Mode:   ${process.env.NODE_ENV || 'development'}\n`);
});

require('dotenv').config();

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// =====================================================
// CONFIGURATION
// =====================================================

const PORT = process.env.PORT || 5000;

const CLIENT_URL =
  process.env.CLIENT_URL || 'http://localhost:3000';

// Allowed frontend URLs
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://gu-rideshare-rho.vercel.app',
  'https://gu-rideshare-ad5808d-surya-ad54.vercel.app',
  CLIENT_URL
].filter(Boolean);

// Remove duplicate URLs
const uniqueOrigins = [...new Set(allowedOrigins)];

console.log('🌐 Allowed Origins:', uniqueOrigins);

// =====================================================
// CORS
// =====================================================

const corsOptions = {
  origin: function (origin, callback) {

    // Allow requests without origin
    // (Postman, server-to-server, etc.)
    if (!origin) {
      return callback(null, true);
    }

    if (uniqueOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.log('❌ CORS blocked origin:', origin);

    return callback(
      new Error(`CORS blocked: ${origin}`)
    );
  },

  credentials: true
};

app.use(cors(corsOptions));

app.use(express.json());

// =====================================================
// SOCKET.IO
// =====================================================

const io = new Server(server, {
  cors: {
    origin: uniqueOrigins,
    credentials: true
  }
});

app.set('io', io);

// =====================================================
// MONGODB
// =====================================================

if (!process.env.MONGODB_URI) {

  console.error(
    '❌ MONGODB_URI is missing in .env file'
  );

} else {

  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      console.log('✅ MongoDB connected successfully');
    })
    .catch((err) => {
      console.error(
        '❌ MongoDB connection error:',
        err.message
      );
    });
}

// =====================================================
// ROUTES
// =====================================================

app.use(
  '/api/auth',
  require('./routes/auth')
);

app.use(
  '/api/rides',
  require('./routes/rides')
);

const {
  messagesRouter,
  ratingsRouter
} = require('./routes/messages');

app.use(
  '/api/messages',
  messagesRouter
);

app.use(
  '/api/ratings',
  ratingsRouter
);

// =====================================================
// HEALTH CHECK
// =====================================================

app.get('/health', (req, res) => {

  res.status(200).json({

    status: 'ok',

    app: 'GU RideShare API',

    message:
      'Backend is running successfully'

  });

});

// =====================================================
// ROOT ROUTE
// =====================================================

app.get('/', (req, res) => {

  res.json({

    message:
      'GU RideShare Backend API',

    status: 'running'

  });

});

// =====================================================
// 404 HANDLER
// =====================================================

app.use((req, res) => {

  res.status(404).json({

    error: 'Route not found',

    path: req.originalUrl

  });

});

// =====================================================
// ERROR HANDLER
// =====================================================

app.use((err, req, res, next) => {

  console.error(
    '❌ Server error:',
    err
  );

  res.status(500).json({

    error:
      'Internal server error'

  });

});

// =====================================================
// SOCKET.IO EVENTS
// =====================================================

const connectedUsers = new Map();

io.on('connection', (socket) => {

  console.log(
    '🔌 Socket connected:',
    socket.id
  );

  // ---------------------------------------------------
  // Register user
  // ---------------------------------------------------

  socket.on('register', (userId) => {

    if (!userId) {
      return;
    }

    connectedUsers.set(
      String(userId),
      socket.id
    );

    socket.join(
      String(userId)
    );

    console.log(
      `👤 User ${userId} registered on socket ${socket.id}`
    );

  });

  // ---------------------------------------------------
  // Send message
  // ---------------------------------------------------

  socket.on('send_message', (data) => {

    if (!data) {
      return;
    }

    const {
      senderId,
      receiverId,
      text,
      rideId
    } = data;

    if (!receiverId || !text) {
      return;
    }

    io
      .to(String(receiverId))
      .emit('message', {

        senderId,
        receiverId,
        text,
        rideId,

        time:
          new Date().toISOString()

      });

  });

  // ---------------------------------------------------
  // Driver location update
  // ---------------------------------------------------

  socket.on('location_update', (data) => {

    if (!data) {
      return;
    }

    const {
      rideId,
      driverId,
      lat,
      lng
    } = data;

    if (
      !rideId ||
      lat === undefined ||
      lng === undefined
    ) {
      return;
    }

    socket
      .to(`ride_${rideId}`)
      .emit('driver_location', {

        driverId,
        lat,
        lng,

        timestamp:
          Date.now()

      });

  });

  // ---------------------------------------------------
  // Join ride room
  // ---------------------------------------------------

  socket.on('join_ride_room', (rideId) => {

    if (!rideId) {
      return;
    }

    socket.join(
      `ride_${rideId}`
    );

    console.log(
      `🚗 Socket ${socket.id} joined ride_${rideId}`
    );

  });

  // ---------------------------------------------------
  // Leave ride room
  // ---------------------------------------------------

  socket.on('leave_ride_room', (rideId) => {

    if (!rideId) {
      return;
    }

    socket.leave(
      `ride_${rideId}`
    );

    console.log(
      `🚪 Socket ${socket.id} left ride_${rideId}`
    );

  });

  // ---------------------------------------------------
  // Disconnect
  // ---------------------------------------------------

  socket.on('disconnect', () => {

    for (
      const [userId, socketId]
      of connectedUsers.entries()
    ) {

      if (socketId === socket.id) {

        connectedUsers.delete(userId);

        console.log(
          `👋 User ${userId} disconnected`
        );

        break;
      }

    }

    console.log(
      '🔌 Socket disconnected:',
      socket.id
    );

  });

});

// =====================================================
// START SERVER
// =====================================================

server.on('error', (error) => {

  if (error.code === 'EADDRINUSE') {

    console.error(
      `❌ Port ${PORT} is already being used.`
    );

    console.error(
      '👉 Stop the existing Node.js server and run again.'
    );

    process.exit(1);
  }

  console.error(
    '❌ Server error:',
    error
  );

});

server.listen(PORT, () => {

  console.log('');

  console.log(
    '========================================'
  );

  console.log(
    '🚀 GU RideShare API running'
  );

  console.log(
    '========================================'
  );

  console.log(
    `📡 Port: ${PORT}`
  );

  console.log(
    `🌐 Client URL: ${CLIENT_URL}`
  );

  console.log(
    `❤️ Health: http://localhost:${PORT}/health`
  );

  console.log(
    '🔌 Socket.IO: Enabled'
  );

  console.log(
    '========================================'
  );

  console.log('');

});
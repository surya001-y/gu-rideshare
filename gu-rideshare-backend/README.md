# 🚗 GU RideShare — Galgotias University

A full-stack campus ride-sharing app for Galgotias University students.  
Match with verified students on your route, split cab fare, and stop spamming WhatsApp groups.

---

## 📁 Project Structure

```
gu-rideshare/          ← React frontend
gu-rideshare-backend/  ← Node.js + Express backend
```

---

## 🛠 Tech Stack

| Layer     | Tech                                      |
|-----------|-------------------------------------------|
| Frontend  | React 18, React Router v6, Lucide Icons   |
| Backend   | Node.js, Express.js                       |
| Database  | MongoDB (Mongoose ODM)                    |
| Auth      | JWT + OTP via college email               |
| Realtime  | Socket.io (live chat + location tracking) |
| Email     | Nodemailer (Gmail SMTP)                   |

---

## ⚡ Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or MongoDB Atlas free tier)
- Gmail account with App Password

---

### 1. Clone / Set up folders

```bash
# Your project is already set up in two folders:
# gu-rideshare/           (frontend)
# gu-rideshare-backend/   (backend)
```

---

### 2. Backend Setup

```bash
cd gu-rideshare-backend

# Install dependencies
npm install

# Copy env template and fill in values
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/gu_rideshare
JWT_SECRET=pick_a_long_random_string_here
EMAIL_USER=youremail@gmail.com
EMAIL_PASS=your_gmail_app_password
CLIENT_URL=http://localhost:3000
```

**Getting Gmail App Password:**
1. Go to Google Account → Security
2. Enable 2-Step Verification
3. Search "App Passwords" → Create one for "Mail"
4. Use that 16-char password in `.env`

```bash
# Start backend (development)
npm run dev

# You should see:
# ✅ MongoDB connected
# 🚀 GU RideShare API running on port 5000
```

---

### 3. Frontend Setup

```bash
cd gu-rideshare

# Install dependencies
npm install

# Start React app
npm start

# Opens at http://localhost:3000
```

> **Note:** The frontend currently uses mock data. To connect to the live backend, create `src/api.js` with axios pointing to `http://localhost:5000/api` and wire up each page (see "Connecting Backend" below).

---

## 📱 Screens & Features

| Screen       | What it does                                            |
|--------------|---------------------------------------------------------|
| **Login**    | 3-step: name/email → OTP → verified. GU email only.    |
| **Find Ride**| Browse & filter rides. Quick destination shortcuts.    |
| **Ride Detail** | Driver profile, route, join request, live ETA.      |
| **Offer Ride** | Post your ride with all details + recurring toggle.  |
| **My Rides** | Live, upcoming, completed tabs. Rate after trip.       |
| **Chat**     | Real-time DMs with quick-reply shortcuts.              |
| **Profile**  | Stats, notifications, AI travel reminder, safety.      |

---

## 🔌 API Endpoints

### Auth
```
POST /api/auth/register      → Send OTP to GU email
POST /api/auth/verify-otp    → Verify OTP, returns JWT token
POST /api/auth/resend-otp    → Resend OTP
GET  /api/auth/me            → Get current user (auth required)
```

### Rides
```
GET    /api/rides            → List rides (with filters: ?to=&vehicle=&gender=&maxPrice=)
POST   /api/rides            → Create a ride
GET    /api/rides/:id        → Get ride details
POST   /api/rides/:id/join   → Request to join
PATCH  /api/rides/:id/passenger/:userId  → Accept/reject passenger
GET    /api/rides/my/offered → Rides I'm driving
GET    /api/rides/my/joined  → Rides I've joined
DELETE /api/rides/:id        → Cancel ride
```

### Messages
```
GET  /api/messages/conversations  → All conversations
GET  /api/messages/:userId        → Chat with a user
POST /api/messages               → Send a message
```

### Ratings
```
POST /api/ratings   → Rate a driver/passenger after trip
```

---

## 🔗 Connecting Frontend to Backend

Create `gu-rideshare/src/api.js`:

```javascript
import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:5000/api' });

// Attach JWT token to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('gu_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
```

Then in `Login.jsx`, replace the `setTimeout` with:
```javascript
// Register
const res = await api.post('/auth/register', { name, email, phone, year });

// Verify OTP
const res = await api.post('/auth/verify-otp', { email, otp: otp.join('') });
localStorage.setItem('gu_token', res.data.token);
```

---

## 🔴 Real-time (Socket.io)

Connect in your React app:

```javascript
import { io } from 'socket.io-client';
const socket = io('http://localhost:5000');
socket.emit('register', userId);       // on login
socket.on('message', (msg) => { ... }); // receive chat
socket.emit('join_ride_room', rideId); // for live tracking
socket.on('driver_location', ({ lat, lng }) => { ... });
```

---

## 🚀 Deployment

### Frontend → Vercel
```bash
cd gu-rideshare
npm run build
# Upload /build to Vercel (or use Vercel CLI: npx vercel)
```

### Backend → Railway / Render
1. Push `gu-rideshare-backend` to GitHub
2. Create new project on Railway or Render
3. Add environment variables from `.env`
4. Deploy — it auto-runs `npm start`

### Database → MongoDB Atlas (Free)
1. atlas.mongodb.com → Create free cluster
2. Create DB user + get connection string
3. Replace `MONGODB_URI` in your deployment env vars

---

## 🔒 Security Notes

- Only `@galgotiasuniversity.edu.in` emails can register (enforced in both frontend and backend)
- Passwords are bcrypt-hashed
- JWT tokens expire in 7 days
- OTPs expire in 10 minutes
- All ride/message endpoints require valid JWT

---

## 📦 Future Enhancements

- [ ] Google Maps integration for real route matching
- [ ] Push notifications (FCM)
- [ ] UPI/Razorpay split payment
- [ ] Admin dashboard for GU staff
- [ ] AI prediction: "Going home Friday?"
- [ ] Hostel-specific pickup zones

---

*Built for Galgotias University students. Stay safe, share rides, save money. 🚗*

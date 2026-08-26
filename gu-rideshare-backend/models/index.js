const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// ── User Model ────────────────────────────────────────────────────────────────
const userSchema = new mongoose.Schema({
  name:       { type: String, required: true, trim: true },
  email:      { type: String, required: true, unique: true, lowercase: true,
                validate: { validator: v => v.endsWith('@galgotiasuniversity.edu.in'), message: 'Must be a GU email' } },
  phone:      { type: String, required: true },
  year:       { type: String, enum: ['1st Year', '2nd Year', '3rd Year', '4th Year'], required: true },
  password:   { type: String, select: false },
  verified:   { type: Boolean, default: false },
  otp:        { code: String, expiresAt: Date },
  rating:     { avg: { type: Number, default: 5.0 }, count: { type: Number, default: 0 } },
  trips:      { type: Number, default: 0 },
  gender:     { type: String, enum: ['Male', 'Female', 'Other'] },
  vehicles:   [{ type: String, brand: String, model: String, color: String, plate: String }],
  emergencyContacts: [{ name: String, phone: String, relation: String }],
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) this.password = await bcrypt.hash(this.password, 10);
  next();
});
userSchema.methods.comparePassword = function (plain) { return bcrypt.compare(plain, this.password); };

// ── Ride Model ────────────────────────────────────────────────────────────────
const rideSchema = new mongoose.Schema({
  driver:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  from:       { text: String, lat: Number, lng: Number },
  to:         { text: String, lat: Number, lng: Number },
  date:       { type: Date, required: true },
  time:       { type: String, required: true },
  seats:      { total: { type: Number, required: true }, available: { type: Number, required: true } },
  price:      { type: Number, required: true },
  vehicle:    { type: String, enum: ['Hatchback', 'Sedan', 'SUV', 'Auto'], required: true },
  gender:     { type: String, enum: ['Any', 'Girls only', 'Boys only'], default: 'Any' },
  recurring:  { type: Boolean, default: false },
  status:     { type: String, enum: ['active', 'full', 'completed', 'cancelled'], default: 'active' },
  passengers: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' } }],
  notes:      String,
}, { timestamps: true });

// ── Message Model ─────────────────────────────────────────────────────────────
const messageSchema = new mongoose.Schema({
  ride:       { type: mongoose.Schema.Types.ObjectId, ref: 'Ride' },
  sender:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text:       { type: String, required: true },
  read:       { type: Boolean, default: false },
}, { timestamps: true });

// ── Rating Model ──────────────────────────────────────────────────────────────
const ratingSchema = new mongoose.Schema({
  ride:       { type: mongoose.Schema.Types.ObjectId, ref: 'Ride', required: true },
  rater:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rated:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  stars:      { type: Number, min: 1, max: 5, required: true },
  comment:    String,
  type:       { type: String, enum: ['driver', 'passenger'] },
}, { timestamps: true });

module.exports = {
  User: mongoose.model('User', userSchema),
  Ride: mongoose.model('Ride', rideSchema),
  Message: mongoose.model('Message', messageSchema),
  Rating: mongoose.model('Rating', ratingSchema),
};

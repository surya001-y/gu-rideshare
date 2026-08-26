const router = require('express').Router();
const auth = require('../middleware/auth');
const { Message, Rating, User } = require('../models');

// ── Messages ──────────────────────────────────────────────────────────────────

// GET /api/messages/conversations  — list unique conversations
router.get('/conversations', auth, async (req, res) => {
  try {
    const msgs = await Message.find({
      $or: [{ sender: req.user._id }, { receiver: req.user._id }]
    }).sort({ createdAt: -1 }).populate('sender receiver', 'name year');

    // Deduplicate by conversation partner
    const seen = new Set();
    const convos = [];
    for (const m of msgs) {
      const partner = m.sender._id.toString() === req.user._id.toString() ? m.receiver : m.sender;
      if (!seen.has(partner._id.toString())) {
        seen.add(partner._id.toString());
        const unread = await Message.countDocuments({ sender: partner._id, receiver: req.user._id, read: false });
        convos.push({ partner, lastMessage: m.text, lastTime: m.createdAt, unread });
      }
    }
    res.json(convos);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/messages/:userId  — get conversation with a user
router.get('/:userId', auth, async (req, res) => {
  try {
    const msgs = await Message.find({
      $or: [
        { sender: req.user._id, receiver: req.params.userId },
        { sender: req.params.userId, receiver: req.user._id },
      ]
    }).sort({ createdAt: 1 }).populate('sender', 'name');

    // Mark as read
    await Message.updateMany({ sender: req.params.userId, receiver: req.user._id, read: false }, { read: true });
    res.json(msgs);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/messages  — send a message (also emitted via socket)
router.post('/', auth, async (req, res) => {
  try {
    const { receiverId, text, rideId } = req.body;
    const msg = await Message.create({ sender: req.user._id, receiver: receiverId, text, ride: rideId });
    await msg.populate('sender', 'name');
    // Socket.io emission is handled in server.js
    req.app.get('io')?.to(receiverId).emit('message', msg);
    res.status(201).json(msg);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// ── Ratings ───────────────────────────────────────────────────────────────────
const ratingsRouter = require('express').Router();

// POST /api/ratings
ratingsRouter.post('/', auth, async (req, res) => {
  try {
    const { rideId, ratedUserId, stars, comment, type } = req.body;
    const existing = await Rating.findOne({ ride: rideId, rater: req.user._id, rated: ratedUserId });
    if (existing) return res.status(400).json({ error: 'Already rated' });

    const rating = await Rating.create({ ride: rideId, rater: req.user._id, rated: ratedUserId, stars, comment, type });

    // Update user's avg rating
    const allRatings = await Rating.find({ rated: ratedUserId });
    const avg = allRatings.reduce((s, r) => s + r.stars, 0) / allRatings.length;
    await User.findByIdAndUpdate(ratedUserId, { 'rating.avg': Math.round(avg * 10) / 10, 'rating.count': allRatings.length });

    res.status(201).json(rating);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = { messagesRouter: router, ratingsRouter };

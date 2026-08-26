const router = require('express').Router();
const auth = require('../middleware/auth');
const { Ride, User } = require('../models');

// GET /api/rides?to=&vehicle=&gender=&maxPrice=&date=
router.get('/', auth, async (req, res) => {
  try {
    const { to, vehicle, gender, maxPrice, date } = req.query;
    const query = { status: 'active', 'seats.available': { $gt: 0 }, driver: { $ne: req.user._id } };

    if (to)       query['to.text'] = { $regex: to, $options: 'i' };
    if (vehicle && vehicle !== 'Any') query.vehicle = vehicle;
    if (gender && gender !== 'Any')   query.gender = { $in: ['Any', gender] };
    if (maxPrice) query.price = { $lte: +maxPrice };
    if (date)     { const d = new Date(date); query.date = { $gte: d, $lt: new Date(d.getTime() + 86400000) }; }

    const rides = await Ride.find(query)
      .populate('driver', 'name year rating trips gender')
      .sort({ date: 1 })
      .limit(20);

    res.json(rides);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/rides  — create a ride
router.post('/', auth, async (req, res) => {
  try {
    const { from, to, date, time, seats, price, vehicle, gender, recurring, notes } = req.body;
    const ride = await Ride.create({
      driver: req.user._id,
      from, to,
      date: new Date(date),
      time, price, vehicle, gender, recurring, notes,
      seats: { total: seats, available: seats },
    });
    await ride.populate('driver', 'name year rating trips');
    res.status(201).json(ride);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/rides/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id).populate('driver', 'name year rating trips gender phone').populate('passengers.user', 'name year');
    if (!ride) return res.status(404).json({ error: 'Ride not found' });
    res.json(ride);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/rides/:id/join  — request to join
router.post('/:id/join', auth, async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) return res.status(404).json({ error: 'Ride not found' });
    if (ride.seats.available < 1) return res.status(400).json({ error: 'Ride is full' });
    const already = ride.passengers.find(p => p.user.toString() === req.user._id.toString());
    if (already) return res.status(400).json({ error: 'Already requested' });
    ride.passengers.push({ user: req.user._id, status: 'pending' });
    await ride.save();
    res.json({ message: 'Join request sent. Driver will confirm.' });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// PATCH /api/rides/:id/passenger/:userId — driver accepts/rejects
router.patch('/:id/passenger/:userId', auth, async (req, res) => {
  try {
    const { status } = req.body; // 'accepted' | 'rejected'
    const ride = await Ride.findById(req.params.id);
    if (!ride) return res.status(404).json({ error: 'Ride not found' });
    if (ride.driver.toString() !== req.user._id.toString()) return res.status(403).json({ error: 'Not your ride' });
    const p = ride.passengers.find(p => p.user.toString() === req.params.userId);
    if (!p) return res.status(404).json({ error: 'Passenger not found' });
    p.status = status;
    if (status === 'accepted') {
      ride.seats.available = Math.max(0, ride.seats.available - 1);
      if (ride.seats.available === 0) ride.status = 'full';
    }
    await ride.save();
    res.json(ride);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/rides/my/offered  — rides I'm driving
router.get('/my/offered', auth, async (req, res) => {
  const rides = await Ride.find({ driver: req.user._id }).sort({ date: -1 });
  res.json(rides);
});

// GET /api/rides/my/joined  — rides I joined
router.get('/my/joined', auth, async (req, res) => {
  const rides = await Ride.find({ 'passengers.user': req.user._id }).populate('driver', 'name year rating').sort({ date: -1 });
  res.json(rides);
});

// DELETE /api/rides/:id  — cancel ride (driver)
router.delete('/:id', auth, async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) return res.status(404).json({ error: 'Not found' });
    if (ride.driver.toString() !== req.user._id.toString()) return res.status(403).json({ error: 'Forbidden' });
    ride.status = 'cancelled';
    await ride.save();
    res.json({ message: 'Ride cancelled' });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

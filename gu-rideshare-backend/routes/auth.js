const router = require('express').Router();
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { User } = require('../models');

const genOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const sendMail = async (to, otp) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: +process.env.EMAIL_PORT,
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });
  await transporter.sendMail({
    from: `"GU RideShare" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Your GU RideShare OTP',
    html: `
      <div style="font-family:sans-serif;max-width:400px;margin:auto;padding:24px;background:#0f172a;color:#f1f5f9;border-radius:12px">
        <h2 style="color:#f97316;margin:0 0 12px">GU RideShare</h2>
        <p style="color:#94a3b8;margin:0 0 20px">Your verification code is:</p>
        <div style="background:#1e293b;border-radius:8px;padding:20px;text-align:center;letter-spacing:10px;font-size:32px;font-weight:700;color:#f97316">${otp}</div>
        <p style="color:#64748b;font-size:12px;margin-top:20px">Expires in 10 minutes. Do not share with anyone.</p>
      </div>`,
  });
};

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, year } = req.body;
    if (!email.endsWith('@galgotiasuniversity.edu.in'))
      return res.status(400).json({ error: 'Must use a GU email address' });

    let user = await User.findOne({ email });
    const otp = genOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    if (user) {
      user.otp = { code: otp, expiresAt };
    } else {
      user = new User({ name, email, phone, year, otp: { code: otp, expiresAt } });
    }
    await user.save();
    await sendMail(email, otp);
    res.json({ message: 'OTP sent to your GU email' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/auth/verify-otp
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (!user.otp?.code || user.otp.code !== otp)
      return res.status(400).json({ error: 'Invalid OTP' });
    if (new Date() > user.otp.expiresAt)
      return res.status(400).json({ error: 'OTP expired. Request a new one.' });

    user.verified = true;
    user.otp = undefined;
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, year: user.year, verified: user.verified } });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/auth/resend-otp
router.post('/resend-otp', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });
    const otp = genOTP();
    user.otp = { code: otp, expiresAt: new Date(Date.now() + 10 * 60 * 1000) };
    await user.save();
    await sendMail(email, otp);
    res.json({ message: 'New OTP sent' });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/auth/me
router.get('/me', require('../middleware/auth'), (req, res) => {
  res.json(req.user);
});

module.exports = router;

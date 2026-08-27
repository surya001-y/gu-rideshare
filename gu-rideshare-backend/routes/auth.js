const router = require('express').Router();
const jwt = require('jsonwebtoken');
const { Resend } = require('resend');
const { User } = require('../models');

// ============================================
// RESEND
// ============================================

const resend = new Resend(process.env.RESEND_API_KEY);

// ============================================
// Generate 6 Digit OTP
// ============================================

const genOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// ============================================
// Validate Email
// ============================================

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// ============================================
// Send OTP Email using Resend
// ============================================

const sendMail = async (to, otp) => {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is missing');
  }

  const fromEmail =
    process.env.EMAIL_FROM || 'GU RideShare <onboarding@resend.dev>';

  const { data, error } = await resend.emails.send({
    from: fromEmail,
    to: [to],
    subject: 'Your GU RideShare Verification OTP',

    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>GU RideShare OTP</title>
      </head>

      <body
        style="
          margin:0;
          padding:0;
          background:#0f172a;
          font-family:Arial,sans-serif;
        "
      >

        <div
          style="
            max-width:420px;
            margin:40px auto;
            padding:30px;
            background:#111827;
            color:#f1f5f9;
            border-radius:16px;
          "
        >

          <h1
            style="
              margin:0 0 10px;
              color:#f97316;
              font-size:26px;
            "
          >
            GU RideShare
          </h1>

          <p
            style="
              color:#94a3b8;
              font-size:14px;
              margin-bottom:25px;
            "
          >
            Verify your email address to continue.
          </p>

          <div
            style="
              background:#1e293b;
              border-radius:12px;
              padding:22px;
              text-align:center;
            "
          >

            <p
              style="
                margin:0 0 10px;
                color:#94a3b8;
                font-size:13px;
              "
            >
              Your verification code
            </p>

            <div
              style="
                font-size:34px;
                font-weight:bold;
                letter-spacing:10px;
                color:#f97316;
              "
            >
              ${otp}
            </div>

          </div>

          <p
            style="
              color:#64748b;
              font-size:12px;
              margin-top:22px;
              line-height:1.5;
            "
          >
            This OTP will expire in 10 minutes.
            Do not share this code with anyone.
          </p>

          <p
            style="
              color:#64748b;
              font-size:12px;
              margin-top:20px;
            "
          >
            GU RideShare
          </p>

        </div>

      </body>
      </html>
    `,
  });

  if (error) {
    console.error('❌ Resend email error:', error);
    throw new Error(error.message || 'Unable to send email');
  }

  console.log('✅ OTP email sent:', data?.id);

  return data;
};

// ============================================
// POST /api/auth/register
// ============================================

router.post('/register', async (req, res) => {
  try {
    let { name, email, phone, year } = req.body;

    // Required fields
    if (!name || !email || !phone || !year) {
      return res.status(400).json({
        error: 'Name, email, phone and year are required',
      });
    }

    // Normalize email
    email = email.trim().toLowerCase();

    // Validate email
    if (!isValidEmail(email)) {
      return res.status(400).json({
        error: 'Please enter a valid email address',
      });
    }

    // Generate OTP
    const otp = genOTP();

    // OTP expires in 10 minutes
    const expiresAt = new Date(
      Date.now() + 10 * 60 * 1000
    );

    // Find existing user
    let user = await User.findOne({ email });

    if (user) {
      user.name = name.trim();
      user.phone = phone.trim();
      user.year = year;

      user.otp = {
        code: otp,
        expiresAt,
      };

      user.verified = false;
    } else {
      user = new User({
        name: name.trim(),
        email,
        phone: phone.trim(),
        year,
        verified: false,

        otp: {
          code: otp,
          expiresAt,
        },
      });
    }

    // Save user
    await user.save();

    console.log(`📧 Sending OTP to: ${email}`);

    // Send OTP
    await sendMail(email, otp);

    return res.json({
      success: true,
      message: 'OTP sent successfully to your email',
    });

  } catch (err) {
    console.error('❌ Register error:', err);

    return res.status(500).json({
      error: err.message || 'Unable to send OTP. Please try again.',
    });
  }
});

// ============================================
// POST /api/auth/verify-otp
// ============================================

router.post('/verify-otp', async (req, res) => {
  try {
    let { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        error: 'Email and OTP are required',
      });
    }

    email = email.trim().toLowerCase();
    otp = otp.toString().trim();

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        error: 'User not found. Please register first.',
      });
    }

    if (!user.otp || !user.otp.code) {
      return res.status(400).json({
        error: 'No OTP found. Please request a new OTP.',
      });
    }

    if (user.otp.code !== otp) {
      return res.status(400).json({
        error: 'Invalid OTP. Please enter the correct OTP.',
      });
    }

    if (
      !user.otp.expiresAt ||
      new Date() > user.otp.expiresAt
    ) {
      return res.status(400).json({
        error: 'OTP expired. Please request a new OTP.',
      });
    }

    // Verify user
    user.verified = true;

    // Remove OTP
    user.otp = undefined;

    await user.save();

    // Create JWT
    const token = jwt.sign(
      {
        id: user._id.toString(),
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRE || '7d',
      }
    );

    return res.json({
      success: true,
      message: 'Email verified successfully',

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        year: user.year,
        verified: user.verified,
      },
    });

  } catch (err) {
    console.error('❌ Verify OTP error:', err);

    return res.status(500).json({
      error: 'Unable to verify OTP. Please try again.',
    });
  }
});

// ============================================
// POST /api/auth/resend-otp
// ============================================

router.post('/resend-otp', async (req, res) => {
  try {
    let { email } = req.body;

    if (!email) {
      return res.status(400).json({
        error: 'Email is required',
      });
    }

    email = email.trim().toLowerCase();

    if (!isValidEmail(email)) {
      return res.status(400).json({
        error: 'Please enter a valid email address',
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        error: 'User not found. Please register first.',
      });
    }

    // Generate new OTP
    const otp = genOTP();

    const expiresAt = new Date(
      Date.now() + 10 * 60 * 1000
    );

    user.otp = {
      code: otp,
      expiresAt,
    };

    await user.save();

    console.log(`📧 Resending OTP to: ${email}`);

    await sendMail(email, otp);

    return res.json({
      success: true,
      message: 'New OTP sent successfully',
    });

  } catch (err) {
    console.error('❌ Resend OTP error:', err);

    return res.status(500).json({
      error: err.message || 'Unable to resend OTP. Please try again.',
    });
  }
});

// ============================================
// GET /api/auth/me
// ============================================

router.get(
  '/me',
  require('../middleware/auth'),
  (req, res) => {
    return res.json(req.user);
  }
);

// ============================================
// EXPORT
// ============================================

module.exports = router;
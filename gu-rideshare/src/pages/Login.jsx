import { useState } from 'react';
import { Car, Shield, ArrowRight } from 'lucide-react';
import api from '../api';

export default function Login({ onLogin }) {
  // welcome | register | otp
  const [step, setStep] = useState('welcome');

  const [form, setForm] = useState({
    name: '',
    email: '',
    year: '',
    phone: '',
  });

  const [otp, setOtp] = useState([
    '',
    '',
    '',
    '',
    '',
    '',
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // ─────────────────────────────────────────────
  // Features
  // ─────────────────────────────────────────────

  const features = [
    {
      icon: '🚗',
      text: 'Match with students on your route',
    },
    {
      icon: '💸',
      text: 'Split cab fare, save money',
    },
    {
      icon: '🔒',
      text: 'Verified users only',
    },
    {
      icon: '⭐',
      text: 'Ratings & reviews for safety',
    },
  ];

  // ─────────────────────────────────────────────
  // Register / Send OTP
  // ─────────────────────────────────────────────

  const handleRegister = async (e) => {
    e.preventDefault();

    setError('');
    setSuccess('');

    const email = form.email.trim().toLowerCase();

    // Allow ANY valid email address
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!form.name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    if (!form.year) {
      setError('Please select your year.');
      return;
    }

    if (!form.phone.trim()) {
      setError('Please enter your phone number.');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/register', {
        name: form.name.trim(),
        email: email,
        year: form.year,
        phone: form.phone.trim(),
      });

      console.log('REGISTER RESPONSE:', response.data);

      setForm((prev) => ({
        ...prev,
        email: email,
      }));

      setOtp([
        '',
        '',
        '',
        '',
        '',
        '',
      ]);

      setSuccess(
        response.data?.message ||
          'OTP sent successfully to your email.'
      );

      setStep('otp');
    } catch (error) {
      console.error('REGISTER ERROR:', error);

      setError(
        error.response?.data?.error ||
          error.response?.data?.message ||
          'Unable to send OTP. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────
  // OTP Input
  // ─────────────────────────────────────────────

  const handleOtpChange = (index, value) => {
    // Only one digit
    if (value && !/^\d$/.test(value)) {
      return;
    }

    const nextOtp = [...otp];

    nextOtp[index] = value;

    setOtp(nextOtp);

    // Move to next box
    if (value && index < 5) {
      document
        .getElementById(`otp-${index + 1}`)
        ?.focus();
    }
  };

  // ─────────────────────────────────────────────
  // Verify OTP
  // ─────────────────────────────────────────────

  const handleVerify = async () => {
    setError('');
    setSuccess('');

    const otpValue = otp.join('');

    if (otpValue.length !== 6) {
      setError('Please enter the complete 6-digit OTP.');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post(
        '/auth/verify-otp',
        {
          email: form.email.trim().toLowerCase(),
          otp: otpValue,
        }
      );

      console.log(
        'VERIFY RESPONSE:',
        response.data
      );

      // Save JWT
      if (response.data?.token) {
        localStorage.setItem(
          'token',
          response.data.token
        );
      }

      // Save actual logged-in user
      if (response.data?.user) {
        localStorage.setItem(
          'user',
          JSON.stringify(response.data.user)
        );
      }

      setSuccess('Login successful!');

      // Pass actual user to App
      setTimeout(() => {
        onLogin(response.data?.user);
      }, 300);
    } catch (error) {
      console.error('VERIFY ERROR:', error);

      setError(
        error.response?.data?.error ||
          error.response?.data?.message ||
          'Invalid OTP. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────
  // Resend OTP
  // ─────────────────────────────────────────────

  const handleResendOTP = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await api.post(
        '/auth/resend-otp',
        {
          email: form.email
            .trim()
            .toLowerCase(),
        }
      );

      setSuccess(
        response.data?.message ||
          'New OTP sent successfully.'
      );

      setOtp([
        '',
        '',
        '',
        '',
        '',
        '',
      ]);
    } catch (error) {
      console.error('RESEND ERROR:', error);

      setError(
        error.response?.data?.error ||
          error.response?.data?.message ||
          'Unable to resend OTP.'
      );
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────
  // Welcome Page
  // ─────────────────────────────────────────────

  if (step === 'welcome') {
    return (
      <div
        style={{
          minHeight: '100dvh',
          background: 'var(--bg)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{
            padding: '60px 24px 30px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 50,
            }}
          >
            <Car
              size={28}
              color="var(--accent)"
            />

            <span
              style={{
                fontFamily:
                  'var(--font-display)',
                fontWeight: 800,
                fontSize: 20,
              }}
            >
              GU RideShare
            </span>
          </div>

          <h1
            style={{
              fontFamily:
                'var(--font-display)',
              fontWeight: 800,
              fontSize: 42,
              lineHeight: 1.1,
              letterSpacing: '-1px',
              marginBottom: 14,
            }}
          >
            Ride together,
            <br />
            <span
              style={{
                color: 'var(--accent)',
              }}
            >
              save together.
            </span>
          </h1>

          <p
            style={{
              color: 'var(--text2)',
              fontSize: 15,
              lineHeight: 1.6,
            }}
          >
            Find students heading your way
            and share your ride.
          </p>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              marginTop: 35,
            }}
          >
            {features.map((feature, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <span
                  style={{
                    fontSize: 20,
                  }}
                >
                  {feature.icon}
                </span>

                <span
                  style={{
                    color: 'var(--text2)',
                    fontSize: 14,
                  }}
                >
                  {feature.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            padding: '0 24px 40px',
          }}
        >
          <button
            className="btn-primary"
            onClick={() => {
              setError('');
              setSuccess('');
              setStep('register');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            Get Started
            <ArrowRight size={16} />
          </button>

          <p
            style={{
              textAlign: 'center',
              color: 'var(--text3)',
              fontSize: 12,
              marginTop: 14,
            }}
          >
            Login with any valid email address
          </p>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────
  // Register Page
  // ─────────────────────────────────────────────

  if (step === 'register') {
    return (
      <div
        style={{
          minHeight: '100dvh',
          background: 'var(--bg)',
          padding: '40px 24px',
        }}
      >
        <button
          className="btn-ghost"
          onClick={() => {
            setError('');
            setSuccess('');
            setStep('welcome');
          }}
          style={{
            marginBottom: 28,
            color: 'var(--text2)',
          }}
        >
          ← Back
        </button>

        <h2
          style={{
            fontFamily:
              'var(--font-display)',
            fontWeight: 800,
            fontSize: 28,
            marginBottom: 6,
          }}
        >
          Create account
        </h2>

        <p
          style={{
            color: 'var(--text2)',
            fontSize: 13,
            marginBottom: 28,
          }}
        >
          Enter your email to receive a
          verification OTP
        </p>

        {error && (
          <div
            style={{
              background: '#451a1a',
              border: '1px solid #dc2626',
              color: '#fca5a5',
              padding: '12px 14px',
              borderRadius: 10,
              marginBottom: 20,
              fontSize: 13,
            }}
          >
            {error}
          </div>
        )}

        {success && (
          <div
            style={{
              background: '#123524',
              border: '1px solid #16a34a',
              color: '#86efac',
              padding: '12px 14px',
              borderRadius: 10,
              marginBottom: 20,
              fontSize: 13,
            }}
          >
            {success}
          </div>
        )}

        <form onSubmit={handleRegister}>
          <div className="input-group">
            <label>Full Name</label>

            <input
              className="input-field"
              placeholder="e.g. Suryansh Yadav"
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
              required
            />
          </div>

          <div className="input-group">
            <label>Email Address</label>

            <input
              className="input-field"
              type="email"
              placeholder="example@gmail.com"
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
              required
            />
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                '1fr 1fr',
              gap: 12,
            }}
          >
            <div className="input-group">
              <label>Year</label>

              <select
                className="input-field"
                value={form.year}
                onChange={(e) =>
                  setForm({
                    ...form,
                    year: e.target.value,
                  })
                }
                required
              >
                <option value="">
                  Select
                </option>

                <option>1st Year</option>
                <option>2nd Year</option>
                <option>3rd Year</option>
                <option>4th Year</option>
              </select>
            </div>

            <div className="input-group">
              <label>Phone</label>

              <input
                className="input-field"
                type="tel"
                placeholder="+91 98765..."
                value={form.phone}
                onChange={(e) =>
                  setForm({
                    ...form,
                    phone: e.target.value,
                  })
                }
                required
              />
            </div>
          </div>

          <div
            style={{
              background: 'var(--surface)',
              border:
                '1px solid var(--border)',
              borderRadius: 10,
              padding: '12px 14px',
              marginBottom: 20,
              display: 'flex',
              gap: 10,
              alignItems: 'center',
            }}
          >
            <Shield
              size={16}
              color="var(--teal)"
              style={{
                flexShrink: 0,
              }}
            />

            <span
              style={{
                fontSize: 12,
                color: 'var(--text2)',
              }}
            >
              Your email will be verified
              using a one-time OTP.
            </span>
          </div>

          <button
            className="btn-primary"
            type="submit"
            disabled={loading}
          >
            {loading
              ? 'Sending OTP...'
              : 'Send Verification OTP'}
          </button>
        </form>
      </div>
    );
  }

  // ─────────────────────────────────────────────
  // OTP Page
  // ─────────────────────────────────────────────

  if (step === 'otp') {
    return (
      <div
        style={{
          minHeight: '100dvh',
          background: 'var(--bg)',
          padding: '40px 24px',
        }}
      >
        <button
          className="btn-ghost"
          onClick={() => {
            setError('');
            setSuccess('');
            setStep('register');
          }}
          style={{
            marginBottom: 28,
            color: 'var(--text2)',
          }}
        >
          ← Back
        </button>

        <h2
          style={{
            fontFamily:
              'var(--font-display)',
            fontWeight: 800,
            fontSize: 28,
            marginBottom: 6,
          }}
        >
          Verify your email
        </h2>

        <p
          style={{
            color: 'var(--text2)',
            fontSize: 13,
            marginBottom: 32,
          }}
        >
          OTP sent to{' '}
          <strong
            style={{
              color: 'var(--text)',
            }}
          >
            {form.email}
          </strong>
        </p>

        {error && (
          <div
            style={{
              background: '#451a1a',
              border: '1px solid #dc2626',
              color: '#fca5a5',
              padding: '12px 14px',
              borderRadius: 10,
              marginBottom: 20,
              fontSize: 13,
            }}
          >
            {error}
          </div>
        )}

        {success && (
          <div
            style={{
              background: '#123524',
              border: '1px solid #16a34a',
              color: '#86efac',
              padding: '12px 14px',
              borderRadius: 10,
              marginBottom: 20,
              fontSize: 13,
            }}
          >
            {success}
          </div>
        )}

        <div
          style={{
            display: 'flex',
            gap: 10,
            marginBottom: 32,
            justifyContent: 'center',
          }}
        >
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              maxLength={1}
              inputMode="numeric"
              value={digit}
              onChange={(e) =>
                handleOtpChange(
                  index,
                  e.target.value
                )
              }
              style={{
                width: 46,
                height: 56,
                textAlign: 'center',
                fontSize: 22,
                fontFamily:
                  'var(--font-display)',
                fontWeight: 700,
                background: digit
                  ? 'var(--surface2)'
                  : 'var(--surface)',
                border: `1px solid ${
                  digit
                    ? 'var(--accent)'
                    : 'var(--border)'
                }`,
                borderRadius: 10,
                color: 'var(--text)',
                outline: 'none',
              }}
            />
          ))}
        </div>

        <button
          className="btn-primary"
          onClick={handleVerify}
          disabled={
            loading ||
            otp.join('').length !== 6
          }
          style={{
            marginBottom: 16,
          }}
        >
          {loading
            ? 'Verifying...'
            : 'Verify & Enter App'}
        </button>

        <p
          style={{
            textAlign: 'center',
            color: 'var(--text3)',
            fontSize: 13,
          }}
        >
          Didn't get it?{' '}
          <span
            onClick={
              loading
                ? undefined
                : handleResendOTP
            }
            style={{
              color: 'var(--accent)',
              cursor: loading
                ? 'default'
                : 'pointer',
            }}
          >
            Resend OTP
          </span>
        </p>
      </div>
    );
  }

  return null;
}
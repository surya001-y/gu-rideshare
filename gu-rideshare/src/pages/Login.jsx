import { useState } from 'react';

import {
  Car,
  Shield,
  ArrowRight,
  CheckCircle2,
  Users,
  Wallet,
  Star,
  MapPin,
  Mail,
  Phone,
  GraduationCap,
  User,
  LockKeyhole,
} from 'lucide-react';

import api from '../api';

export default function Login({ onLogin }) {
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

  // =========================================================
  // FEATURES
  // =========================================================

  const features = [
    {
      icon: <Users size={19} />,
      title: 'Find your route',
      text: 'Match with students heading your way',
    },
    {
      icon: <Wallet size={19} />,
      title: 'Save money',
      text: 'Split your cab fare with fellow students',
    },
    {
      icon: <Shield size={19} />,
      title: 'Verified community',
      text: 'Connect with verified students',
    },
    {
      icon: <Star size={19} />,
      title: 'Ride with confidence',
      text: 'Ratings and reviews for safer rides',
    },
  ];

  // =========================================================
  // REGISTER
  // =========================================================

  const handleRegister = async (e) => {
    e.preventDefault();

    setError('');
    setSuccess('');

    const email = form.email.trim().toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
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
        email,
        year: form.year,
        phone: form.phone.trim(),
      });

      console.log('REGISTER RESPONSE:', response.data);

      setForm((prev) => ({
        ...prev,
        email,
      }));

      setOtp(['', '', '', '', '', '']);

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

  // =========================================================
  // OTP INPUT
  // =========================================================

  const handleOtpChange = (index, value) => {
    if (value && !/^\d$/.test(value)) {
      return;
    }

    const nextOtp = [...otp];
    nextOtp[index] = value;

    setOtp(nextOtp);

    if (value && index < 5) {
      document
        .getElementById(`otp-${index + 1}`)
        ?.focus();
    }
  };

  // =========================================================
  // VERIFY OTP
  // =========================================================

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
      const response = await api.post('/auth/verify-otp', {
        email: form.email.trim().toLowerCase(),
        otp: otpValue,
      });

      console.log('VERIFY RESPONSE:', response.data);

      if (response.data?.token) {
        localStorage.setItem(
          'token',
          response.data.token
        );
      }

      if (response.data?.user) {
        localStorage.setItem(
          'user',
          JSON.stringify(response.data.user)
        );
      }

      setSuccess('Login successful!');

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

  // =========================================================
  // RESEND OTP
  // =========================================================

  const handleResendOTP = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await api.post('/auth/resend-otp', {
        email: form.email.trim().toLowerCase(),
      });

      setSuccess(
        response.data?.message ||
          'New OTP sent successfully.'
      );

      setOtp(['', '', '', '', '', '']);

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

  // =========================================================
  // WELCOME PAGE
  // =========================================================

  if (step === 'welcome') {
    return (
      <div
        style={{
          minHeight: '100dvh',
          position: 'relative',
          overflow: 'hidden',
          background: '#050c1b',
          color: '#fff',
        }}
      >

        <img
          src="/campus-bg.jpg"
          alt="Galgotias University Campus"
          style={{
            position: 'fixed',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            zIndex: 0,
          }}
        />

        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: `
              linear-gradient(
                90deg,
                rgba(5,12,27,0.97) 0%,
                rgba(5,12,27,0.90) 35%,
                rgba(5,12,27,0.72) 65%,
                rgba(5,12,27,0.55) 100%
              ),
              linear-gradient(
                180deg,
                rgba(5,12,27,0.45) 0%,
                rgba(5,12,27,0.65) 70%,
                rgba(5,12,27,0.96) 100%
              )
            `,
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            position: 'fixed',
            width: 420,
            height: 420,
            borderRadius: '50%',
            background: 'rgba(255,111,0,0.10)',
            filter: 'blur(100px)',
            top: '-180px',
            right: '-120px',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            position: 'relative',
            zIndex: 2,
            minHeight: '100dvh',
            display: 'flex',
            flexDirection: 'column',
          }}
        >

          {/* NAVBAR */}

          <div
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '25px 32px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >

              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 11,
                  background: 'rgba(255,111,0,0.16)',
                  border:
                    '1px solid rgba(255,111,0,0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <Car
                  size={22}
                  color="var(--accent)"
                />
              </div>

              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 800,
                    fontSize: 19,
                  }}
                >
                  GU RideShare
                </div>

                <div
                  style={{
                    fontSize: 10,
                    color:
                      'rgba(255,255,255,0.52)',
                  }}
                >
                  Galgotias University
                </div>
              </div>

            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '7px 11px',
                borderRadius: 20,
                background:
                  'rgba(255,255,255,0.07)',
                border:
                  '1px solid rgba(255,255,255,0.13)',
                color:
                  'rgba(255,255,255,0.70)',
                fontSize: 11,
                backdropFilter: 'blur(12px)',
              }}
            >
              <Shield size={13} />
              Student Community
            </div>

          </div>


          {/* HERO */}

          <div
            style={{
              flex: 1,
              width: '100%',
              maxWidth: 1180,
              margin: '0 auto',
              padding: '45px 32px 35px',
              boxSizing: 'border-box',
              display: 'grid',
              gridTemplateColumns:
                'minmax(0, 1.1fr) minmax(320px, 0.7fr)',
              gap: 60,
              alignItems: 'center',
            }}
          >

            <div>

              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 7,
                  padding: '7px 12px',
                  borderRadius: 20,
                  background:
                    'rgba(255,111,0,0.13)',
                  border:
                    '1px solid rgba(255,111,0,0.30)',
                  color: '#ffad70',
                  fontSize: 11,
                  fontWeight: 600,
                  marginBottom: 18,
                }}
              >
                <MapPin size={13} />
                Built for GU students
              </div>

              <h1
                style={{
                  fontFamily:
                    'var(--font-display)',
                  fontWeight: 800,
                  fontSize:
                    'clamp(42px, 6vw, 72px)',
                  lineHeight: 1.02,
                  letterSpacing: '-2.5px',
                  margin: 0,
                  maxWidth: 720,
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
                  color:
                    'rgba(255,255,255,0.70)',
                  fontSize: 16,
                  lineHeight: 1.7,
                  maxWidth: 570,
                  margin: '20px 0 0',
                }}
              >
                Find students heading your way,
                share your ride and split the fare.
                Your daily campus commute just got
                easier.
              </p>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    'repeat(2, minmax(0, 1fr))',
                  gap: 10,
                  marginTop: 28,
                  maxWidth: 650,
                }}
              >

                {features.map(
                  (feature, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 11,
                        padding: '11px 12px',
                        borderRadius: 12,
                        background:
                          'rgba(255,255,255,0.055)',
                        border:
                          '1px solid rgba(255,255,255,0.10)',
                        backdropFilter:
                          'blur(12px)',
                      }}
                    >

                      <div
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: 9,
                          background:
                            'rgba(255,111,0,0.13)',
                          color:
                            'var(--accent)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        {feature.icon}
                      </div>

                      <div>
                        <div
                          style={{
                            color: '#fff',
                            fontSize: 12,
                            fontWeight: 700,
                          }}
                        >
                          {feature.title}
                        </div>

                        <div
                          style={{
                            color:
                              'rgba(255,255,255,0.50)',
                            fontSize: 10,
                            marginTop: 2,
                          }}
                        >
                          {feature.text}
                        </div>
                      </div>

                    </div>
                  )
                )}

              </div>

            </div>


            {/* RIGHT CARD */}

            <div
              style={{
                background:
                  'rgba(10,20,39,0.58)',
                border:
                  '1px solid rgba(255,255,255,0.15)',
                borderRadius: 24,
                padding: 22,
                boxShadow:
                  '0 25px 70px rgba(0,0,0,0.35)',
                backdropFilter: 'blur(18px)',
              }}
            >

              <div
                style={{
                  display: 'flex',
                  justifyContent:
                    'space-between',
                  alignItems: 'center',
                  marginBottom: 20,
                }}
              >

                <div>
                  <div
                    style={{
                      color:
                        'rgba(255,255,255,0.55)',
                      fontSize: 10,
                      textTransform:
                        'uppercase',
                      letterSpacing: 1,
                    }}
                  >
                    Campus rides
                  </div>

                  <div
                    style={{
                      color: '#fff',
                      fontSize: 20,
                      fontWeight: 700,
                      fontFamily:
                        'var(--font-display)',
                      marginTop: 5,
                    }}
                  >
                    Find your ride
                  </div>
                </div>

                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 11,
                    background:
                      'rgba(255,111,0,0.14)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color:
                      'var(--accent)',
                  }}
                >
                  <Car size={19} />
                </div>

              </div>

              <div
                style={{
                  background:
                    'rgba(255,255,255,0.06)',
                  border:
                    '1px solid rgba(255,255,255,0.10)',
                  borderRadius: 13,
                  padding: 13,
                  marginBottom: 9,
                }}
              >
                <div
                  style={{
                    color:
                      'rgba(255,255,255,0.40)',
                    fontSize: 10,
                    marginBottom: 5,
                  }}
                >
                  FROM
                </div>

                <div
                  style={{
                    color: '#fff',
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  Galgotias University
                </div>
              </div>

              <div
                style={{
                  background:
                    'rgba(255,255,255,0.06)',
                  border:
                    '1px solid rgba(255,255,255,0.10)',
                  borderRadius: 13,
                  padding: 13,
                }}
              >
                <div
                  style={{
                    color:
                      'rgba(255,255,255,0.40)',
                    fontSize: 10,
                    marginBottom: 5,
                  }}
                >
                  DESTINATION
                </div>

                <div
                  style={{
                    color: '#fff',
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  Noida Sector 18
                </div>
              </div>

              <div
                style={{
                  marginTop: 15,
                  padding: 13,
                  borderRadius: 13,
                  background:
                    'rgba(255,111,0,0.09)',
                  border:
                    '1px solid rgba(255,111,0,0.20)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent:
                      'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div
                      style={{
                        color:
                          'rgba(255,255,255,0.50)',
                        fontSize: 10,
                      }}
                    >
                      Example ride
                    </div>

                    <div
                      style={{
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: 13,
                        marginTop: 4,
                      }}
                    >
                      Today · 6:30 PM
                    </div>
                  </div>

                  <div
                    style={{
                      color:
                        'var(--accent)',
                      fontWeight: 800,
                      fontSize: 18,
                    }}
                  >
                    ₹80
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  color:
                    'rgba(255,255,255,0.48)',
                  fontSize: 10,
                  marginTop: 17,
                }}
              >
                <CheckCircle2
                  size={13}
                  color="#4ade80"
                />
                Verified student rides
              </div>

            </div>

          </div>


          {/* CTA */}

          <div
            style={{
              padding:
                '10px 32px 28px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
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
                width: '100%',
                maxWidth: 560,
                height: 52,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              Get Started
              <ArrowRight size={17} />
            </button>

            <p
              style={{
                textAlign: 'center',
                color:
                  'rgba(255,255,255,0.42)',
                fontSize: 11,
                margin: '11px 0 0',
              }}
            >
              Login with any valid email address
            </p>

          </div>

        </div>
      </div>
    );
  }


  // =========================================================
  // REGISTER / CREDENTIAL SCREEN
  // =========================================================

  if (step === 'register') {
    return (
      <div
        style={{
          minHeight: '100dvh',
          position: 'relative',
          overflow: 'hidden',
          background: '#050c1b',
          color: '#fff',
        }}
      >

        {/* BACKGROUND */}

        <img
          src="/campus-bg.jpg"
          alt="Galgotias University Campus"
          style={{
            position: 'fixed',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            opacity: 0.32,
            zIndex: 0,
          }}
        />

        {/* OVERLAY */}

        <div
          style={{
            position: 'fixed',
            inset: 0,
            background:
              'linear-gradient(135deg, rgba(5,12,27,0.97), rgba(5,12,27,0.82), rgba(5,12,27,0.97))',
            zIndex: 1,
          }}
        />

        {/* GLOW */}

        <div
          style={{
            position: 'fixed',
            width: 380,
            height: 380,
            borderRadius: '50%',
            background:
              'rgba(255,111,0,0.11)',
            filter: 'blur(100px)',
            top: '-180px',
            right: '-100px',
            zIndex: 1,
          }}
        />

        {/* CONTENT */}

        <div
          style={{
            position: 'relative',
            zIndex: 2,
            minHeight: '100dvh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '30px 20px',
            boxSizing: 'border-box',
          }}
        >

          {/* CARD */}

          <div
            style={{
              width: '100%',
              maxWidth: 540,
              background:
                'rgba(10,20,39,0.80)',
              border:
                '1px solid rgba(255,255,255,0.14)',
              borderRadius: 24,
              padding: '30px',
              boxSizing: 'border-box',
              backdropFilter: 'blur(22px)',
              WebkitBackdropFilter: 'blur(22px)',
              boxShadow:
                '0 25px 80px rgba(0,0,0,0.45)',
            }}
          >

            {/* BACK */}

            <button
              onClick={() => {
                setError('');
                setSuccess('');
                setStep('welcome');
              }}
              style={{
                background: 'none',
                border: 'none',
                color:
                  'rgba(255,255,255,0.58)',
                cursor: 'pointer',
                fontSize: 13,
                padding: 0,
                marginBottom: 25,
              }}
            >
              ← Back to home
            </button>


            {/* HEADER */}

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 13,
                marginBottom: 22,
              }}
            >

              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  background:
                    'rgba(255,111,0,0.14)',
                  border:
                    '1px solid rgba(255,111,0,0.30)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent)',
                }}
              >
                <Car size={23} />
              </div>

              <div>
                <h2
                  style={{
                    fontFamily:
                      'var(--font-display)',
                    fontSize: 27,
                    fontWeight: 800,
                    margin: 0,
                    letterSpacing: '-0.7px',
                  }}
                >
                  Create your account
                </h2>

                <p
                  style={{
                    color:
                      'rgba(255,255,255,0.52)',
                    fontSize: 12,
                    margin: '5px 0 0',
                  }}
                >
                  Join the GU RideShare community
                </p>
              </div>

            </div>


            {/* PROGRESS */}

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 25,
              }}
            >

              <div
                style={{
                  height: 4,
                  flex: 1,
                  borderRadius: 10,
                  background:
                    'var(--accent)',
                }}
              />

              <div
                style={{
                  height: 4,
                  flex: 1,
                  borderRadius: 10,
                  background:
                    'rgba(255,255,255,0.10)',
                }}
              />

              <span
                style={{
                  fontSize: 10,
                  color:
                    'rgba(255,255,255,0.45)',
                  marginLeft: 3,
                }}
              >
                1 of 2
              </span>

            </div>


            {/* ERROR */}

            {error && (
              <div
                style={{
                  background:
                    'rgba(220,38,38,0.12)',
                  border:
                    '1px solid rgba(220,38,38,0.35)',
                  color: '#fca5a5',
                  padding: '11px 13px',
                  borderRadius: 10,
                  marginBottom: 17,
                  fontSize: 12,
                }}
              >
                {error}
              </div>
            )}


            {/* SUCCESS */}

            {success && (
              <div
                style={{
                  background:
                    'rgba(22,163,74,0.12)',
                  border:
                    '1px solid rgba(22,163,74,0.35)',
                  color: '#86efac',
                  padding: '11px 13px',
                  borderRadius: 10,
                  marginBottom: 17,
                  fontSize: 12,
                }}
              >
                {success}
              </div>
            )}


            <form onSubmit={handleRegister}>

              {/* FULL NAME */}

              <div className="input-group">

                <label>FULL NAME</label>

                <div
                  style={{
                    position: 'relative',
                  }}
                >
                  <User
                    size={16}
                    style={{
                      position: 'absolute',
                      left: 13,
                      top: '50%',
                      transform:
                        'translateY(-50%)',
                      color:
                        'rgba(255,255,255,0.38)',
                      pointerEvents: 'none',
                    }}
                  />

                  <input
                    className="input-field"
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        name: e.target.value,
                      })
                    }
                    required
                    style={{
                      paddingLeft: 40,
                      background:
                        'rgba(255,255,255,0.055)',
                      borderColor:
                        'rgba(255,255,255,0.12)',
                    }}
                  />
                </div>

              </div>


              {/* EMAIL */}

              <div className="input-group">

                <label>EMAIL ADDRESS</label>

                <div
                  style={{
                    position: 'relative',
                  }}
                >
                  <Mail
                    size={16}
                    style={{
                      position: 'absolute',
                      left: 13,
                      top: '50%',
                      transform:
                        'translateY(-50%)',
                      color:
                        'rgba(255,255,255,0.38)',
                      pointerEvents: 'none',
                    }}
                  />

                  <input
                    className="input-field"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        email: e.target.value,
                      })
                    }
                    required
                    style={{
                      paddingLeft: 40,
                      background:
                        'rgba(255,255,255,0.055)',
                      borderColor:
                        'rgba(255,255,255,0.12)',
                    }}
                  />
                </div>

                <small
                  style={{
                    color:
                      'rgba(255,255,255,0.38)',
                    fontSize: 10,
                    marginTop: 5,
                    display: 'block',
                  }}
                >
                  A verification OTP will be sent to this email.
                </small>

              </div>


              {/* YEAR + PHONE */}

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    '1fr 1fr',
                  gap: 12,
                }}
              >

                {/* YEAR */}

                <div className="input-group">

                  <label>YEAR</label>

                  <div
                    style={{
                      position: 'relative',
                    }}
                  >
                    <GraduationCap
                      size={16}
                      style={{
                        position:
                          'absolute',
                        left: 13,
                        top: '50%',
                        transform:
                          'translateY(-50%)',
                        color:
                          'rgba(255,255,255,0.38)',
                        pointerEvents:
                          'none',
                      }}
                    />

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
                      style={{
                        paddingLeft: 40,
                        background:
                          'rgba(255,255,255,0.055)',
                        borderColor:
                          'rgba(255,255,255,0.12)',
                      }}
                    >
                      <option value="">
                        Select year
                      </option>

                      <option>
                        1st Year
                      </option>

                      <option>
                        2nd Year
                      </option>

                      <option>
                        3rd Year
                      </option>

                      <option>
                        4th Year
                      </option>
                    </select>

                  </div>

                </div>


                {/* PHONE */}

                <div className="input-group">

                  <label>PHONE NUMBER</label>

                  <div
                    style={{
                      position: 'relative',
                    }}
                  >
                    <Phone
                      size={16}
                      style={{
                        position:
                          'absolute',
                        left: 13,
                        top: '50%',
                        transform:
                          'translateY(-50%)',
                        color:
                          'rgba(255,255,255,0.38)',
                        pointerEvents:
                          'none',
                      }}
                    />

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
                      style={{
                        paddingLeft: 40,
                        background:
                          'rgba(255,255,255,0.055)',
                        borderColor:
                          'rgba(255,255,255,0.12)',
                      }}
                    />

                  </div>

                </div>

              </div>


              {/* SECURITY */}

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '12px 13px',
                  marginTop: 5,
                  marginBottom: 20,
                  borderRadius: 12,
                  background:
                    'rgba(34,197,94,0.07)',
                  border:
                    '1px solid rgba(34,197,94,0.16)',
                }}
              >

                <Shield
                  size={17}
                  color="#4ade80"
                  style={{
                    flexShrink: 0,
                  }}
                />

                <div>

                  <div
                    style={{
                      color: '#d1fae5',
                      fontSize: 11,
                      fontWeight: 600,
                    }}
                  >
                    Your information is secure
                  </div>

                  <div
                    style={{
                      color:
                        'rgba(255,255,255,0.40)',
                      fontSize: 10,
                      marginTop: 2,
                    }}
                  >
                    We'll verify your email using a one-time OTP.
                  </div>

                </div>

              </div>


              {/* BUTTON */}

              <button
                className="btn-primary"
                type="submit"
                disabled={loading}
                style={{
                  height: 50,
                  fontSize: 13,
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  boxShadow:
                    '0 10px 30px rgba(255,111,0,0.20)',
                }}
              >
                {loading ? (
                  'Sending OTP...'
                ) : (
                  <>
                    Continue to verification
                    <ArrowRight size={16} />
                  </>
                )}
              </button>


              <p
                style={{
                  textAlign: 'center',
                  color:
                    'rgba(255,255,255,0.35)',
                  fontSize: 10,
                  margin: '15px 0 0',
                }}
              >
                Your email will only be used for account verification.
              </p>

            </form>

          </div>

        </div>

      </div>
    );
  }


  // =========================================================
  // OTP VERIFICATION
  // =========================================================

  if (step === 'otp') {
    return (
      <div
        style={{
          minHeight: '100dvh',
          position: 'relative',
          overflow: 'hidden',
          background: '#050c1b',
          color: '#fff',
        }}
      >

        {/* BACKGROUND */}

        <img
          src="/campus-bg.jpg"
          alt="Campus"
          style={{
            position: 'fixed',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            opacity: 0.28,
            zIndex: 0,
          }}
        />

        {/* OVERLAY */}

        <div
          style={{
            position: 'fixed',
            inset: 0,
            background:
              'linear-gradient(135deg, rgba(5,12,27,0.97), rgba(5,12,27,0.84), rgba(5,12,27,0.97))',
            zIndex: 1,
          }}
        />

        {/* GLOW */}

        <div
          style={{
            position: 'fixed',
            width: 350,
            height: 350,
            borderRadius: '50%',
            background:
              'rgba(255,111,0,0.10)',
            filter: 'blur(100px)',
            top: '-160px',
            right: '-100px',
            zIndex: 1,
          }}
        />


        {/* CONTENT */}

        <div
          style={{
            position: 'relative',
            zIndex: 2,
            minHeight: '100dvh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '30px 20px',
            boxSizing: 'border-box',
          }}
        >

          {/* CARD */}

          <div
            style={{
              width: '100%',
              maxWidth: 500,
              background:
                'rgba(10,20,39,0.82)',
              border:
                '1px solid rgba(255,255,255,0.14)',
              borderRadius: 24,
              padding: '32px 30px',
              boxSizing: 'border-box',
              backdropFilter: 'blur(22px)',
              WebkitBackdropFilter: 'blur(22px)',
              boxShadow:
                '0 25px 80px rgba(0,0,0,0.45)',
              textAlign: 'center',
            }}
          >

            {/* BACK */}

            <button
              onClick={() => {
                setError('');
                setSuccess('');
                setStep('register');
              }}
              style={{
                background: 'none',
                border: 'none',
                color:
                  'rgba(255,255,255,0.55)',
                cursor: 'pointer',
                fontSize: 13,
                padding: 0,
                display: 'block',
                marginBottom: 24,
              }}
            >
              ← Back
            </button>


            {/* ICON */}

            <div
              style={{
                width: 58,
                height: 58,
                margin: '0 auto 17px',
                borderRadius: 17,
                background:
                  'rgba(255,111,0,0.14)',
                border:
                  '1px solid rgba(255,111,0,0.30)',
                color: 'var(--accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <LockKeyhole size={25} />
            </div>


            {/* TITLE */}

            <h2
              style={{
                fontFamily:
                  'var(--font-display)',
                fontWeight: 800,
                fontSize: 28,
                margin: 0,
                letterSpacing: '-0.7px',
              }}
            >
              Verify your email
            </h2>


            <p
              style={{
                color:
                  'rgba(255,255,255,0.52)',
                fontSize: 12,
                lineHeight: 1.6,
                margin:
                  '9px auto 5px',
                maxWidth: 360,
              }}
            >
              We've sent a 6-digit verification
              code to
            </p>


            <div
              style={{
                color: '#fff',
                fontWeight: 700,
                fontSize: 13,
                wordBreak: 'break-word',
              }}
            >
              {form.email}
            </div>


            {/* PROGRESS */}

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                margin:
                  '24px 0 25px',
              }}
            >

              <div
                style={{
                  height: 4,
                  flex: 1,
                  borderRadius: 10,
                  background:
                    'var(--accent)',
                }}
              />

              <div
                style={{
                  height: 4,
                  flex: 1,
                  borderRadius: 10,
                  background:
                    'var(--accent)',
                }}
              />

              <span
                style={{
                  fontSize: 10,
                  color:
                    'rgba(255,255,255,0.45)',
                  marginLeft: 3,
                }}
              >
                2 of 2
              </span>

            </div>


            {/* ERROR */}

            {error && (
              <div
                style={{
                  textAlign: 'left',
                  background:
                    'rgba(220,38,38,0.12)',
                  border:
                    '1px solid rgba(220,38,38,0.35)',
                  color: '#fca5a5',
                  padding: '11px 13px',
                  borderRadius: 10,
                  marginBottom: 17,
                  fontSize: 12,
                }}
              >
                {error}
              </div>
            )}


            {/* SUCCESS */}

            {success && (
              <div
                style={{
                  textAlign: 'left',
                  background:
                    'rgba(22,163,74,0.12)',
                  border:
                    '1px solid rgba(22,163,74,0.35)',
                  color: '#86efac',
                  padding: '11px 13px',
                  borderRadius: 10,
                  marginBottom: 17,
                  fontSize: 12,
                }}
              >
                {success}
              </div>
            )}


            {/* OTP BOXES */}

            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 9,
                margin:
                  '24px 0 25px',
              }}
            >

              {otp.map((digit, index) => (

                <input
                  key={index}
                  id={`otp-${index}`}
                  maxLength={1}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={digit}
                  onChange={(e) =>
                    handleOtpChange(
                      index,
                      e.target.value
                    )
                  }
                  style={{
                    width: 48,
                    height: 56,
                    boxSizing: 'border-box',
                    textAlign: 'center',
                    fontSize: 21,
                    fontFamily:
                      'var(--font-display)',
                    fontWeight: 700,
                    background:
                      digit
                        ? 'rgba(255,111,0,0.09)'
                        : 'rgba(255,255,255,0.055)',
                    border:
                      digit
                        ? '1px solid var(--accent)'
                        : '1px solid rgba(255,255,255,0.13)',
                    borderRadius: 11,
                    color: '#fff',
                    outline: 'none',
                  }}
                />

              ))}

            </div>


            {/* VERIFY */}

            <button
              className="btn-primary"
              onClick={handleVerify}
              disabled={
                loading ||
                otp.join('').length !== 6
              }
              style={{
                height: 50,
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                fontSize: 13,
              }}
            >
              {loading ? (
                'Verifying...'
              ) : (
                <>
                  Verify & Enter App
                  <ArrowRight size={16} />
                </>
              )}
            </button>


            {/* RESEND */}

            <div
              style={{
                marginTop: 18,
                fontSize: 12,
                color:
                  'rgba(255,255,255,0.42)',
              }}
            >
              Didn't receive the code?{' '}

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
                  fontWeight: 700,
                }}
              >
                Resend OTP
              </span>
            </div>


            {/* SECURITY */}

            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 6,
                marginTop: 20,
                color:
                  'rgba(255,255,255,0.35)',
                fontSize: 10,
              }}
            >
              <Shield size={12} />
              Secure email verification
            </div>

          </div>

        </div>

      </div>
    );
  }

  return null;
}
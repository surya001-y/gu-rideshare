import { useState } from 'react';
import { Car, Shield, ArrowRight, CheckCircle } from 'lucide-react';

export default function Login({ onLogin }) {
  const [step, setStep] = useState('welcome'); // welcome | register | otp
  const [form, setForm] = useState({ name: '', email: '', year: '', phone: '' });
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);

  const features = [
    { icon: '🚗', text: 'Match with students on your route' },
    { icon: '💸', text: 'Split cab fare, save money' },
    { icon: '🔒', text: 'GU verified students only' },
    { icon: '⭐', text: 'Ratings & reviews for safety' },
  ];

  const handleRegister = (e) => {
    e.preventDefault();
    if (!form.email.endsWith('@galgotiasuniversity.edu.in')) {
      alert('Please use your GU college email (galgotiasuniversity.edu.in)');
      return;
    }
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep('otp'); }, 1200);
  };

  const handleOtpChange = (i, val) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 5) document.getElementById(`otp-${i + 1}`)?.focus();
  };

  const handleVerify = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); onLogin(); }, 1000);
  };

  if (step === 'welcome') return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      {/* Hero */}
      <div style={{ padding: '60px 24px 32px', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 48 }} className="fade-up">
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Car size={24} color="#fff" />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, letterSpacing: '-0.3px' }}>GU RideShare</div>
            <div style={{ fontSize: 11, color: 'var(--text3)' }}>Galgotias University</div>
          </div>
        </div>

        <div className="fade-up-1" style={{ marginBottom: 40 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 38, lineHeight: 1.1, letterSpacing: '-1px', marginBottom: 14 }}>
            Ride together,<br />
            <span style={{ color: 'var(--accent)' }}>save together.</span>
          </h1>
          <p style={{ color: 'var(--text2)', fontSize: 15, lineHeight: 1.6 }}>
            No more spamming WhatsApp groups. Find students heading your way in seconds.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 40 }} className="fade-up-2">
          {features.map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 20 }}>{f.icon}</span>
              <span style={{ color: 'var(--text2)', fontSize: 14 }}>{f.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding: '0 24px 40px' }} className="fade-up-3">
        <button className="btn-primary" onClick={() => setStep('register')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          Get Started <ArrowRight size={16} />
        </button>
        <p style={{ textAlign: 'center', color: 'var(--text3)', fontSize: 12, marginTop: 14 }}>
          Only for Galgotias University students
        </p>
      </div>
    </div>
  );

  if (step === 'register') return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)', padding: '40px 24px' }}>
      <button className="btn-ghost" onClick={() => setStep('welcome')} style={{ marginBottom: 28, color: 'var(--text2)' }}>← Back</button>
      <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28, marginBottom: 6, letterSpacing: '-0.5px' }}>Create account</h2>
      <p style={{ color: 'var(--text2)', fontSize: 13, marginBottom: 28 }}>Use your GU college email to verify</p>

      <form onSubmit={handleRegister}>
        <div className="input-group">
          <label>Full Name</label>
          <input className="input-field" placeholder="e.g. Aryan Singh" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
        </div>
        <div className="input-group">
          <label>College Email</label>
          <input className="input-field" type="email" placeholder="name@galgotiasuniversity.edu.in" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="input-group">
            <label>Year</label>
            <select className="input-field" value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} required>
              <option value="">Select</option>
              <option>1st Year</option>
              <option>2nd Year</option>
              <option>3rd Year</option>
              <option>4th Year</option>
            </select>
          </div>
          <div className="input-group">
            <label>Phone</label>
            <input className="input-field" type="tel" placeholder="+91 98765..." value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required />
          </div>
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 14px', marginBottom: 20, display: 'flex', gap: 10, alignItems: 'center' }}>
          <Shield size={16} color="var(--teal)" style={{ flexShrink: 0 }} />
          <span style={{ fontSize: 12, color: 'var(--text2)' }}>Your info is only visible to verified GU students</span>
        </div>

        <button className="btn-primary" type="submit" disabled={loading}>
          {loading ? 'Sending OTP...' : 'Send Verification OTP'}
        </button>
      </form>
    </div>
  );

  if (step === 'otp') return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)', padding: '40px 24px' }}>
      <button className="btn-ghost" onClick={() => setStep('register')} style={{ marginBottom: 28, color: 'var(--text2)' }}>← Back</button>
      <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28, marginBottom: 6, letterSpacing: '-0.5px' }}>Verify your email</h2>
      <p style={{ color: 'var(--text2)', fontSize: 13, marginBottom: 32 }}>OTP sent to <strong style={{ color: 'var(--text)' }}>{form.email || 'your@email.com'}</strong></p>

      <div style={{ display: 'flex', gap: 10, marginBottom: 32, justifyContent: 'center' }}>
        {otp.map((d, i) => (
          <input
            key={i}
            id={`otp-${i}`}
            maxLength={1}
            value={d}
            onChange={e => handleOtpChange(i, e.target.value)}
            style={{
              width: 46, height: 56,
              textAlign: 'center',
              fontSize: 22,
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              background: d ? 'var(--surface2)' : 'var(--surface)',
              border: `1px solid ${d ? 'var(--accent)' : 'var(--border)'}`,
              borderRadius: 10,
              color: 'var(--text)',
              outline: 'none',
            }}
          />
        ))}
      </div>

      <button className="btn-primary" onClick={handleVerify} disabled={loading || otp.join('').length < 6} style={{ marginBottom: 16 }}>
        {loading ? 'Verifying...' : 'Verify & Enter App'}
      </button>
      <p style={{ textAlign: 'center', color: 'var(--text3)', fontSize: 13 }}>
        Didn't get it? <span style={{ color: 'var(--accent)', cursor: 'pointer' }}>Resend OTP</span>
      </p>
    </div>
  );
}

import { useState } from 'react';
import { CheckCircle, MapPin, Clock, Users, Car, DollarSign, Repeat } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function OfferRide() {
  const { addRide, user } = useApp();
  const [form, setForm] = useState({
    from: 'GU Gate 1',
    to: '',
    date: '',
    time: '',
    seats: '2',
    price: '',
    vehicle: 'Hatchback',
    gender: 'Any',
    recurring: false,
    notes: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const quickDestinations = ['Noida Sector 18', 'Pari Chowk Metro', 'Greater Noida West', 'Delhi Connaught Place', 'Ansal Plaza', 'Muradnagar'];
  const quickPickup = ['GU Gate 1', 'GU Gate 2', 'Boys Hostel', 'Girls Hostel', 'Academic Block', 'Library'];

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      addRide({
        driver: { name: user.name, initials: 'AS', college: user.college, year: user.year, rating: user.rating, trips: user.trips, avatar: 'av-orange' },
        from: form.from,
        to: form.to,
        date: form.date,
        time: form.time,
        seats: parseInt(form.seats),
        price: parseInt(form.price),
        vehicle: form.vehicle,
        gender: form.gender,
        recurring: form.recurring,
      });
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  if (submitted) return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center' }}>
      <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--green-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
        <CheckCircle size={36} color="var(--green)" />
      </div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 24, marginBottom: 8 }}>Ride Posted!</h2>
      <p style={{ color: 'var(--text2)', fontSize: 14, marginBottom: 6 }}>
        Your ride from <strong style={{ color: 'var(--text)' }}>{form.from}</strong> to <strong style={{ color: 'var(--text)' }}>{form.to}</strong>
      </p>
      <p style={{ color: 'var(--text2)', fontSize: 14, marginBottom: 32 }}>is now visible to all GU students heading that way.</p>
      <div style={{ background: 'var(--surface)', borderRadius: 12, padding: '14px 20px', marginBottom: 28, border: '1px solid var(--border)', width: '100%', maxWidth: 300 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ color: 'var(--text3)', fontSize: 13 }}>Time</span>
          <span style={{ fontSize: 13, fontWeight: 600 }}>{form.time}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ color: 'var(--text3)', fontSize: 13 }}>Seats</span>
          <span style={{ fontSize: 13, fontWeight: 600 }}>{form.seats}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--text3)', fontSize: 13 }}>Price/seat</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)' }}>₹{form.price}</span>
        </div>
      </div>
      <button className="btn-primary" onClick={() => setSubmitted(false)} style={{ maxWidth: 300, width: '100%' }}>
        Post Another Ride
      </button>
    </div>
  );

  return (
    <div className="page">
      <div style={{ padding: '20px 20px 0' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 26, letterSpacing: '-0.5px', marginBottom: 4 }}>Offer a Ride</h1>
        <p style={{ color: 'var(--text2)', fontSize: 13, marginBottom: 20 }}>Share your route and split costs with fellow students</p>
      </div>

      <form onSubmit={handleSubmit} style={{ padding: '0 20px' }}>
        {/* Pickup */}
        <div className="input-group">
          <label>Pickup Point</label>
          <input className="input-field" value={form.from} onChange={e => setForm({ ...form, from: e.target.value })} required placeholder="e.g. GU Gate 1" />
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 }}>
            {quickPickup.map(p => (
              <button type="button" key={p} onClick={() => setForm({ ...form, from: p })}
                style={{ background: form.from === p ? 'var(--accent-glow)' : 'var(--surface)', border: `1px solid ${form.from === p ? 'var(--accent)' : 'var(--border)'}`, borderRadius: 16, padding: '4px 10px', fontSize: 11, color: form.from === p ? 'var(--accent)' : 'var(--text2)', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Destination */}
        <div className="input-group">
          <label>Destination</label>
          <input className="input-field" value={form.to} onChange={e => setForm({ ...form, to: e.target.value })} required placeholder="e.g. Noida Sector 18" />
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 }}>
            {quickDestinations.map(d => (
              <button type="button" key={d} onClick={() => setForm({ ...form, to: d })}
                style={{ background: form.to === d ? 'var(--accent-glow)' : 'var(--surface)', border: `1px solid ${form.to === d ? 'var(--accent)' : 'var(--border)'}`, borderRadius: 16, padding: '4px 10px', fontSize: 11, color: form.to === d ? 'var(--accent)' : 'var(--text2)', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                {d}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="input-group">
            <label>Date</label>
            <input className="input-field" type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
          </div>
          <div className="input-group">
            <label>Time</label>
            <input className="input-field" type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} required />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="input-group">
            <label>Seats Available</label>
            <select className="input-field" value={form.seats} onChange={e => setForm({ ...form, seats: e.target.value })}>
              {[1,2,3,4].map(n => <option key={n} value={n}>{n} seat{n > 1 ? 's' : ''}</option>)}
            </select>
          </div>
          <div className="input-group">
            <label>Cost per Seat (₹)</label>
            <input className="input-field" type="number" min="10" max="500" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required placeholder="e.g. 80" />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="input-group">
            <label>Vehicle Type</label>
            <select className="input-field" value={form.vehicle} onChange={e => setForm({ ...form, vehicle: e.target.value })}>
              <option>Hatchback</option>
              <option>Sedan</option>
              <option>SUV</option>
              <option>Auto</option>
            </select>
          </div>
          <div className="input-group">
            <label>Gender Preference</label>
            <select className="input-field" value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}>
              <option>Any</option>
              <option>Girls only</option>
              <option>Boys only</option>
            </select>
          </div>
        </div>

        <div className="input-group">
          <label>Notes (optional)</label>
          <input className="input-field" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="e.g. I'll be outside Gate 2, call on arrival" />
        </div>

        {/* Recurring toggle */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 14px', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <Repeat size={16} color="var(--teal)" />
            <div>
              <p style={{ fontSize: 14, fontWeight: 500 }}>Daily recurring ride</p>
              <p style={{ fontSize: 12, color: 'var(--text3)' }}>Post this ride every weekday automatically</p>
            </div>
          </div>
          <div
            onClick={() => setForm({ ...form, recurring: !form.recurring })}
            style={{
              width: 44, height: 24, borderRadius: 12,
              background: form.recurring ? 'var(--teal)' : 'var(--surface2)',
              position: 'relative', cursor: 'pointer', transition: 'background 0.2s', flexShrink: 0,
            }}
          >
            <div style={{
              width: 18, height: 18, borderRadius: '50%', background: '#fff',
              position: 'absolute', top: 3,
              left: form.recurring ? 23 : 3,
              transition: 'left 0.2s',
            }} />
          </div>
        </div>

        <button className="btn-primary" type="submit" disabled={loading} style={{ marginBottom: 20 }}>
          {loading ? 'Posting Ride...' : 'Post Ride — Let Students Find You'}
        </button>
      </form>
    </div>
  );
}

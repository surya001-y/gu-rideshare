import { useState } from 'react';
import { Navigation, MessageCircle, X, Star, CheckCircle, MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';

function StarRating({ onRate }) {
  const [hovered, setHovered] = useState(0);
  const [selected, setSelected] = useState(0);
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {[1,2,3,4,5].map(i => (
        <span
          key={i}
          style={{ fontSize: 22, cursor: 'pointer', color: i <= (hovered || selected) ? '#fbbf24' : 'var(--border2)', transition: 'color 0.1s' }}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => { setSelected(i); onRate(i); }}
        >★</span>
      ))}
    </div>
  );
}

export default function MyRides({ onChat }) {
  const { myRides } = useApp();
  const [rated, setRated] = useState({});
  const [tab, setTab] = useState('all');

  const tabs = ['all', 'upcoming', 'completed'];

  const filtered = tab === 'all' ? myRides : myRides.filter(r => r.status === tab || (tab === 'upcoming' && r.status === 'live'));

  const statusConfig = {
    live: { label: 'Live', bg: 'var(--green-soft)', color: 'var(--green)' },
    upcoming: { label: 'Upcoming', bg: 'rgba(59,130,246,0.15)', color: '#60a5fa' },
    completed: { label: 'Done', bg: 'var(--surface2)', color: 'var(--text2)' },
  };

  return (
    <div className="page">
      <div style={{ padding: '20px 20px 0' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 26, letterSpacing: '-0.5px', marginBottom: 16 }}>My Rides</h1>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 20, background: 'var(--surface)', borderRadius: 10, padding: 4 }}>
          {tabs.map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{
                flex: 1, padding: '8px 0', borderRadius: 8, border: 'none', cursor: 'pointer',
                background: tab === t ? 'var(--accent)' : 'transparent',
                color: tab === t ? '#fff' : 'var(--text2)',
                fontFamily: 'var(--font-body)', fontWeight: tab === t ? 600 : 400, fontSize: 13,
                textTransform: 'capitalize', transition: 'all 0.15s',
              }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '0 20px' }}>
        {filtered.map((ride, idx) => {
          const sc = statusConfig[ride.status];
          return (
            <div key={ride.id} className={`card fade-up-${Math.min(idx+1,4)}`} style={{ marginBottom: 12 }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15 }}>
                  {ride.from} → {ride.to}
                </span>
                <span className="pill" style={{ background: sc.bg, color: sc.color, fontSize: 11 }}>
                  {ride.status === 'live' && <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', marginRight: 4, animation: 'pulse 1.2s infinite' }} />}
                  {sc.label}
                </span>
              </div>

              <p style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 10 }}>
                {ride.date} · {ride.time}
                {ride.driver && ` · with ${ride.driver}`}
                {ride.price && ` · ₹${ride.price}`}
              </p>

              {/* Live ride tracking bar */}
              {ride.status === 'live' && (
                <div style={{ background: '#0d2b1a', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 10, padding: '10px 12px', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--green)', animation: 'pulse 1.2s infinite', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 12, color: '#4ade80', fontWeight: 600 }}>Driver is on the way</p>
                    <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>ETA: {ride.eta} · 1.4 km away</p>
                  </div>
                  <Navigation size={14} color="#4ade80" />
                </div>
              )}

              {/* Offered ride seat info */}
              {ride.type === 'offered' && ride.seats && (
                <p style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 10 }}>
                  {ride.seats} seats offered · ₹{ride.price}/seat
                </p>
              )}

              {/* Rating for completed */}
              {ride.status === 'completed' && !rated[ride.id] && (
                <div style={{ marginBottom: 10 }}>
                  <p style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 6 }}>Rate your experience:</p>
                  <StarRating onRate={stars => setRated({ ...rated, [ride.id]: stars })} />
                </div>
              )}
              {ride.status === 'completed' && rated[ride.id] && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                  <CheckCircle size={14} color="var(--green)" />
                  <span style={{ fontSize: 12, color: 'var(--green)' }}>Rated {rated[ride.id]}/5 — Thanks!</span>
                </div>
              )}

              {/* Actions */}
              <div style={{ display: 'flex', gap: 8 }}>
                {(ride.status === 'live' || ride.status === 'upcoming') && (
                  <>
                    <button onClick={() => onChat && onChat({ name: ride.driver || 'Driver', initials: 'RV', avatar: 'av-orange' })}
                      className="btn-outline" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                      <MessageCircle size={13} /> Chat
                    </button>
                    <button className="btn-outline" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, color: 'var(--red)', borderColor: 'rgba(239,68,68,0.3)' }}>
                      <X size={13} /> Cancel
                    </button>
                  </>
                )}
                {ride.status === 'completed' && (
                  <button className="btn-outline" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    <MapPin size={13} /> Book again
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🚗</div>
            <p style={{ color: 'var(--text2)', fontSize: 14 }}>No {tab} rides yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

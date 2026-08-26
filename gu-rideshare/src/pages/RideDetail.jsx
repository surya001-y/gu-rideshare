import { useState } from 'react';
import { ArrowLeft, MapPin, Clock, Users, Car, Star, MessageCircle, Shield, Navigation, Phone, AlertTriangle, Repeat } from 'lucide-react';

export default function RideDetail({ ride, onBack, onChat }) {
  const [joined, setJoined] = useState(false);
  const [showTrack, setShowTrack] = useState(false);

  if (!ride) return null;

  const handleJoin = () => {
    setJoined(true);
    setTimeout(() => setShowTrack(true), 600);
  };

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      {/* Map placeholder */}
      <div style={{ height: 220, background: 'var(--bg2)', position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
        {/* Faux map with route line */}
        <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
          <defs>
            <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          <polyline points="60,180 120,140 200,120 280,100 360,80 420,60" fill="none" stroke="var(--accent)" strokeWidth="3" strokeDasharray="6,3" strokeLinecap="round" />
          <circle cx="60" cy="180" r="8" fill="var(--green)" />
          <circle cx="420" cy="60" r="8" fill="var(--red)" />
          {/* Moving dot */}
          <circle cx="200" cy="120" r="10" fill="var(--accent)" opacity="0.3" />
          <circle cx="200" cy="120" r="6" fill="var(--accent)" />
        </svg>
        {/* Back button */}
        <button onClick={onBack} style={{ position: 'absolute', top: 14, left: 14, width: 36, height: 36, borderRadius: '50%', background: 'rgba(15,23,42,0.8)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <ArrowLeft size={16} color="var(--text)" />
        </button>
        {/* Map label */}
        <div style={{ position: 'absolute', bottom: 12, right: 12 }}>
          <span className="pill pill-gray" style={{ fontSize: 10, background: 'rgba(15,23,42,0.85)' }}>
            <Navigation size={9} /> Live route preview
          </span>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 100px' }}>
        {/* Driver header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div className={`avatar ${ride.driver.avatar}`} style={{ width: 52, height: 52, fontSize: 16 }}>{ride.driver.initials}</div>
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18 }}>{ride.driver.name}</h2>
              <p style={{ fontSize: 12, color: 'var(--text2)' }}>{ride.driver.year} · {ride.driver.college}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                <span className="stars">{'★'.repeat(5)}</span>
                <span style={{ fontSize: 12, fontWeight: 600 }}>{ride.driver.rating}</span>
                <span style={{ fontSize: 12, color: 'var(--text3)' }}>({ride.driver.trips} trips)</span>
              </div>
            </div>
          </div>
          <button onClick={() => onChat(ride.driver)} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, width: 42, height: 42, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <MessageCircle size={18} color="var(--teal)" />
          </button>
        </div>

        {/* Route card */}
        <div className="card" style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', gap: 14, alignItems: 'stretch' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 4 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--green)' }} />
              <div style={{ flex: 1, width: 1.5, background: 'var(--border2)', margin: '4px 0' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--red)' }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ marginBottom: 12 }}>
                <p style={{ fontSize: 13, fontWeight: 600 }}>{ride.from}</p>
                <p style={{ fontSize: 12, color: 'var(--text3)' }}>Pickup point</p>
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600 }}>{ride.to}</p>
                <p style={{ fontSize: 12, color: 'var(--text3)' }}>Drop point</p>
              </div>
            </div>
          </div>
        </div>

        {/* Details grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
          {[
            { icon: Clock, label: 'Time', val: `${ride.date}, ${ride.time}` },
            { icon: Users, label: 'Seats left', val: `${ride.seats} available` },
            { icon: Car, label: 'Vehicle', val: ride.vehicle },
            { icon: Star, label: 'Cost per seat', val: `₹${ride.price}` },
          ].map(({ icon: Icon, label, val }) => (
            <div key={label} className="card-sm">
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <Icon size={14} color="var(--accent)" />
                <span style={{ fontSize: 11, color: 'var(--text3)' }}>{label}</span>
              </div>
              <p style={{ fontWeight: 600, fontSize: 14, marginTop: 4 }}>{val}</p>
            </div>
          ))}
        </div>

        {/* Preferences */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
          {ride.gender !== 'Any' && <span className="pill pill-orange">{ride.gender}</span>}
          {ride.recurring && <span className="pill pill-green"><Repeat size={10} /> Daily recurring</span>}
          <span className="pill pill-teal"><Shield size={10} /> GU Verified driver</span>
        </div>

        {/* Live tracking (post-join) */}
        {showTrack && (
          <div style={{ background: '#0d2b1a', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 12, padding: '12px 14px', marginBottom: 14, display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--green)', animation: 'pulse 1.2s infinite', flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#4ade80' }}>Driver is on the way</p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>ETA: 6 minutes · 1.4 km away</p>
            </div>
            <button style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 8, padding: '6px 10px', color: '#4ade80', fontSize: 12, cursor: 'pointer' }}>
              <Navigation size={12} style={{ display: 'inline', marginRight: 4 }} />Track
            </button>
          </div>
        )}

        {/* Safety */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 14px', display: 'flex', gap: 10, alignItems: 'center' }}>
          <AlertTriangle size={16} color="#fbbf24" style={{ flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 13, fontWeight: 600 }}>Safety first</p>
            <p style={{ fontSize: 12, color: 'var(--text2)' }}>Use the emergency button if you feel unsafe during the ride</p>
          </div>
          <button style={{ background: 'var(--red-soft)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '6px 10px', color: 'var(--red)', fontSize: 12, cursor: 'pointer', flexShrink: 0 }}>
            🆘 SOS
          </button>
        </div>
      </div>

      {/* Bottom CTA */}
      <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430, padding: '16px 20px 28px', background: 'linear-gradient(to top, var(--bg) 70%, transparent)', zIndex: 50 }}>
        {!joined ? (
          <button className="btn-primary" onClick={handleJoin}>
            Request to Join · ₹{ride.price}
          </button>
        ) : (
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => onChat(ride.driver)} style={{ flex: 1, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: 14, color: 'var(--teal)', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <MessageCircle size={16} /> Chat
            </button>
            <button style={{ flex: 2, background: '#0d2b1a', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 'var(--r)', padding: 14, color: '#4ade80', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              ✓ Joined · Tracking active
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

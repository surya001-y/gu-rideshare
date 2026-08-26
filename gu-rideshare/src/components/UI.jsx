import { MapPin, Clock, Users, Car, Star, ChevronRight, Repeat } from 'lucide-react';

export function RideCard({ ride, onClick }) {
  return (
    <div
      className="card"
      onClick={onClick}
      style={{ marginBottom: 12, cursor: 'pointer', transition: 'border-color 0.2s', borderColor: 'var(--border)' }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
    >
      {/* Driver row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div className={`avatar ${ride.driver.avatar}`}>{ride.driver.initials}</div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15 }}>{ride.driver.name}</div>
            <div style={{ fontSize: 12, color: 'var(--text2)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span className="stars">{'★'.repeat(Math.floor(ride.driver.rating))}</span>
              <span style={{ color: 'var(--text2)' }}>{ride.driver.rating}</span>
              <span style={{ color: 'var(--text3)' }}>· {ride.driver.trips} trips</span>
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: 'var(--accent)' }}>₹{ride.price}</div>
          <div style={{ fontSize: 11, color: 'var(--text3)' }}>per seat</div>
        </div>
      </div>

      {/* Route */}
      <div style={{ background: 'var(--bg3)', borderRadius: 10, padding: '10px 12px', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--green)', flexShrink: 0 }} />
          <span style={{ fontSize: 13, color: 'var(--text)' }}>{ride.from}</span>
        </div>
        <div style={{ marginLeft: 3.5, width: 1, height: 12, background: 'var(--border2)', marginBottom: 6 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--red)', flexShrink: 0 }} />
          <span style={{ fontSize: 13, color: 'var(--text)' }}>{ride.to}</span>
        </div>
      </div>

      {/* Meta pills */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        <span className="pill pill-gray"><Clock size={11} /> {ride.time}</span>
        <span className="pill pill-teal"><Users size={11} /> {ride.seats} seats</span>
        <span className="pill pill-gray"><Car size={11} /> {ride.vehicle}</span>
        {ride.gender !== 'Any' && <span className="pill pill-orange">{ride.gender}</span>}
        {ride.recurring && <span className="pill pill-green"><Repeat size={11} /> Daily</span>}
      </div>
    </div>
  );
}

export function PageHeader({ title, subtitle, right }) {
  return (
    <div style={{ padding: '18px 20px 4px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 26, letterSpacing: '-0.5px', lineHeight: 1.1 }}>{title}</h1>
        {subtitle && <p style={{ color: 'var(--text2)', fontSize: 13, marginTop: 3 }}>{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}

export function Badge({ children, color = 'orange' }) {
  const map = { orange: 'pill-orange', green: 'pill-green', teal: 'pill-teal', red: 'pill-red', gray: 'pill-gray' };
  return <span className={`pill ${map[color]}`}>{children}</span>;
}

export function EmptyState({ icon: Icon, title, subtitle }) {
  return (
    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
      <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'var(--surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
        <Icon size={26} color="var(--text3)" />
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 16, marginBottom: 6 }}>{title}</div>
      <div style={{ color: 'var(--text2)', fontSize: 13 }}>{subtitle}</div>
    </div>
  );
}

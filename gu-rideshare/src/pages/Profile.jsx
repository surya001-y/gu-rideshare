import { useState } from 'react';
import { Shield, Bell, Star, ChevronRight, LogOut, Edit2, Car, Users, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

function NotifPanel({ notifications, onClose }) {
  const typeIcon = { request: '🤝', chat: '💬', reminder: '🧠', rated: '⭐' };
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 200, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
      <div style={{ background: 'var(--bg2)', borderRadius: '20px 20px 0 0', padding: '20px 20px 40px', maxHeight: '70dvh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18 }}>Notifications</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text2)', cursor: 'pointer', fontSize: 20 }}>×</button>
        </div>
        {notifications.map(n => (
          <div key={n.id} style={{ display: 'flex', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--border)', opacity: n.read ? 0.6 : 1 }}>
            <span style={{ fontSize: 20, flexShrink: 0 }}>{typeIcon[n.type]}</span>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 13, lineHeight: 1.4 }}>{n.msg}</p>
              <p style={{ fontSize: 11, color: 'var(--text3)', marginTop: 3 }}>{n.time}</p>
            </div>
            {!n.read && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0, marginTop: 4 }} />}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Profile({ onLogout }) {
  const { user, notifications } = useApp();
  const [showNotif, setShowNotif] = useState(false);
  const unread = notifications.filter(n => !n.read).length;

  const menuItems = [
    { icon: Car, label: 'My vehicles', sub: 'Manage your registered vehicles' },
    { icon: Shield, label: 'Safety & emergency contacts', sub: 'SOS contacts, emergency settings' },
    { icon: Star, label: 'Ratings & reviews', sub: `${user.rating} avg · ${user.trips} trips` },
    { icon: Users, label: 'Refer a GU friend', sub: 'Invite classmates to join' },
  ];

  return (
    <div className="page">
      {showNotif && <NotifPanel notifications={notifications} onClose={() => setShowNotif(false)} />}

      <div style={{ padding: '20px 20px 0' }}>
        {/* Header actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 26, letterSpacing: '-0.5px' }}>Profile</h1>
          <button onClick={() => setShowNotif(true)} style={{ position: 'relative', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <Bell size={18} color="var(--text2)" />
            {unread > 0 && (
              <div style={{ position: 'absolute', top: 6, right: 6, width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)' }} />
            )}
          </button>
        </div>

        {/* User card */}
        <div className="card" style={{ marginBottom: 20, background: 'var(--surface)' }}>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 16 }}>
            <div className="avatar av-orange" style={{ width: 60, height: 60, fontSize: 20 }}>AS</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18 }}>{user.name}</h2>
                {user.verified && <CheckCircle size={14} color="var(--teal)" />}
              </div>
              <p style={{ fontSize: 12, color: 'var(--text2)' }}>{user.year} · {user.college}</p>
              <p style={{ fontSize: 12, color: 'var(--text3)' }}>{user.email}</p>
            </div>
            <button style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Edit2 size={14} color="var(--text2)" />
            </button>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            {[
              { label: 'Rating', val: user.rating, icon: '⭐' },
              { label: 'Trips', val: user.trips, icon: '🚗' },
              { label: 'Saved', val: '₹840', icon: '💰' },
            ].map(s => (
              <div key={s.label} style={{ background: 'var(--bg3)', borderRadius: 10, padding: '10px 8px', textAlign: 'center' }}>
                <div style={{ fontSize: 16, marginBottom: 2 }}>{s.icon}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16 }}>{s.val}</div>
                <div style={{ fontSize: 11, color: 'var(--text3)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Suggestion card */}
        <div style={{ background: 'linear-gradient(135deg, #1a1035, #0f1f2e)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 14, padding: '14px 16px', marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <span style={{ fontSize: 20, flexShrink: 0 }}>🧠</span>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#c4b5fd', marginBottom: 3 }}>AI Reminder</p>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.4 }}>
                Going home this weekend? 4 rides available to Delhi on Friday evening.
              </p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <div className="card" style={{ marginBottom: 12 }}>
          {menuItems.map((item, i) => (
            <div key={item.label}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', cursor: 'pointer' }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <item.icon size={16} color="var(--text2)" />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 500 }}>{item.label}</p>
                  <p style={{ fontSize: 12, color: 'var(--text3)' }}>{item.sub}</p>
                </div>
                <ChevronRight size={16} color="var(--text3)" />
              </div>
              {i < menuItems.length - 1 && <div className="divider" style={{ margin: 0 }} />}
            </div>
          ))}
        </div>

        <button onClick={onLogout} style={{ width: '100%', background: 'var(--red-soft)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 'var(--r)', padding: 14, color: 'var(--red)', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 20 }}>
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </div>
  );
}

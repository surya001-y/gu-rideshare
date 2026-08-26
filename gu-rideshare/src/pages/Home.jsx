import { useState } from 'react';
import { Search, SlidersHorizontal, MapPin, X, ChevronDown } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RideCard } from '../components/UI';

export default function Home({ onRideSelect }) {
  const { user, rides } = useApp();
  const [search, setSearch] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({ vehicle: 'Any', gender: 'Any', maxPrice: 200, time: 'Any' });

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const filtered = rides.filter(r => {
    const q = search.toLowerCase();
    const matchQ = !q || r.from.toLowerCase().includes(q) || r.to.toLowerCase().includes(q);
    const matchV = filters.vehicle === 'Any' || r.vehicle === filters.vehicle;
    const matchG = filters.gender === 'Any' || r.gender === 'Any' || r.gender === filters.gender;
    const matchP = r.price <= filters.maxPrice;
    return matchQ && matchV && matchG && matchP;
  });

  return (
    <div className="page">
      {/* Header */}
      <div style={{ background: 'var(--bg2)', padding: '20px 20px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
          <div>
            <p style={{ color: 'var(--text3)', fontSize: 13 }}>{greeting()},</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, letterSpacing: '-0.3px' }}>{user.name.split(' ')[0]} 👋</h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="pill pill-green" style={{ fontSize: 11 }}>✓ GU Verified</span>
            <div className={`avatar ${user.avatar || 'av-orange'}`} style={{ width: 38, height: 38, fontSize: 13 }}>AS</div>
          </div>
        </div>

        {/* Quick destination shortcuts */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 16, scrollbarWidth: 'none' }}>
          {['Noida Sector 18', 'Pari Chowk', 'Greater Noida West', 'Delhi', 'Muradnagar'].map(dest => (
            <button
              key={dest}
              onClick={() => setSearch(dest)}
              style={{
                flexShrink: 0,
                background: search === dest ? 'var(--accent)' : 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 20,
                padding: '6px 12px',
                fontSize: 12,
                color: search === dest ? '#fff' : 'var(--text2)',
                cursor: 'pointer',
                fontFamily: 'var(--font-body)',
                transition: 'all 0.15s',
              }}
            >
              <MapPin size={10} style={{ display: 'inline', marginRight: 4 }} />{dest}
            </button>
          ))}
        </div>
      </div>

      {/* Search bar */}
      <div style={{ padding: '16px 20px', position: 'sticky', top: 0, background: 'var(--bg)', zIndex: 10, borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)' }} />
            <input
              className="input-field"
              style={{ paddingLeft: 36, paddingRight: search ? 36 : 12 }}
              placeholder="Search destination..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)' }}>
                <X size={14} />
              </button>
            )}
          </div>
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            style={{
              background: filterOpen ? 'var(--accent)' : 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--r-sm)',
              width: 42, height: 42,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'background 0.2s',
            }}
          >
            <SlidersHorizontal size={16} color={filterOpen ? '#fff' : 'var(--text2)'} />
          </button>
        </div>

        {/* Filter panel */}
        {filterOpen && (
          <div style={{ marginTop: 12, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
              <div>
                <label style={{ fontSize: 11, color: 'var(--text3)', display: 'block', marginBottom: 5 }}>Vehicle</label>
                <select className="input-field" style={{ padding: '7px 10px', fontSize: 13 }} value={filters.vehicle} onChange={e => setFilters({ ...filters, vehicle: e.target.value })}>
                  <option>Any</option>
                  <option>Hatchback</option>
                  <option>Sedan</option>
                  <option>SUV</option>
                  <option>Auto</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 11, color: 'var(--text3)', display: 'block', marginBottom: 5 }}>Gender</label>
                <select className="input-field" style={{ padding: '7px 10px', fontSize: 13 }} value={filters.gender} onChange={e => setFilters({ ...filters, gender: e.target.value })}>
                  <option>Any</option>
                  <option>Girls only</option>
                  <option>Boys only</option>
                </select>
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <label style={{ fontSize: 11, color: 'var(--text3)' }}>Max price</label>
                <span style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 600 }}>₹{filters.maxPrice}</span>
              </div>
              <input type="range" min="30" max="300" step="10" value={filters.maxPrice}
                onChange={e => setFilters({ ...filters, maxPrice: +e.target.value })}
                style={{ width: '100%', accentColor: 'var(--accent)' }} />
            </div>
          </div>
        )}
      </div>

      {/* Ride list */}
      <div style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <p className="section-head">{filtered.length} rides found</p>
          <p style={{ fontSize: 12, color: 'var(--text3)' }}>Today · Near GU</p>
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🔍</div>
            <p style={{ color: 'var(--text2)', fontSize: 14 }}>No rides found.<br />Try a different destination.</p>
          </div>
        ) : (
          filtered.map((ride, i) => (
            <div key={ride.id} className={`fade-up-${Math.min(i + 1, 4)}`}>
              <RideCard ride={ride} onClick={() => onRideSelect(ride)} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

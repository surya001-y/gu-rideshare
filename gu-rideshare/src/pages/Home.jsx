import { useState } from 'react';

import {
  Search,
  SlidersHorizontal,
  MapPin,
  X,
  ShieldCheck,
  Car,
  IndianRupee,
  Users,
} from 'lucide-react';

import { useApp } from '../context/AppContext';
import { RideCard } from '../components/UI';



export default function Home({ onRideSelect }) {
  const { user, rides } = useApp();

  const [search, setSearch] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);

  const [filters, setFilters] = useState({
    vehicle: 'Any',
    gender: 'Any',
    maxPrice: 200,
    time: 'Any',
  });

  const greeting = () => {
    const h = new Date().getHours();

    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';

    return 'Good evening';
  };

  const filtered = rides.filter((r) => {
    const q = search.toLowerCase();

    const matchQ =
      !q ||
      r.from.toLowerCase().includes(q) ||
      r.to.toLowerCase().includes(q);

    const matchV =
      filters.vehicle === 'Any' ||
      r.vehicle === filters.vehicle;

    const matchG =
      filters.gender === 'Any' ||
      r.gender === 'Any' ||
      r.gender === filters.gender;

    const matchP = r.price <= filters.maxPrice;

    return matchQ && matchV && matchG && matchP;
  });

  return (
    <div
      className="page"
      style={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
      }}
    >

      {/* =====================================================
          CAMPUS BACKGROUND IMAGE
      ====================================================== */}

      <img
        src={campusBg}
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

      {/* =====================================================
          DARK OVERLAY
      ====================================================== */}

      <div
        style={{
          position: 'fixed',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(5,12,27,0.70) 0%, rgba(5,12,27,0.78) 35%, rgba(5,12,27,0.92) 70%, rgba(5,12,27,0.98) 100%)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      {/* =====================================================
          ALL WEBSITE CONTENT
      ====================================================== */}

      <div
        style={{
          position: 'relative',
          zIndex: 2,
        }}
      >

        {/* =====================================================
            HERO / HEADER
        ====================================================== */}

        <div
          style={{
            padding: '28px 20px 24px',
            maxWidth: 900,
            margin: '0 auto',
          }}
        >

          {/* TOP ROW */}

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 28,
            }}
          >

            <div>
              <p
                style={{
                  color: 'rgba(255,255,255,0.70)',
                  fontSize: 13,
                  margin: '0 0 5px',
                }}
              >
                {greeting()},
              </p>

              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: 26,
                  color: '#fff',
                  letterSpacing: '-0.5px',
                  margin: 0,
                }}
              >
                {user?.name?.split(' ')[0] || 'Student'} 👋
              </h2>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 9,
              }}
            >

              {/* VERIFIED BADGE */}

              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  background: 'rgba(34,197,94,0.16)',
                  border: '1px solid rgba(34,197,94,0.35)',
                  color: '#86efac',
                  borderRadius: 20,
                  padding: '6px 10px',
                  fontSize: 11,
                  fontWeight: 600,
                  backdropFilter: 'blur(10px)',
                }}
              >
                <ShieldCheck size={13} />
                Verified
              </span>

              {/* AVATAR */}

              <div
                className={`avatar ${user?.avatar || 'av-orange'}`}
                style={{
                  width: 40,
                  height: 40,
                  fontSize: 13,
                  border: '2px solid rgba(255,255,255,0.25)',
                }}
              >
                {user?.name
                  ? user.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase()
                  : 'GU'}
              </div>

            </div>
          </div>


          {/* =====================================================
              HERO TEXT
          ====================================================== */}

          <div
            style={{
              marginBottom: 24,
            }}
          >

            {/* CAMPUS RIDES BADGE */}

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
                background: 'rgba(255,111,0,0.15)',
                border: '1px solid rgba(255,111,0,0.30)',
                color: '#ff9b52',
                borderRadius: 20,
                padding: '7px 12px',
                fontSize: 11,
                fontWeight: 600,
                marginBottom: 13,
                backdropFilter: 'blur(10px)',
              }}
            >
              <Car size={13} />
              GU Campus Rides
            </div>


            {/* MAIN HEADING */}

            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(32px, 6vw, 50px)',
                lineHeight: 1.08,
                letterSpacing: '-1.7px',
                margin: 0,
                color: '#fff',
                maxWidth: 650,
              }}
            >
              Find a ride.
              <br />

              <span
                style={{
                  color: 'var(--accent)',
                }}
              >
                Share the journey.
              </span>
            </h1>


            {/* DESCRIPTION */}

            <p
              style={{
                color: 'rgba(255,255,255,0.72)',
                fontSize: 14,
                lineHeight: 1.65,
                maxWidth: 550,
                margin: '13px 0 0',
              }}
            >
              Connect with students heading your way,
              split the fare and make your daily commute easier.
            </p>

          </div>


          {/* =====================================================
              STATS
          ====================================================== */}

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 9,
              marginBottom: 22,
            }}
          >

            {/* STUDENTS */}

            <div
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.13)',
                borderRadius: 14,
                padding: '13px 11px',
                backdropFilter: 'blur(12px)',
              }}
            >
              <Users
                size={16}
                color="var(--accent)"
              />

              <div
                style={{
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: 14,
                  marginTop: 6,
                }}
              >
                Students
              </div>

              <div
                style={{
                  color: 'rgba(255,255,255,0.52)',
                  fontSize: 10,
                  marginTop: 2,
                }}
              >
                Campus community
              </div>
            </div>


            {/* SAVE MONEY */}

            <div
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.13)',
                borderRadius: 14,
                padding: '13px 11px',
                backdropFilter: 'blur(12px)',
              }}
            >
              <IndianRupee
                size={16}
                color="var(--accent)"
              />

              <div
                style={{
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: 14,
                  marginTop: 6,
                }}
              >
                Save Money
              </div>

              <div
                style={{
                  color: 'rgba(255,255,255,0.52)',
                  fontSize: 10,
                  marginTop: 2,
                }}
              >
                Split your fare
              </div>
            </div>


            {/* VERIFIED */}

            <div
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.13)',
                borderRadius: 14,
                padding: '13px 11px',
                backdropFilter: 'blur(12px)',
              }}
            >
              <ShieldCheck
                size={16}
                color="#4ade80"
              />

              <div
                style={{
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: 14,
                  marginTop: 6,
                }}
              >
                Verified
              </div>

              <div
                style={{
                  color: 'rgba(255,255,255,0.52)',
                  fontSize: 10,
                  marginTop: 2,
                }}
              >
                Safer rides
              </div>
            </div>

          </div>


          {/* =====================================================
              DESTINATION SHORTCUTS
          ====================================================== */}

          <div
            style={{
              display: 'flex',
              gap: 8,
              overflowX: 'auto',
              paddingBottom: 5,
              scrollbarWidth: 'none',
            }}
          >

            {[
              'Noida Sector 18',
              'Pari Chowk',
              'Greater Noida West',
              'Delhi',
              'Muradnagar',
            ].map((dest) => (

              <button
                key={dest}
                onClick={() => setSearch(dest)}
                style={{
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  background:
                    search === dest
                      ? 'var(--accent)'
                      : 'rgba(255,255,255,0.09)',
                  border:
                    search === dest
                      ? '1px solid var(--accent)'
                      : '1px solid rgba(255,255,255,0.15)',
                  borderRadius: 20,
                  padding: '7px 12px',
                  fontSize: 11,
                  color: '#fff',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-body)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <MapPin size={11} />
                {dest}
              </button>

            ))}

          </div>

        </div>


        {/* =====================================================
            SEARCH SECTION
        ====================================================== */}

        <div
          style={{
            padding: '14px 20px',
            position: 'sticky',
            top: 0,
            zIndex: 10,
            background: 'rgba(5,12,27,0.86)',
            backdropFilter: 'blur(18px)',
            borderTop: '1px solid rgba(255,255,255,0.07)',
            borderBottom: '1px solid rgba(255,255,255,0.10)',
          }}
        >

          <div
            style={{
              maxWidth: 900,
              margin: '0 auto',
            }}
          >

            {/* SEARCH BAR */}

            <div
              style={{
                display: 'flex',
                gap: 10,
              }}
            >

              <div
                style={{
                  flex: 1,
                  position: 'relative',
                }}
              >

                <Search
                  size={17}
                  style={{
                    position: 'absolute',
                    left: 13,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'rgba(255,255,255,0.50)',
                    pointerEvents: 'none',
                  }}
                />

                <input
                  className="input-field"
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    paddingLeft: 40,
                    paddingRight: search ? 38 : 12,
                    background: 'rgba(255,255,255,0.09)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: '#fff',
                    backdropFilter: 'blur(12px)',
                  }}
                  placeholder="Search destination..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

                {search && (
                  <button
                    onClick={() => setSearch('')}
                    style={{
                      position: 'absolute',
                      right: 10,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'rgba(255,255,255,0.60)',
                    }}
                  >
                    <X size={14} />
                  </button>
                )}

              </div>


              {/* FILTER BUTTON */}

              <button
                onClick={() => setFilterOpen(!filterOpen)}
                style={{
                  background: filterOpen
                    ? 'var(--accent)'
                    : 'rgba(255,255,255,0.09)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: 'var(--r-sm)',
                  width: 44,
                  height: 44,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  flexShrink: 0,
                  backdropFilter: 'blur(10px)',
                }}
              >
                <SlidersHorizontal
                  size={17}
                  color="#fff"
                />
              </button>

            </div>


            {/* =====================================================
                FILTER PANEL
            ====================================================== */}

            {filterOpen && (

              <div
                style={{
                  marginTop: 12,
                  background: 'rgba(15,25,45,0.97)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 14,
                  padding: 14,
                  backdropFilter: 'blur(20px)',
                }}
              >

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 10,
                    marginBottom: 12,
                  }}
                >

                  {/* VEHICLE */}

                  <div>

                    <label
                      style={{
                        fontSize: 11,
                        color: 'rgba(255,255,255,0.55)',
                        display: 'block',
                        marginBottom: 5,
                      }}
                    >
                      Vehicle
                    </label>

                    <select
                      className="input-field"
                      style={{
                        padding: '7px 10px',
                        fontSize: 13,
                      }}
                      value={filters.vehicle}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          vehicle: e.target.value,
                        })
                      }
                    >
                      <option>Any</option>
                      <option>Hatchback</option>
                      <option>Sedan</option>
                      <option>SUV</option>
                      <option>Auto</option>
                    </select>

                  </div>


                  {/* GENDER */}

                  <div>

                    <label
                      style={{
                        fontSize: 11,
                        color: 'rgba(255,255,255,0.55)',
                        display: 'block',
                        marginBottom: 5,
                      }}
                    >
                      Gender
                    </label>

                    <select
                      className="input-field"
                      style={{
                        padding: '7px 10px',
                        fontSize: 13,
                      }}
                      value={filters.gender}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          gender: e.target.value,
                        })
                      }
                    >
                      <option>Any</option>
                      <option>Girls only</option>
                      <option>Boys only</option>
                    </select>

                  </div>

                </div>


                {/* MAX PRICE */}

                <div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: 6,
                    }}
                  >

                    <label
                      style={{
                        fontSize: 11,
                        color: 'rgba(255,255,255,0.55)',
                      }}
                    >
                      Maximum price
                    </label>

                    <span
                      style={{
                        fontSize: 12,
                        color: 'var(--accent)',
                        fontWeight: 600,
                      }}
                    >
                      ₹{filters.maxPrice}
                    </span>

                  </div>

                  <input
                    type="range"
                    min="30"
                    max="300"
                    step="10"
                    value={filters.maxPrice}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        maxPrice: +e.target.value,
                      })
                    }
                    style={{
                      width: '100%',
                      accentColor: 'var(--accent)',
                    }}
                  />

                </div>

              </div>

            )}

          </div>

        </div>


        {/* =====================================================
            RIDE LIST
        ====================================================== */}

        <div
          style={{
            padding: '20px',
            maxWidth: 900,
            margin: '0 auto',
          }}
        >

          {/* RIDE HEADER */}

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 14,
            }}
          >

            <p
              className="section-head"
              style={{
                color: '#fff',
                margin: 0,
              }}
            >
              {filtered.length} rides found
            </p>

            <p
              style={{
                fontSize: 12,
                color: 'rgba(255,255,255,0.52)',
                margin: 0,
              }}
            >
              Today · Near GU
            </p>

          </div>


          {/* NO RIDES */}

          {filtered.length === 0 ? (

            <div
              style={{
                textAlign: 'center',
                padding: '60px 0',
              }}
            >

              <div
                style={{
                  fontSize: 36,
                  marginBottom: 12,
                }}
              >
                🔍
              </div>

              <p
                style={{
                  color: 'rgba(255,255,255,0.68)',
                  fontSize: 14,
                  lineHeight: 1.6,
                }}
              >
                No rides found.
                <br />
                Try a different destination.
              </p>

            </div>

          ) : (

            /* RIDE CARDS */

            filtered.map((ride, i) => (

              <div
                key={ride.id}
                className={`fade-up-${Math.min(i + 1, 4)}`}
                style={{
                  marginBottom: 12,
                }}
              >

                <RideCard
                  ride={ride}
                  onClick={() => onRideSelect(ride)}
                />

              </div>

            ))

          )}

        </div>

      </div>

    </div>
  );
}
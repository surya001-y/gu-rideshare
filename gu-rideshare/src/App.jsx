import { useState } from 'react';
import { AppProvider } from './context/AppContext';
import Login from './pages/Login';
import Home from './pages/Home';
import RideDetail from './pages/RideDetail';
import OfferRide from './pages/OfferRide';
import MyRides from './pages/MyRides';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import './index.css';

function NavIcon({ tab, active }) {
  const icons = {
    home: active
      ? <svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
      : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12L12 3l9 9M5 10v10h5v-6h4v6h5V10"/></svg>,
    offer: active
      ? <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/></svg>
      : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>,
    rides: active
      ? <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg>
      : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-4 0v2M8 7V5a2 2 0 014 0v2"/></svg>,
    chat: active
      ? <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
      : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
    profile: active
      ? <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
      : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  };
  return icons[tab] || null;
}

function MainApp() {
  const [tab, setTab] = useState('home');
  const [selectedRide, setSelectedRide] = useState(null);
  const [chatContact, setChatContact] = useState(null);

  const handleRideSelect = (ride) => setSelectedRide(ride);
  const handleOpenChat = (contact) => { setChatContact(contact); setTab('chat'); };

  if (selectedRide) {
    return <RideDetail ride={selectedRide} onBack={() => setSelectedRide(null)} onChat={handleOpenChat} />;
  }

  const navItems = [
    { id: 'home', label: 'Find' },
    { id: 'offer', label: 'Offer' },
    { id: 'rides', label: 'My Rides' },
    { id: 'chat', label: 'Chat' },
    { id: 'profile', label: 'Profile' },
  ];

  const renderPage = () => {
    switch (tab) {
      case 'home': return <Home onRideSelect={handleRideSelect} />;
      case 'offer': return <OfferRide />;
      case 'rides': return <MyRides onChat={handleOpenChat} />;
      case 'chat': return <Chat openContact={chatContact} onBack={() => { setChatContact(null); }} />;
      case 'profile': return <Profile onLogout={() => window.location.reload()} />;
      default: return <Home onRideSelect={handleRideSelect} />;
    }
  };

  return (
    <div className="app-shell">
      {renderPage()}
      <nav className="bottom-nav">
        {navItems.map(item => (
          <button
            key={item.id}
            className={`nav-btn${tab === item.id ? ' active' : ''}`}
            onClick={() => { setTab(item.id); if (item.id !== 'chat') setChatContact(null); }}
          >
            <NavIcon tab={item.id} active={tab === item.id} />
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
}

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <AppProvider>
      {loggedIn ? <MainApp /> : <Login onLogin={() => setLoggedIn(true)} />}
    </AppProvider>
  );
}

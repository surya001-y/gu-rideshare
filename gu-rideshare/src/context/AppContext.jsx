import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import api from '../api';

const AppContext = createContext(null);

// ─────────────────────────────────────────────
// Mock Rides
// ─────────────────────────────────────────────

export const mockRides = [
  {
    id: 1,
    driver: {
      name: 'Rohan Verma',
      initials: 'RV',
      college: 'Galgotias University',
      year: '3rd Year',
      rating: 4.9,
      trips: 47,
      avatar: 'av-orange',
    },
    from: 'GU Gate 1',
    to: 'Noida Sector 18',
    date: 'Today',
    time: '5:30 PM',
    seats: 2,
    price: 80,
    vehicle: 'Hatchback',
    gender: 'Any',
    recurring: true,
  },

  {
    id: 2,
    driver: {
      name: 'Priya Sharma',
      initials: 'PS',
      college: 'Galgotias University',
      year: '2nd Year',
      rating: 4.7,
      trips: 23,
      avatar: 'av-teal',
    },
    from: 'GU Boys Hostel',
    to: 'Greater Noida West',
    date: 'Today',
    time: '6:15 PM',
    seats: 3,
    price: 60,
    vehicle: 'Sedan',
    gender: 'Girls only',
    recurring: false,
  },

  {
    id: 3,
    driver: {
      name: 'Aman Gupta',
      initials: 'AG',
      college: 'Galgotias University',
      year: '4th Year',
      rating: 5.0,
      trips: 88,
      avatar: 'av-green',
    },
    from: 'GU Academic Block',
    to: 'Pari Chowk Metro',
    date: 'Today',
    time: '7:00 PM',
    seats: 1,
    price: 50,
    vehicle: 'SUV',
    gender: 'Any',
    recurring: true,
  },

  {
    id: 4,
    driver: {
      name: 'Sneha Yadav',
      initials: 'SY',
      college: 'Galgotias University',
      year: '1st Year',
      rating: 4.6,
      trips: 12,
      avatar: 'av-purple',
    },
    from: 'GU Gate 2',
    to: 'Ansal Plaza',
    date: 'Tomorrow',
    time: '9:00 AM',
    seats: 2,
    price: 70,
    vehicle: 'Hatchback',
    gender: 'Girls only',
    recurring: false,
  },
];

// ─────────────────────────────────────────────
// Mock Chats
// ─────────────────────────────────────────────

export const mockChats = [
  {
    id: 1,
    name: 'Rohan Verma',
    initials: 'RV',
    avatar: 'av-orange',
    lastMsg: "I'll be at Gate 1 in 5 mins 🚗",
    time: '5:24 PM',
    unread: 2,
    online: true,
  },

  {
    id: 2,
    name: 'Priya Sharma',
    initials: 'PS',
    avatar: 'av-teal',
    lastMsg: 'Confirmed! See you tomorrow',
    time: 'Yesterday',
    unread: 0,
    online: false,
  },

  {
    id: 3,
    name: 'Aman Gupta',
    initials: 'AG',
    avatar: 'av-green',
    lastMsg: 'Route will be via Yamuna Expy',
    time: 'Mon',
    unread: 0,
    online: true,
  },
];

// ─────────────────────────────────────────────
// App Provider
// ─────────────────────────────────────────────

export function AppProvider({ children }) {

  // Actual logged-in user
  const [user, setUser] = useState(null);

  // Loading state while fetching user
  const [userLoading, setUserLoading] = useState(true);

  // ─────────────────────────────────────────────
  // Get logged-in user from backend
  // ─────────────────────────────────────────────

  useEffect(() => {

    const token = localStorage.getItem('token');

    // No token = no logged-in user
    if (!token) {
      setUser(null);
      setUserLoading(false);
      return;
    }

    api
      .get('/auth/me')
      .then((response) => {

        const data = response.data;

        // Create initials from actual user's name
        const initials = data.name
          ? data.name
              .trim()
              .split(/\s+/)
              .map((word) => word[0])
              .join('')
              .slice(0, 2)
              .toUpperCase()
          : 'U';

        // Store actual backend user
        setUser({
          ...data,

          initials,

          // Keep these values if backend doesn't provide them
          college: data.college || 'Galgotias University',

          rating:
            data.rating?.avg ??
            data.rating ??
            5,

          trips:
            data.trips ??
            0,
        });

      })
      .catch((error) => {

        console.error(
          'Failed to load logged-in user:',
          error
        );

        // Token invalid/expired
        if (
          error.response?.status === 401 ||
          error.response?.status === 403
        ) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }

        setUser(null);

      })
      .finally(() => {

        setUserLoading(false);

      });

  }, []);

  // ─────────────────────────────────────────────
  // Rides
  // ─────────────────────────────────────────────

  const [rides, setRides] = useState(mockRides);

  // ─────────────────────────────────────────────
  // My Rides
  // ─────────────────────────────────────────────

  const [myRides] = useState([
    {
      id: 'my1',
      type: 'booked',
      status: 'live',
      driver: 'Rohan Verma',
      from: 'GU Gate 1',
      to: 'Sector 18',
      time: '5:30 PM',
      date: 'Today',
      price: 80,
      eta: '4 min',
    },

    {
      id: 'my2',
      type: 'offered',
      status: 'upcoming',
      from: 'GU Gate 2',
      to: 'Pari Chowk',
      time: '8:00 AM',
      date: 'Tomorrow',
      seats: 2,
      price: 70,
    },

    {
      id: 'my3',
      type: 'booked',
      status: 'completed',
      driver: 'Sneha Yadav',
      from: 'GU',
      to: 'Ansal Plaza',
      time: '9:00 AM',
      date: '20 May',
      price: 70,
      rated: false,
    },
  ]);

  // ─────────────────────────────────────────────
  // Notifications
  // ─────────────────────────────────────────────

  const [notifications] = useState([
    {
      id: 1,
      type: 'request',
      msg: 'Priya Sharma wants to join your ride to Pari Chowk',
      time: '2 min ago',
      read: false,
    },

    {
      id: 2,
      type: 'chat',
      msg: "Rohan Verma: I'll be at Gate 1 in 5 mins",
      time: '10 min ago',
      read: false,
    },

    {
      id: 3,
      type: 'reminder',
      msg: 'Going home this weekend? 3 rides available to Delhi',
      time: '1 hr ago',
      read: true,
    },

    {
      id: 4,
      type: 'rated',
      msg: 'Aman Gupta gave you ⭐ 5.0 — great co-passenger!',
      time: 'Yesterday',
      read: true,
    },
  ]);

  // ─────────────────────────────────────────────
  // Add Ride
  // ─────────────────────────────────────────────

  const addRide = (ride) => {

    setRides((prev) => [
      {
        ...ride,
        id: Date.now(),
      },
      ...prev,
    ]);

  };

  // ─────────────────────────────────────────────
  // Context
  // ─────────────────────────────────────────────

  return (
    <AppContext.Provider
      value={{
        user,
        userLoading,
        rides,
        myRides,
        notifications,
        addRide,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// ─────────────────────────────────────────────
// useApp Hook
// ─────────────────────────────────────────────

export const useApp = () =>
  useContext(AppContext);
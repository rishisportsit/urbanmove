import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Navigation, 
  Activity, 
  LogOut, 
  UserPlus, 
  LogIn, 
  Plus, 
  RefreshCw,
  TrendingUp,
  Truck,
  AlertCircle
} from 'lucide-react';
import './App.css';

const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
  ? 'http://localhost:3000' 
  : 'http://13.48.1.93:3000';

function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('login'); // login, register, dashboard
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [trips, setTrips] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Trip form state
  const [tripFrom, setTripFrom] = useState('');
  const [tripTo, setTripTo] = useState('');
  const [tripDistance, setTripDistance] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token && !user) {
      fetchAnalytics();
      setView('dashboard');
    }
  }, [token]);

  const fetchAnalytics = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/analytics`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setAnalytics(res.data);
    } catch (err) {
      setError('Failed to fetch analytics');
    }
  };

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/mobility/trips`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setTrips(res.data);
    } catch (err) {
      setError('Failed to fetch trips');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/login`, { email });
      const data = res.data;
      localStorage.setItem('token', data.token);
      
      // Basic JWT decode to get user ID
      const base64Url = data.token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(window.atob(base64));
      
      localStorage.setItem('userId', payload.id);
      setUser(payload);
      
      setView('dashboard');
      fetchAnalytics();
      setError('');
    } catch (err) {
      setError('Login failed. Ensure you are registered.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/auth/register`, { name, email });
      setView('login');
      setError('');
      alert('Registration successful! Please login.');
    } catch (err) {
      setError('Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTrip = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const storedUserId = localStorage.getItem('userId');
      await axios.post(`${API_BASE_URL}/mobility/trip`, 
        { from: tripFrom, to: tripTo, distance: parseFloat(tripDistance), userId: storedUserId },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setTripFrom(''); setTripTo(''); setTripDistance('');
      fetchAnalytics();
      fetchTrips();
      setError('');
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to create trip.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setUser(null);
    setView('login');
  };

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <div className="container">
      <header>
        <div className="logo">
          <Navigation size={32} />
          UrbanMove
        </div>
        {token && (
          <button className="secondary" style={{ width: 'auto' }} onClick={logout}>
            <LogOut size={18} />
            Logout
          </button>
        )}
      </header>

      <AnimatePresence mode="wait">
        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="error-msg"
          >
            <AlertCircle size={18} />
            {error}
          </motion.div>
        )}

        {(view === 'login' || view === 'register') && (
          <motion.div 
            key="auth"
            className="auth-container"
            {...fadeIn}
          >
            <div className="card auth-card">
              <h2>{view === 'login' ? 'Welcome Back' : 'Join UrbanMove'}</h2>
              <p>{view === 'login' ? 'Sign in to manage your mobility' : 'Start your journey with us today'}</p>
              
              <form onSubmit={view === 'login' ? handleLogin : handleRegister}>
                {view === 'register' && (
                  <div className="form-group">
                    <label>Full Name</label>
                    <input type="text" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} required />
                  </div>
                )}
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" placeholder="email@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <button type="submit" disabled={loading}>
                  {loading ? <RefreshCw className="spin" size={18} /> : (view === 'login' ? <LogIn size={18} /> : <UserPlus size={18} />)}
                  {view === 'login' ? 'Sign In' : 'Register Account'}
                </button>
              </form>
              
              <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  {view === 'login' ? "Don't have an account? " : "Already have an account? "}
                </span>
                <button className="ghost" onClick={() => setView(view === 'login' ? 'register' : 'login')}>
                  {view === 'login' ? 'Create one' : 'Sign in'}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {view === 'dashboard' && (
          <motion.div 
            key="dashboard"
            className="container"
            {...fadeIn}
          >
            <div className="stats-row">
              <div className="card stat-card">
                <div className="stat-label">
                  <Activity size={16} /> Total Trips
                </div>
                <div className="stat-value">{analytics?.totalTrips || 0}</div>
              </div>
              <div className="card stat-card">
                <div className="stat-label">
                  <TrendingUp size={16} /> Avg Distance
                </div>
                <div className="stat-value">{analytics?.averageDistance?.toFixed(1) || 0} <span style={{fontSize: '1rem'}}>km</span></div>
              </div>
              <div className="card stat-card">
                <div className="stat-label">
                  <Truck size={16} /> Active Fleet
                </div>
                <div className="stat-value">{analytics?.totalActiveVehicles || 0}</div>
              </div>
            </div>

            <div className="grid">
              <div className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <MapPin className="text-primary" />
                  <h2 style={{ margin: 0 }}>Book a Trip</h2>
                </div>
                <form onSubmit={handleCreateTrip}>
                  <div className="form-group">
                    <label>Pickup Location</label>
                    <input placeholder="Enter origin" value={tripFrom} onChange={e => setTripFrom(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label>Destination</label>
                    <input placeholder="Enter destination" value={tripTo} onChange={e => setTripTo(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label>Estimated Distance (km)</label>
                    <input type="number" step="0.1" placeholder="e.g. 5.5" value={tripDistance} onChange={e => setTripDistance(e.target.value)} required />
                  </div>
                  <button type="submit" disabled={loading}>
                    {loading ? <RefreshCw className="spin" size={18} /> : <Plus size={18} />}
                    Create Trip
                  </button>
                </form>
              </div>

              <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h2 style={{ margin: 0 }}>Recent Activity</h2>
                  <button className="secondary" style={{ width: 'auto', padding: '0.5rem 0.75rem' }} onClick={fetchTrips} disabled={loading}>
                    <RefreshCw className={loading ? 'spin' : ''} size={16} />
                  </button>
                </div>
                
                <div className="activity-list">
                  {trips.length === 0 ? (
                    <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No trips found. Start your first journey!</p>
                  ) : (
                    trips.slice(0, 5).map(t => (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        key={t.id} 
                        className="activity-item"
                      >
                        <div className="activity-icon">
                          <Navigation size={18} />
                        </div>
                        <div className="activity-details">
                          <div className="activity-route">{t.from} ➔ {t.to}</div>
                          <div className="activity-meta">{t.distance} km • {new Date(t.createdAt).toLocaleDateString()}</div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .text-primary { color: var(--primary); }
      `}</style>
    </div>
  );
}

export default App;

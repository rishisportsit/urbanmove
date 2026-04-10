import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE_URL = 'http://13.48.1.93:3000';

function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('login'); // login, register, dashboard
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [trips, setTrips] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState('');

  // Trip form state
  const [tripFrom, setTripFrom] = useState('');
  const [tripTo, setTripTo] = useState('');
  const [tripDistance, setTripDistance] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token && !user) {
      // Basic decode or just fetch analytics to verify
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
    try {
      const res = await axios.get(`${API_BASE_URL}/mobility/trips`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setTrips(res.data);
    } catch (err) {
      setError('Failed to fetch trips');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/login`, { email });
      localStorage.setItem('token', res.token || res.data.token);
      setUser({ email });
      setView('dashboard');
      fetchAnalytics();
      setError('');
    } catch (err) {
      setError('Login failed. Ensure you are registered.');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/auth/register`, { name, email });
      setView('login');
      setError('');
      alert('Registration successful! Please login.');
    } catch (err) {
      setError('Registration failed.');
    }
  };

  const handleCreateTrip = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/mobility/trip`, 
        { from: tripFrom, to: tripTo, distance: parseFloat(tripDistance), userId: 'me' },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setTripFrom(''); setTripTo(''); setTripDistance('');
      fetchAnalytics();
      fetchTrips();
      alert('Trip created!');
    } catch (err) {
      setError('Failed to create trip.');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setView('login');
  };

  return (
    <div className="container">
      <header>
        <h1>UrbanMove 🚀</h1>
        {token && <button onClick={logout}>Logout</button>}
      </header>

      {error && <div className="error">{error}</div>}

      {view === 'login' && (
        <div className="card">
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
            <button type="submit">Login</button>
          </form>
          <p>No account? <button onClick={() => setView('register')}>Register</button></p>
        </div>
      )}

      {view === 'register' && (
        <div className="card">
          <h2>Register</h2>
          <form onSubmit={handleRegister}>
            <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
            <button type="submit">Register</button>
          </form>
          <p>Have an account? <button onClick={() => setView('login')}>Login</button></p>
        </div>
      )}

      {view === 'dashboard' && (
        <div className="dashboard">
          <div className="stats grid">
            <div className="stat-card">
              <h3>Total Trips</h3>
              <p>{analytics?.totalTrips || 0}</p>
            </div>
            <div className="stat-card">
              <h3>Avg Distance</h3>
              <p>{analytics?.averageDistance?.toFixed(2) || 0} km</p>
            </div>
            <div className="stat-card">
              <h3>Active Vehicles</h3>
              <p>{analytics?.totalActiveVehicles || 0}</p>
            </div>
          </div>

          <div className="grid">
            <div className="card">
              <h2>Create New Trip</h2>
              <form onSubmit={handleCreateTrip}>
                <input placeholder="From" value={tripFrom} onChange={e => setTripFrom(e.target.value)} required />
                <input placeholder="To" value={tripTo} onChange={e => setTripTo(e.target.value)} required />
                <input type="number" placeholder="Distance (km)" value={tripDistance} onChange={e => setTripDistance(e.target.value)} required />
                <button type="submit">Start Trip</button>
              </form>
            </div>

            <div className="card">
              <h2>Recent Activity</h2>
              <button onClick={fetchTrips}>Refresh Trips</button>
              <ul>
                {trips.map(t => (
                  <li key={t.id}>{t.from} ➔ {t.to} ({t.distance}km)</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

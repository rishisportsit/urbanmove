const db = require('../utils/db');
const { v4: uuidv4 } = require('uuid');

async function createTrip({ origin, destination, status = 'pending', userId }) {
  const id = uuidv4();
  const query = 'INSERT INTO trips(id, origin, destination, status, user_id) VALUES($1, $2, $3, $4, $5) RETURNING *';
  const values = [id, origin, destination, status, userId];
  const res = await db.query(query, values);
  const row = res.rows[0];
  return { 
    id: row.id, 
    origin: row.origin, 
    destination: row.destination, 
    status: row.status, 
    userId: row.user_id, 
    createdAt: row.created_at 
  };
}

async function getAllTrips() {
  const query = 'SELECT id, origin, destination, status, user_id as "userId", created_at as "createdAt" FROM trips ORDER BY created_at DESC';
  const res = await db.query(query);
  return res.rows;
}

async function getTripsByUserId(userId) {
  const query = 'SELECT id, origin, destination, status, user_id as "userId", created_at as "createdAt" FROM trips WHERE user_id = $1 ORDER BY created_at DESC';
  const res = await db.query(query, [userId]);
  return res.rows;
}

async function getTripsCount() {
  const query = 'SELECT COUNT(*) FROM trips';
  const res = await db.query(query);
  return parseInt(res.rows[0].count, 10);
}

module.exports = { createTrip, getAllTrips, getTripsByUserId, getTripsCount };

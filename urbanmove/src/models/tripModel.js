const db = require('../utils/db');
const { v4: uuidv4 } = require('uuid');

function createTrip({ from, to, distance, userId }) {
  const id = uuidv4();
  const createdAt = new Date().toISOString();
  const trip = { id, from, to, distance, userId, createdAt };
  db.trips.push(trip);
  db.save();
  return trip;
}

function getAllTrips() {
  return db.trips.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function getTripsByUserId(userId) {
  return db.trips.filter(t => t.userId === userId);
}

module.exports = { createTrip, getAllTrips, getTripsByUserId };

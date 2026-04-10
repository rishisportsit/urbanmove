const trips = require('../models/tripModel');
const users = require('../models/userModel');
const queue = require('./queueService');

function createTrip(from, to, distance, userId) {
  if (!from || !to || typeof distance !== 'number' || !userId) {
    const err = new Error('from, to, distance, userId are required');
    err.status = 400;
    throw err;
  }
  const user = users.findById(userId);
  if (!user) {
    const err = new Error('user not found');
    err.status = 404;
    throw err;
  }
  const trip = trips.createTrip({ from, to, distance, userId });
  queue.enqueue({ type: 'TRIP_CREATED', payload: { tripId: trip.id, userId: trip.userId, distance: trip.distance }, timestamp: Date.now() });
  return trip;
}

function getAllTrips() {
  return trips.getAllTrips();
}

function getTripsByUser(userId) {
  return trips.getTripsByUserId(userId);
}

module.exports = { createTrip, getAllTrips, getTripsByUser };

const trips = require('../models/tripModel');
const users = require('../models/userModel');
const queue = require('./queueService');

async function createTrip(from, to, distance, userId) {
  if (!from || !to || typeof distance !== 'number' || !userId) {
    const err = new Error('from, to, distance, userId are required');
    err.status = 400;
    throw err;
  }
  const user = await users.findById(userId);
  if (!user) {
    const err = new Error('user not found');
    err.status = 404;
    throw err;
  }
  const trip = await trips.createTrip({ from, to, distance, userId });
  queue.enqueue({ type: 'TRIP_CREATED', payload: { tripId: trip.id, userId: trip.userId, distance: trip.distance }, timestamp: Date.now() });
  return trip;
}

async function getAllTrips() {
  return await trips.getAllTrips();
}

async function getTripsByUser(userId) {
  return await trips.getTripsByUserId(userId);
}

module.exports = { createTrip, getAllTrips, getTripsByUser };

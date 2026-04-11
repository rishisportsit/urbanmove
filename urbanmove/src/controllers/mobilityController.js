const mobilityService = require('../services/mobilityService');

async function createTrip(req, res, next) {
  try {
    const { from, to, distance, userId } = req.body;
    const dist = typeof distance === 'number' ? distance : Number(distance);
    const trip = await mobilityService.createTrip(from, to, dist, userId);
    res.status(201).json(trip);
  } catch (e) {
    next(e);
  }
}

async function getAllTrips(req, res, next) {
  try {
    const trips = await mobilityService.getAllTrips();
    res.json(trips);
  } catch (e) {
    next(e);
  }
}

async function getTripsByUser(req, res, next) {
  try {
    const trips = await mobilityService.getTripsByUser(req.params.id);
    res.json(trips);
  } catch (e) {
    next(e);
  }
}

module.exports = { createTrip, getAllTrips, getTripsByUser };

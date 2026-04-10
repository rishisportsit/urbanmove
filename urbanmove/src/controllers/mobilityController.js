const mobilityService = require('../services/mobilityService');

function createTrip(req, res, next) {
  try {
    const { from, to, distance, userId } = req.body;
    const dist = typeof distance === 'number' ? distance : Number(distance);
    const trip = mobilityService.createTrip(from, to, dist, userId);
    res.status(201).json(trip);
  } catch (e) {
    next(e);
  }
}

function getAllTrips(req, res, next) {
  try {
    const trips = mobilityService.getAllTrips();
    res.json(trips);
  } catch (e) {
    next(e);
  }
}

function getTripsByUser(req, res, next) {
  try {
    const trips = mobilityService.getTripsByUser(req.params.id);
    res.json(trips);
  } catch (e) {
    next(e);
  }
}

module.exports = { createTrip, getAllTrips, getTripsByUser };

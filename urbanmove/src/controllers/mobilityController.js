const mobilityService = require('../services/mobilityService');

async function createTrip(req, res, next) {
  try {
    // Note: userId may come from authenticated token or req.body depending on frontend preference.
    // Ensure we capture it from the body but fallback to req.user layer if middleware injected it.
    const userId = req.body.userId || (req.user ? req.user.id : null);
    const { origin, destination, status } = req.body;
    
    const trip = await mobilityService.createTrip(origin, destination, status, userId);
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

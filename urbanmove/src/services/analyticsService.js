const db = require('../utils/db');
const vehicle = require('./vehicleDataService');

function totalTrips() {
  return db.trips.length;
}

function averageDistance() {
  if (db.trips.length === 0) return 0;
  const sum = db.trips.reduce((a, t) => a + Number(t.distance || 0), 0);
  return sum / db.trips.length;
}

function totalActiveVehicles() {
  return vehicle.getActiveVehicleCount();
}

function getAnalytics() {
  return { totalTrips: totalTrips(), averageDistance: averageDistance(), totalActiveVehicles: totalActiveVehicles() };
}

module.exports = { getAnalytics };

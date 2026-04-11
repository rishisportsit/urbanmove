const trips = require('../models/tripModel');
const vehicle = require('./vehicleDataService');

async function totalTrips() {
  return await trips.getTripsCount();
}

async function averageDistance() {
  return await trips.getAverageDistance();
}

function totalActiveVehicles() {
  return vehicle.getActiveVehicleCount();
}

async function getAnalytics() {
  const [total, avg] = await Promise.all([totalTrips(), averageDistance()]);
  return { 
    totalTrips: total, 
    averageDistance: avg, 
    totalActiveVehicles: totalActiveVehicles() 
  };
}

module.exports = { getAnalytics };

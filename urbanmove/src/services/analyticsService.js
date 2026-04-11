const trips = require('../models/tripModel');
const users = require('../models/userModel');
const vehicle = require('./vehicleDataService');

async function totalTrips() {
  return await trips.getTripsCount();
}

async function totalUsers() {
  return await users.getUsersCount();
}

function totalActiveVehicles() {
  return vehicle.getActiveVehicleCount();
}

async function getAnalytics() {
  const [tTrips, tUsers] = await Promise.all([totalTrips(), totalUsers()]);
  return { 
    totalTrips: tTrips, 
    totalUsers: tUsers, 
    totalActiveVehicles: totalActiveVehicles() 
  };
}

module.exports = { getAnalytics };

const db = require('../utils/db');
const { v4: uuidv4 } = require('uuid');

let started = false;
let vehicleIds = [];

function randomCoord(min, max) {
  return +(Math.random() * (max - min) + min).toFixed(6);
}

function tick() {
  if (vehicleIds.length === 0) {
    vehicleIds = Array.from({ length: 5 }, () => uuidv4());
  }
  vehicleIds.forEach(id => {
    const data = {
      vehicleId: id,
      speed: Math.floor(Math.random() * 80),
      location: { lat: randomCoord(-90, 90), lng: randomCoord(-180, 180) },
      timestamp: new Date().toISOString()
    };
    db.vehicleData[id] = data;
  });
  db.save();
}

function start() {
  if (started) return;
  started = true;
  tick();
  setInterval(tick, 3000);
}

function getActiveVehicleCount() {
  return Object.keys(db.vehicleData).length;
}

function getLatestData() {
  return Object.values(db.vehicleData);
}

module.exports = { start, getActiveVehicleCount, getLatestData };

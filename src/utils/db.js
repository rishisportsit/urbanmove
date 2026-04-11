const { Pool } = require('pg');
const logger = require('./logger');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  // Add production-ready settings
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

// Ephemeral memory for simulation events and vehicle data
const memoryStore = {
  events: [],
  vehicleData: {}
};

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
  memoryStore
};

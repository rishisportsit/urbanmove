const { Pool } = require('pg');
const logger = require('./logger');

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

// Ephemeral in-memory structures for simulation/worker
const memoryStore = {
  events: [],
  vehicleData: {}
};

const initDb = async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL
      );
      CREATE TABLE IF NOT EXISTS trips (
        id UUID PRIMARY KEY,
        "from" TEXT NOT NULL,
        "to" TEXT NOT NULL,
        distance FLOAT NOT NULL,
        user_id UUID REFERENCES users(id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    logger.info('PostgreSQL tables initialized or already exist.');
  } catch (err) {
    logger.error('Error initializing PostgreSQL tables:', err);
  } finally {
    client.release();
  }
};

module.exports = {
  query: (text, params) => pool.query(text, params),
  initDb,
  memoryStore
};

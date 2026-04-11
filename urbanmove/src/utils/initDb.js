const { pool } = require('./db');
const logger = require('./logger');

/**
 * Initializes the database tables on startup.
 * Ensures the system is production-ready and consistent.
 */
const initDb = async () => {
  const client = await pool.connect();
  try {
    logger.info('Initializing AWS RDS database tables...');
    
    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL
      );
    `);

    // Create trips table
    await client.query(`
      CREATE TABLE IF NOT EXISTS trips (
        id UUID PRIMARY KEY,
        "from" TEXT NOT NULL,
        "to" TEXT NOT NULL,
        distance FLOAT NOT NULL,
        user_id UUID REFERENCES users(id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    logger.info('AWS RDS database initialization complete.');
  } catch (err) {
    logger.error('Database initialization failed on RDS:', err);
    throw err;
  } finally {
    client.release();
  }
};

module.exports = { initDb };

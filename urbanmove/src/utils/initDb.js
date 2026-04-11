const { pool } = require('./db');
const logger = require('./logger');
const bcrypt = require('bcryptjs');

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Initializes the database tables on startup.
 * Ensures the system is production-ready and consistent.
 */
const initDb = async (retries = 5, delay = 5000) => {
  let client;
  for (let i = 0; i < retries; i++) {
    try {
      client = await pool.connect();
      logger.info('Connected to AWS RDS database.');
      break;
    } catch (err) {
      logger.warn(`Database connection failed on attempt ${i + 1}/${retries}. Retrying in ${delay / 1000}s...`);
      if (i === retries - 1) {
        logger.error('Exhausted all database retries.');
        throw err;
      }
      await wait(delay);
    }
  }

  try {
    logger.info('Initializing AWS RDS database tables...');
    
    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create trips table
    await client.query(`
      CREATE TABLE IF NOT EXISTS trips (
        id UUID PRIMARY KEY,
        origin TEXT NOT NULL,
        destination TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        user_id UUID REFERENCES users(id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Seed test user
    const res = await client.query('SELECT COUNT(*) FROM users');
    if (parseInt(res.rows[0].count) === 0) {
      const hp = await bcrypt.hash('UrbanDB123!', 10);
      await client.query('INSERT INTO users(id, name, email, password) VALUES($1, $2, $3, $4)', 
        ['00000000-0000-0000-0000-000000000000', 'Test User', 'test@urbanmove.com', hp]);
      logger.info('Seeded test user (test@urbanmove.com / UrbanDB123!)');
    }

    logger.info('AWS RDS database initialization complete.');
  } catch (err) {
    logger.error('Database initialization failed on RDS:', err);
    throw err;
  } finally {
    if (client) client.release();
  }
};

module.exports = { initDb };

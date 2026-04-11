const dotenv = require('dotenv');
dotenv.config();
const app = require('./src/app');
const vehicleData = require('./src/services/vehicleDataService');
const worker = require('./src/services/worker');
const { initDb } = require('./src/utils/initDb');
const logger = require('./src/utils/logger');

const PORT = process.env.PORT || 3000;

/**
 * Main application entry point.
 * Ensures database is initialized before starting the Express server.
 */
const startServer = async () => {
  try {
    // Step 1: Initialize AWS RDS Database
    await initDb();

    // Step 2: Start Express Server
    const server = app.listen(PORT, '0.0.0.0', () => {
      logger.info(`UrbanMove API listening on 0.0.0.0:${PORT}`);
      logger.info('System is production-ready and connected to AWS RDS.');
    });

    // Step 3: Start simulation and background worker
    vehicleData.start();
    worker.start();

    return server;
  } catch (err) {
    logger.error('CRITICAL: Failed to start server:', err);
    process.exit(1);
  }
};

const server = startServer();

module.exports = server;

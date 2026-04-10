const dotenv = require('dotenv');
dotenv.config();
const app = require('./src/app');
const vehicleData = require('./src/services/vehicleDataService');
const worker = require('./src/services/worker');
const db = require('./src/utils/db');
const logger = require('./src/utils/logger');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Initialize Database
    await db.initDb();

    const server = app.listen(PORT, '0.0.0.0', () => {
      logger.info(`UrbanMove API listening on 0.0.0.0:${PORT}`);
    });

    // Start simulations/workers
    vehicleData.start();
    worker.start();

    return server;
  } catch (err) {
    logger.error('Failed to start server:', err);
    process.exit(1);
  }
};

const server = startServer();

module.exports = server;

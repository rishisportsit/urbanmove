const queue = require('./queueService');
const logger = require('../utils/logger');

let started = false;

function start() {
  if (started) return;
  started = true;
  setInterval(() => {
    const event = queue.dequeue();
    if (event) {
      logger.info(`[Worker] Processed event: ${event.type} - ID: ${event.payload?.id || 'N/A'}`);
      if (event.type === 'TRIP_CREATED') {
        // Logic for TRIP_CREATED event processing (e.g. notifications, stats)
      }
    }
  }, 3000); // Process every 3 seconds as requested
}

module.exports = { start };

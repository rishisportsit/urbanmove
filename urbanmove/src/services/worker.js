const queue = require('./queueService');

let started = false;

function start() {
  if (started) return;
  started = true;
  setInterval(() => {
    const event = queue.dequeue();
    if (event) {
      if (event.type === 'TRIP_CREATED') {
      }
    }
  }, 1000);
}

module.exports = { start };

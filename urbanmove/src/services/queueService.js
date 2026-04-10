const db = require('../utils/db');

function enqueue(event) {
  db.memoryStore.events.push(event);
}

function dequeue() {
  return db.memoryStore.events.shift();
}

function size() {
  return db.memoryStore.events.length;
}

module.exports = { enqueue, dequeue, size };

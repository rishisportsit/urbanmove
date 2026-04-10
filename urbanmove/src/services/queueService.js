const db = require('../utils/db');

function enqueue(event) {
  db.events.push(event);
}

function dequeue() {
  return db.events.shift();
}

function size() {
  return db.events.length;
}

module.exports = { enqueue, dequeue, size };

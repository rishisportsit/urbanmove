const db = require('../utils/db');

function enqueue(event) {
  db.events.push(event);
  db.save();
}

function dequeue() {
  const event = db.events.shift();
  if (event) db.save();
  return event;
}

function size() {
  return db.events.length;
}

module.exports = { enqueue, dequeue, size };

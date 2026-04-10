const db = require('../utils/db');
const { v4: uuidv4 } = require('uuid');

function createUser(name, email) {
  const user = { id: uuidv4(), name, email };
  db.users.push(user);
  return user;
}

function findByEmail(email) {
  return db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
}

function findById(id) {
  return db.users.find(u => u.id === id);
}

module.exports = { createUser, findByEmail, findById };

const db = require('../utils/db');
const { v4: uuidv4 } = require('uuid');

async function createUser(name, email, password) {
  const id = uuidv4();
  const query = 'INSERT INTO users(id, name, email, password) VALUES($1, $2, $3, $4) RETURNING *';
  const values = [id, name, email, password];
  const res = await db.query(query, values);
  return res.rows[0];
}

async function findByEmail(email) {
  const query = 'SELECT * FROM users WHERE LOWER(email) = LOWER($1)';
  const res = await db.query(query, [email]);
  return res.rows[0];
}

async function findById(id) {
  const query = 'SELECT * FROM users WHERE id = $1';
  const res = await db.query(query, [id]);
  return res.rows[0];
}

async function getUsersCount() {
  const query = 'SELECT COUNT(*) FROM users';
  const res = await db.query(query);
  return parseInt(res.rows[0].count, 10);
}

module.exports = { createUser, findByEmail, findById, getUsersCount };

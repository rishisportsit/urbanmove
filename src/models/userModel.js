const db = require('../utils/db');
const { v4: uuidv4 } = require('uuid');

async function createUser(name, email) {
  const id = uuidv4();
  const query = 'INSERT INTO users(id, name, email) VALUES($1, $2, $3) RETURNING *';
  const values = [id, name, email];
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

module.exports = { createUser, findByEmail, findById };

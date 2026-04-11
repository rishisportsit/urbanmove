const jwt = require('jsonwebtoken');
const users = require('../models/userModel');

async function register(name, email) {
  if (!name || !email) {
    const err = new Error('name and email are required');
    err.status = 400;
    throw err;
  }
  const existing = await users.findByEmail(email);
  if (existing) {
    const err = new Error('email already registered');
    err.status = 409;
    throw err;
  }
  const user = await users.createUser(name, email);
  return user;
}

async function login(email) {
  if (!email) {
    const err = new Error('email is required');
    err.status = 400;
    throw err;
  }
  const user = await users.findByEmail(email);
  if (!user) {
    const err = new Error('invalid credentials');
    err.status = 401;
    throw err;
  }
  const payload = { id: user.id, email: user.email, name: user.name };
  const secret = process.env.JWT_SECRET || 'devsecret';
  const token = jwt.sign(payload, secret, { expiresIn: '1h' });
  return token;
}

module.exports = { register, login };

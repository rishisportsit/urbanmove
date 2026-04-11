const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const users = require('../models/userModel');

async function register(name, email, password) {
  if (!name || !email || !password) {
    const err = new Error('name, email, and password are required');
    err.status = 400;
    throw err;
  }
  const existing = await users.findByEmail(email);
  if (existing) {
    const err = new Error('email already registered');
    err.status = 409;
    throw err;
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await users.createUser(name, email, hashedPassword);
  return user;
}

async function login(email, password) {
  if (!email || !password) {
    const err = new Error('email and password are required');
    err.status = 400;
    throw err;
  }
  const user = await users.findByEmail(email);
  if (!user) {
    const err = new Error('invalid credentials');
    err.status = 401;
    throw err;
  }
  
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
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

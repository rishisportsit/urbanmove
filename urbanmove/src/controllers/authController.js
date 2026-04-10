const authService = require('../services/authService');

async function register(req, res, next) {
  try {
    const { name, email } = req.body;
    const user = await authService.register(name, email);
    res.status(201).json({ id: user.id, name: user.name, email: user.email });
  } catch (e) {
    next(e);
  }
}

async function login(req, res, next) {
  try {
    const { email } = req.body;
    const token = await authService.login(email);
    res.json({ token });
  } catch (e) {
    next(e);
  }
}

module.exports = { register, login };

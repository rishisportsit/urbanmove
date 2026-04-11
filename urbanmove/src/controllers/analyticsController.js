const analyticsService = require('../services/analyticsService');

async function get(req, res, next) {
  try {
    const stats = await analyticsService.getAnalytics();
    res.json(stats);
  } catch (e) {
    next(e);
  }
}

module.exports = { get };

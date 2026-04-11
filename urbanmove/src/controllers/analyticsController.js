const analyticsService = require('../services/analyticsService');

function get(req, res, next) {
  try {
    const stats = analyticsService.getAnalytics();
    res.json(stats);
  } catch (e) {
    next(e);
  }
}

module.exports = { get };

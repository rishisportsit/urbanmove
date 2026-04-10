const logger = require('../utils/logger');

function notFound(req, res, next) {
  res.status(404).json({ error: 'Not Found' });
}

function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  
  logger.error(`${status} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  if (err.stack) logger.error(err.stack);

  res.status(status).json({ error: message });
}

module.exports = { notFound, errorHandler };

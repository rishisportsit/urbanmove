const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const logger = require('./utils/logger');
const authRoutes = require('./routes/authRoutes');
const mobilityRoutes = require('./routes/mobilityRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();
app.use(cors());
app.use(express.json());

// Morgan with Winston integration
app.use(morgan('combined', {
  stream: { write: (message) => logger.info(message.trim()) }
}));

// Root routes
app.get('/', (req, res) => res.send('UrbanMove API Running 🚀'));
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'urbanmove' }));

app.use('/auth', authRoutes);
app.use('/mobility', mobilityRoutes);
app.use('/analytics', analyticsRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;

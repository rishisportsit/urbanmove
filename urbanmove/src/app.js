const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const mobilityRoutes = require('./routes/mobilityRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/auth', authRoutes);
app.use('/mobility', mobilityRoutes);
app.use('/analytics', analyticsRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;

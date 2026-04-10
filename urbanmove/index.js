const dotenv = require('dotenv');
dotenv.config();
const app = require('./src/app');
const vehicleData = require('./src/services/vehicleDataService');
const worker = require('./src/services/worker');

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`UrbanMove API listening on port ${PORT}`);
});

vehicleData.start();
worker.start();

module.exports = server;

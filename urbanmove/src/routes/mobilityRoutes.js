const express = require('express');
const router = express.Router();
const controller = require('../controllers/mobilityController');
const auth = require('../middleware/authMiddleware');

router.use(auth);
router.post('/trip', controller.createTrip);
router.get('/trips', controller.getAllTrips);
router.get('/user/:id', controller.getTripsByUser);

module.exports = router;

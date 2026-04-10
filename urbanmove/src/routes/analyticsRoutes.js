const express = require('express');
const router = express.Router();
const controller = require('../controllers/analyticsController');
const auth = require('../middleware/authMiddleware');

router.use(auth);
router.get('/', controller.get);

module.exports = router;

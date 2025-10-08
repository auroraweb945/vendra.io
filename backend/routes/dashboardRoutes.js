const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');
const checkSubscription = require('../middleware/checkSubscription');
const dashboardController = require('../controllers/dashboardController');

router.use(authenticate);
router.use(checkSubscription);

router.get('/', dashboardController.getDashboardStats);

module.exports = router;

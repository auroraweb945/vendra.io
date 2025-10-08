// backend/routes/subscribeRoutes.js
const express = require('express');
const router = express.Router();
const {
  initiateSubscription,
  activateSubscription,
  getSubscriptionStatus
} = require('../controllers/subscribeController');
const authMiddleware = require('../middleware/authMiddleware');

// Initiate subscription (user requests)
router.post('/initiate', authMiddleware, initiateSubscription);

// Activate subscription (admin only, you run it manually via Postman for now)
router.post('/activate', authMiddleware, activateSubscription);

// Get subscription status
router.get('/status', authMiddleware, getSubscriptionStatus);

module.exports = router;

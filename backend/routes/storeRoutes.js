const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');
const checkSubscription = require('../middleware/checkSubscription');
const storeController = require('../controllers/storeController');
const { createStoreValidator, updateStoreValidator } = require('../middleware/validators');

router.post('/create', authenticate, checkSubscription, createStoreValidator, storeController.createStore);
router.get('/', authenticate, checkSubscription, storeController.getStore);
router.put('/update', authenticate, checkSubscription, updateStoreValidator, storeController.updateStore);

module.exports = router;

const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');
const checkSubscription = require('../middleware/checkSubscription');
const validateRequest = require('../middleware/validateRequest');
const { createOrderValidator, updateOrderStatusValidator } = require('../middleware/validators');
const {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
  getOrderStats,
} = require('../controllers/orderController');

router.post('/', createOrderValidator, validateRequest, createOrder);


router.use(authenticate);
router.use(checkSubscription);


router.get('/', getOrders);
router.get('/stats', getOrderStats);
router.get('/:id', getOrder);
router.put('/:id/status', updateOrderStatusValidator, validateRequest, updateOrderStatus);

module.exports = router;

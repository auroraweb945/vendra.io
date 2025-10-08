// backend/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');
const checkSubscription = require('../middleware/checkSubscription');

const {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  getLowStockProducts,
  getProductCount,
} = require('../controllers/productController');
const {
  createProductValidator,
  updateProductValidator,
} = require('../middleware/validators');
const validateRequest = require('../middleware/validateRequest');

router.use(authenticate);
router.use(checkSubscription);

router.post('/', createProductValidator, validateRequest, createProduct);
router.get('/', getProducts);
router.get('/count', getProductCount);
router.get('/low-stock', getLowStockProducts);
router.put('/:id', updateProductValidator, validateRequest, updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;

const express = require('express');
const router = express.Router();
const { getStorefrontData } = require('../controllers/storefrontController');

router.get('/:slug', getStorefrontData);

module.exports = router;
 
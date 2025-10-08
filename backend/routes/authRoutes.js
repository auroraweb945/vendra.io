// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { signup, login, forgotPassword, resetPassword } = require('../controllers/authController');
const { signupValidator, loginValidator, forgotPasswordValidator, resetPasswordValidator } = require('../middleware/validators');
const validateRequest = require('../middleware/validateRequest');

router.post('/signup', signupValidator, validateRequest, signup);
router.post('/login', loginValidator, validateRequest, login);
router.post('/forgot-password', forgotPasswordValidator, validateRequest, forgotPassword);
router.post('/reset-password', resetPasswordValidator, validateRequest, resetPassword);

module.exports = router;

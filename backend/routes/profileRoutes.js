const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateName,
  updateEmail,
  updatePassword,
} = require('../controllers/profileController');
const authenticate = require('../middleware/authMiddleware');

const {
  updateNameValidator,
  updateEmailValidator,
  updatePasswordValidator,
} = require('../middleware/validators');
const validateRequest = require('../middleware/validateRequest');

router.get('/', authenticate, getProfile);
router.put('/name', authenticate, updateNameValidator, validateRequest, updateName);
router.put('/email', authenticate, updateEmailValidator, validateRequest, updateEmail);
router.put('/password', authenticate, updatePasswordValidator, validateRequest, updatePassword);

module.exports = router;

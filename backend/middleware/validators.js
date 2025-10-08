const { body } = require('express-validator');

exports.signupValidator = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Email is invalid'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

exports.loginValidator = [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required'),
];

exports.forgotPasswordValidator = [
  body('email').isEmail().withMessage('Valid email required'),
];

exports.resetPasswordValidator = [
  body('token').notEmpty().withMessage('Token is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

// Profile Validators
exports.updateNameValidator = [
  body('name')
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters')
    .trim(),
];

exports.updateEmailValidator = [
  body('email')
    .isEmail().withMessage('Valid email required')
    .normalizeEmail(),
];

exports.updatePasswordValidator = [
  body('oldPassword')
    .notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
    .custom((value, { req }) => {
      if (value === req.body.oldPassword) {
        throw new Error('New password must be different from current password');
      }
      return true;
    }),
];

// === STORE VALIDATORS ===

exports.createStoreValidator = [
  body('name')
    .notEmpty().withMessage('Store name is required')
    .isLength({ min: 2 }).withMessage('Store name must be at least 2 characters'),

  body('slug')
    .notEmpty().withMessage('Store slug is required')
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).withMessage('Slug must be URL-friendly (lowercase, dashes only)'),

  body('description')
    .optional()
    .isLength({ max: 500 }).withMessage('Description must be under 500 characters'),

  body('logo_url')
    .optional()
    .isURL().withMessage('Logo must be a valid URL'),

  body('about')
    .optional()
    .isLength({ max: 1000 }).withMessage('About section must be under 1000 characters'),

  body('background_url')
    .optional()
    .isURL().withMessage('Background image must be a valid URL'),

  body('feedbacks')
    .optional()
    .custom((val) => {
      try {
        const parsed = typeof val === 'string' ? JSON.parse(val) : val;
        if (!Array.isArray(parsed)) throw new Error();
        return true;
      } catch {
        throw new Error('Feedbacks must be a valid JSON array');
      }
    }),
];

exports.updateStoreValidator = [
  body('name')
    .notEmpty().withMessage('Store name is required')
    .isLength({ min: 2 }),

  body('slug')
    .notEmpty().withMessage('Store slug is required')
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).withMessage('Slug must be URL-friendly'),

  body('description')
    .optional()
    .isLength({ max: 500 }),

  body('logo_url')
    .optional()
    .isURL(),

  body('about')
    .optional()
    .isLength({ max: 1000 }).withMessage('About section must be under 1000 characters'),

  body('background_url')
    .optional()
    .isURL().withMessage('Background image must be a valid URL'),

  body('feedbacks')
    .optional()
    .custom((val) => {
      try {
        const parsed = typeof val === 'string' ? JSON.parse(val) : val;
        if (!Array.isArray(parsed)) throw new Error();
        return true;
      } catch {
        throw new Error('Feedbacks must be a valid JSON array');
      }
    }),
];

exports.createProductValidator = [
  body('name').notEmpty().withMessage('Product name is required'),
  body('price').isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  body('image_url').optional().isURL().withMessage('Image URL must be valid'),
];

exports.updateProductValidator = [
  body('name').optional().notEmpty().withMessage('Product name is required'),
  body('price').optional().isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  body('image_url').optional().isURL().withMessage('Image URL must be valid'),
];

// === ORDER VALIDATORS ===

exports.orderValidator = [
  body('customer_name').notEmpty().withMessage('Customer name is required'),
  body('customer_email').isEmail().withMessage('Valid customer email is required'),
  body('location').notEmpty().withMessage('Location is required'),
  body('phone').notEmpty().withMessage('Phone number is required'),
  body('payment_method').equals('cash_on_delivery').withMessage('Only cash on delivery is supported'),
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('total_price').isFloat({ gt: 0 }).withMessage('Total price must be greater than 0'),
];

exports.createOrderValidator = [
  body('customer_name').notEmpty().withMessage('Customer name is required'),
  body('customer_email').isEmail().withMessage('Valid email is required'),
  body('location').notEmpty().withMessage('Location is required'),
  body('phone').notEmpty().withMessage('Phone number is required'),
  body('payment_method').equals('cash_on_delivery').withMessage('Only cash on delivery is supported'),
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('total_price').isFloat({ gt: 0 }).withMessage('Total price must be greater than 0'),
];

exports.updateOrderStatusValidator = [
  body('status').isIn(['pending', 'shipped', 'delivered']).withMessage('Invalid status'),
];

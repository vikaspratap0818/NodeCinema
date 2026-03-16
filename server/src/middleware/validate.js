import { body, validationResult } from 'express-validator';

/**
 * Middleware to check validation results and return errors if any.
 */
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array().map(e => ({ field: e.path, message: e.msg }))
    });
  }
  next();
};

/**
 * Validation rules for user registration.
 */
export const validateRegister = [
  body('username')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters'),
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  handleValidationErrors
];

/**
 * Validation rules for user login.
 */
export const validateLogin = [
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

/**
 * Validation rules for favorite toggle.
 */
export const validateFavorite = [
  body('mediaId')
    .notEmpty()
    .withMessage('mediaId is required'),
  body('title')
    .trim()
    .notEmpty()
    .withMessage('title is required'),
  body('mediaType')
    .isIn(['movie', 'tv', 'custom'])
    .withMessage('mediaType must be movie, tv, or custom'),
  handleValidationErrors
];

/**
 * Validation rules for watch history.
 */
export const validateHistory = [
  body('mediaId')
    .notEmpty()
    .withMessage('mediaId is required'),
  body('title')
    .trim()
    .notEmpty()
    .withMessage('title is required'),
  handleValidationErrors
];

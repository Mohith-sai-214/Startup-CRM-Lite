import express from 'express';
import { body } from 'express-validator';
import {
  register,
  login,
  getProfile,
  updateProfile
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

// 1. Validation rules definition for User Registration
const registerRules = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters long'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Email must be a valid email address')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
];

// 2. Validation rules definition for Login Credentials
const loginRules = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Email must be a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// 3. Validation rules definition for Profile Updates
const updateProfileRules = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters long'),
  body('newPassword')
    .optional()
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long'),
  body('oldPassword')
    .optional()
    .notEmpty()
    .withMessage('Current password is required to set a new password')
];

// Public Authentication endpoints
router.post('/register', validate(registerRules), register);
router.post('/login', validate(loginRules), login);

// Protected user profile management endpoints
router.get('/profile', protect, getProfile);
router.put('/profile', protect, validate(updateProfileRules), updateProfile);

export default router;

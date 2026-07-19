import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

/**
 * Helper utility to sign a JWT token for a specific user.
 * 
 * @param {string} userId - The user's database document identifier.
 * @returns {string} Signed JWT.
 */
export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

/**
 * Register a new user account.
 * Validates unique email check, creates document, and signs token.
 */
export const register = async (req, res, next) => {
  const { name, email, password, role } = req.body;

  try {
    // 1. Verify email uniqueness
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse(res, 'Email already exists', 409);
    }

    // 2. Create database user record
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'user'
    });

    // 3. Issue authentication token
    const token = generateToken(user._id);

    // 4. Return token and user record (toJSON removes password)
    return successResponse(
      res,
      { token, user },
      'Registration successful',
      201
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Authenticate existing credentials.
 * Implements strict response parameters (generic errors) for security.
 */
export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    /**
     * PRODUCTION NOTE:
     * To protect this endpoint against automated brute-force attacks,
     * register the 'express-rate-limit' middleware on this route.
     * Example:
     *   const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 5 });
     *   router.post('/login', loginLimiter, ...);
     */

    // 1. Retrieve user including secret password hash (ensure case-insensitive lookup)
    const cleanEmail = email ? email.toLowerCase().trim() : '';
    const user = await User.findOne({ email: cleanEmail }).select('+password');
    if (!user) {
      // Security standard: Never reveal if email or password was wrong
      return errorResponse(res, 'Invalid credentials', 401);
    }

    // 2. Verify hashed password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    // 3. Confirm active account status
    if (!user.isActive) {
      return errorResponse(res, 'Account is deactivated', 403);
    }

    // 4. Generate session token
    const token = generateToken(user._id);

    return successResponse(res, { token, user }, 'Login successful');
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieves the current session user context profile.
 */
export const getProfile = async (req, res, next) => {
  try {
    // req.user has already been populated and sanitized by the protect middleware
    return successResponse(res, req.user, 'Profile retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Updates the current session user profile.
 * Restricts updates to 'name' and verified password resets.
 */
export const updateProfile = async (req, res, next) => {
  const { name, oldPassword, newPassword } = req.body;

  try {
    // Fetch current user including password to compare
    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    // Handle password updates validation
    if (newPassword) {
      if (!oldPassword) {
        return errorResponse(
          res,
          'Current password is required to set a new password',
          400
        );
      }

      // Verify current password hash match
      const isMatch = await user.comparePassword(oldPassword);
      if (!isMatch) {
        return errorResponse(res, 'Incorrect current password', 401);
      }

      // Assign new password (pre-save middleware triggers automatically on save)
      user.password = newPassword;
    }

    // Restrict updates: Allow changing name only
    if (name !== undefined) {
      user.name = name;
    }

    await user.save();

    return successResponse(res, user, 'Profile updated successfully');
  } catch (error) {
    next(error);
  }
};

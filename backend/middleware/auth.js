import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { errorResponse } from '../utils/apiResponse.js';

/**
 * Express middleware to protect routes.
 * Extracts, decodes, and verifies JWT tokens from Authorization Headers.
 * Attaches verified User instance to the request object.
 */
export const protect = async (req, res, next) => {
  let token;

  // 1. Extract token from Authorization header (Bearer schema)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // If token is missing, reject request with 401
  if (!token) {
    return errorResponse(res, 'No token provided, access denied', 401);
  }

  try {
    // 2. Verify token signature against JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Retrieve user database document (exclude password field)
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return errorResponse(
        res,
        'User belonging to this token no longer exists',
        401
      );
    }

    // 4. Attach verified user context to Express request object
    req.user = user;
    next();
  } catch (error) {
    // 5. Format explicit security error responses based on JWT exception subtypes
    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, 'Token has expired, please login again', 401);
    }
    
    return errorResponse(res, 'Token is invalid', 401);
  }
};

/**
 * Centralized global Express error handler middleware.
 * Standardizes MongoDB/Mongoose validation, Cast, Unique constraint, and JWT token errors.
 */

/**
 * Centralized global error handling middleware.
 * 
 * @param {Object} err - Error instance.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next function.
 */
export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Server error';
  let errors = null;

  // 1. Mongoose ValidationError -> HTTP 400
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
    errors = {};
    Object.keys(err.errors).forEach((key) => {
      errors[key] = err.errors[key].message;
    });
  }

  // 2. Mongoose CastError (Invalid ObjectId) -> HTTP 404
  else if (err.name === 'CastError') {
    statusCode = 404;
    message = 'Resource not found';
  }

  // 3. MongoDB duplicate key (code 11000) -> HTTP 409
  else if (err.code === 11000) {
    statusCode = 409;
    message = 'Email already exists';
  }

  // 4. JWT Validation Errors -> HTTP 401
  else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token. Please log in again.';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Your token has expired. Please log in again.';
  }

  // Build the error response payload
  const errorResponsePayload = {
    success: false,
    message,
    ...(errors && { errors })
  };

  // Environment-dependent stack trace attachment
  if (process.env.NODE_ENV === 'development') {
    errorResponsePayload.stack = err.stack;
    console.error('ErrorHandler Caught Error:', err);
  } else {
    console.error(`ErrorHandler Caught Error: ${message}`);
  }

  return res.status(statusCode).json(errorResponsePayload);
};

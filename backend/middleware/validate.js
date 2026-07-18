import { validationResult } from 'express-validator';

/**
 * Express middleware utility to run schemas validations and collect express-validator diagnostics.
 * If validation fails, responds with a 400 status code and structured errors list.
 * 
 * @param {Array} validations - Array of express-validator verification check configurations.
 * @returns {Function} Express middleware function.
 */
export const validate = (validations) => {
  return async (req, res, next) => {
    // 1. Run all request checks concurrently
    await Promise.all(validations.map((validation) => validation.run(req)));

    // 2. Extract verification diagnostics
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    // 3. Reformat failures into structured [{ field, message }] list
    const formattedErrors = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg
    }));

    // 4. Return formatted 400 Bad Request
    return res.status(400).json({
      success: false,
      errors: formattedErrors
    });
  };
};

/**
 * Utility functions for consistent and standardized Express API responses.
 */

/**
 * Sends a standard success response.
 * @param {Object} res - Express response object.
 * @param {any} data - Payload data.
 * @param {string} message - Operation success message.
 * @param {number} [statusCode=200] - HTTP status code.
 */
export const successResponse = (res, data, message, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

/**
 * Sends a standard error response.
 * @param {Object} res - Express response object.
 * @param {string} message - Error message detail.
 * @param {number} [statusCode=500] - HTTP status code.
 * @param {any} [errors=null] - Granular validation error messages.
 */
export const errorResponse = (res, message, statusCode = 500, errors = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors
  });
};

/**
 * Sends a standardized paginated response.
 * @param {Object} res - Express response object.
 * @param {Array} data - Array of paginated data.
 * @param {number} total - Total records in the database query.
 * @param {number} page - Current page index.
 * @param {number} limit - Items per page limit.
 */
export const paginatedResponse = (res, data, total, page, limit) => {
  const totalPages = Math.ceil(total / limit) || 1;
  return res.status(200).json({
    success: true,
    data,
    pagination: {
      total,
      page,
      limit,
      pages: totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  });
};

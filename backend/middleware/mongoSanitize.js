/**
 * Custom MongoDB query injection sanitizer middleware.
 * Recursively deletes any keys starting with '$' or containing '.' from target objects.
 * Performs in-place mutation to ensure compatibility with Express 5 read-only getters.
 * 
 * @param {Object} obj - The target object to sanitize.
 */
const sanitizeInPlace = (obj) => {
  if (obj && typeof obj === 'object') {
    Object.keys(obj).forEach((key) => {
      // MongoDB query operator keys start with '$' or nested keys contain '.'
      if (key.startsWith('$') || key.includes('.')) {
        delete obj[key];
      } else {
        sanitizeInPlace(obj[key]);
      }
    });
  }
};

/**
 * Express middleware factory to sanitize body, query parameters, and route parameters.
 * Returns an Express middleware function.
 */
export const mongoSanitize = () => {
  return (req, res, next) => {
    if (req.body) sanitizeInPlace(req.body);
    if (req.query) sanitizeInPlace(req.query);
    if (req.params) sanitizeInPlace(req.params);
    next();
  };
};

export default mongoSanitize;

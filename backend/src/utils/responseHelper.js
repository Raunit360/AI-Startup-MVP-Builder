/**
 * Standardized API Response Utilities
 */

/**
 * Sends a standardized success response
 * @param {import('express').Response} res - Express response object
 * @param {any} data - Response payload data
 * @param {string} message - Success message
 * @param {number} statusCode - HTTP status code (default: 200)
 */
const successResponse = (res, data = null, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

/**
 * Sends a standardized error response
 * @param {import('express').Response} res - Express response object
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code (default: 500)
 * @param {any} details - Optional detailed error information
 */
const errorResponse = (res, message = 'An error occurred', statusCode = 500, details = null) => {
  const payload = {
    success: false,
    error: {
      message
    }
  };

  if (details !== null && details !== undefined) {
    payload.error.details = details;
  }

  return res.status(statusCode).json(payload);
};

module.exports = {
  successResponse,
  errorResponse
};

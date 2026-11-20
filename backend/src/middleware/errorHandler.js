/**
 * Centralized error handler middleware for Express
 */
const errorHandler = (err, req, res, next) => { // eslint-disable-line no-unused-vars
  let statusCode = err.statusCode || 500;
  let code = err.code || 'INTERNAL_SERVER_ERROR';
  let message = err.message || 'An unexpected error occurred';
  let details = err.details || null;

  // 1. Mongoose ValidationError (e.g. required field missing or schema constraint violated)
  if (err.name === 'ValidationError') {
    statusCode = 400;
    code = 'MONGOOSE_VALIDATION_ERROR';
    message = 'Database validation failed';
    details = Object.values(err.errors || {}).map((item) => ({
      field: item.path,
      message: item.message,
      kind: item.kind
    }));
  }

  // 2. Mongoose CastError (e.g. invalid ObjectId provided in params)
  if (err.name === 'CastError') {
    statusCode = 400;
    code = 'INVALID_ID_FORMAT';
    message = `Invalid format for resource identifier '${err.value}'`;
    details = {
      field: err.path,
      value: err.value,
      expectedType: err.kind
    };
  }

  // 3. MongoDB Duplicate Key Error (E11000)
  if (err.code === 11000) {
    statusCode = 409;
    code = 'DUPLICATE_RESOURCE_ERROR';
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `A resource with that ${field} already exists`;
    details = {
      duplicateField: field,
      duplicateValue: err.keyValue ? err.keyValue[field] : undefined
    };
  }

  // 4. Rate limiter error (express-rate-limit)
  if (err.status === 429 || statusCode === 429) {
    statusCode = 429;
    code = 'RATE_LIMIT_EXCEEDED';
    message = err.message || 'Too many requests, please try again later.';
  }

  // 5. Gemini / AI specific errors
  if (
    err.code === 'GEMINI_API_ERROR' ||
    err.code === 'GEMINI_INIT_ERROR' ||
    err.code === 'GEMINI_EXTRACTION_ERROR' ||
    err.code === 'GEMINI_EMPTY_RESPONSE' ||
    err.code === 'JSON_PARSE_ERROR' ||
    err.code === 'PLAN_VALIDATION_ERROR' ||
    err.code === 'CONFIG_ERROR'
  ) {
    statusCode = err.statusCode || 502;
    code = err.code;
    message = err.message;
  }

  // Log error details in non-test environments
  if (process.env.NODE_ENV !== 'test') {
    console.error(`[Error Handler] ${req.method} ${req.originalUrl} - ${statusCode} [${code}]:`, message);
    if (process.env.NODE_ENV === 'development' && err.stack) {
      console.error(err.stack);
    }
  }

  const errorPayload = {
    success: false,
    error: {
      message,
      code
    }
  };

  if (details !== null && details !== undefined) {
    errorPayload.error.details = details;
  }

  if (process.env.NODE_ENV === 'development' && err.stack) {
    errorPayload.error.stack = err.stack;
  }

  return res.status(statusCode).json(errorPayload);
};

module.exports = errorHandler;

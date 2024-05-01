// utils/errorHandler.js
const logger = require('./logger');


/**
 * Custom Error classes
 */
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
  }
}

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

/**
 * Handles errors and sends appropriate responses.
 * @param {Error} err - The error object.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware function.
 */
function errorHandler(err, req, res, next) {
  let status = 500;
  let message = 'Internal Server Error';

  // Customize the error response based on the error type
  switch (true) {
    case err instanceof ValidationError:
      status = 400;
      message = err.message;
      break;
    case err instanceof NotFoundError:
      status = 404;
      message = err.message;
      break;
    case err instanceof UnauthorizedError:
      status = 401;
      message = 'Unauthorized';
      break;
    default:
      logger.error('Unhandled error:', err);
  }

  res.status(status).json({ error: message });
}

/**
 * Handles errors and logs them.
 * @param {Error} error - The error object.
 * @param {string} message - A descriptive error message.
 */
function handleError(error, message) {
  logger.error(`${message}: ${error.message}`);
  logger.error(error);

  // Additional error handling logic, if needed
}

module.exports = {
  errorHandler,
  handleError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
};
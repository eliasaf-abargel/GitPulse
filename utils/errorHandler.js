// utils/errorHandler.js
const logger = require('./logger');

/**
 * Custom Error classes
 */
class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = 'CustomError';
    this.statusCode = statusCode;
  }
}

class ValidationError extends CustomError {
  constructor(message) {
    super(message, 400);
    this.name = 'ValidationError';
  }
}

class NotFoundError extends CustomError {
  constructor(message) {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

class UnauthorizedError extends CustomError {
  constructor(message) {
    super(message, 401);
    this.name = 'UnauthorizedError';
  }
}

class InternalServerError extends CustomError {
  constructor(message) {
    super(message, 500);
    this.name = 'InternalServerError';
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
  let status = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Log the error
  logger.error('Error:', err);

  // Send the error response
  res.status(status).json({ error: message });
}

/**
 * Handles errors and logs them.
 * @param {Error} error - The error object.
 * @param {string} message - A descriptive error message.
 */
function handleError(error, message) {
  logger.error(`${message}: ${error.message}`);
  logger.error('Error details:', error);

  // Additional error handling logic, if needed
}

module.exports = {
  CustomError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  InternalServerError,
  errorHandler,
  handleError,
};
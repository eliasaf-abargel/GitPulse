import { Request, Response, NextFunction } from "express";
import logger from "./logger";

class CustomError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "CustomError";
    this.statusCode = statusCode;
  }
}

class ValidationError extends CustomError {
  constructor(message: string) {
    super(message, 400);
    this.name = "ValidationError";
  }
}

class NotFoundError extends CustomError {
  constructor(message: string) {
    super(message, 404);
    this.name = "NotFoundError";
  }
}

class UnauthorizedError extends CustomError {
  constructor(message: string) {
    super(message, 401);
    this.name = "UnauthorizedError";
  }
}

class InternalServerError extends CustomError {
  constructor(message: string) {
    super(message, 500);
    this.name = "InternalServerError";
  }
}

const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const status = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  logger.error("Error:", err);
  res.status(status).json({ error: message });
};

const handleError = (error: Error, message: string): void => {
  logger.error(`${message}: ${error.message}`);
  logger.error("Error details:", error);

  // Additional error handling logic, if needed
};

export {
  CustomError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  InternalServerError,
  errorHandler,
  handleError,
};

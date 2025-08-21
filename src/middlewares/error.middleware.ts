import { Request, Response, NextFunction } from 'express';
import { ErrorResponse } from '@/types/common.types';
import { createErrorResponse } from '@/utils/response';
import logger from '@/utils/logger';
import config from '@/config/config';

/**
 * Global error handling middleware
 */
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.error('Error caught by global handler:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  });

  let statusCode = 500;
  let response: ErrorResponse = {
    success: false,
    message: 'Internal server error',
    error: 'INTERNAL_SERVER_ERROR',
  };

  // Handle specific error types
  if (error.name === 'ValidationError') {
    statusCode = 400;
    response = {
      success: false,
      message: 'Validation failed',
      error: 'VALIDATION_ERROR',
    };
  }

  if (error.name === 'UnauthorizedError') {
    statusCode = 401;
    response = {
      success: false,
      message: 'Unauthorized access',
      error: 'UNAUTHORIZED',
    };
  }

  if (error.name === 'ForbiddenError') {
    statusCode = 403;
    response = {
      success: false,
      message: 'Access forbidden',
      error: 'FORBIDDEN',
    };
  }

  if (error.name === 'NotFoundError') {
    statusCode = 404;
    response = {
      success: false,
      message: 'Resource not found',
      error: 'NOT_FOUND',
    };
  }

  // Handle PostgreSQL errors
  if (error.name === 'QueryFailedError' || (error as any).code) {
    const pgError = error as any;
    
    if (pgError.code === '23505') { // Unique constraint violation
      statusCode = 409;
      response = {
        success: false,
        message: 'Resource already exists',
        error: 'DUPLICATE_ENTRY',
      };
    } else if (pgError.code === '23503') { // Foreign key constraint violation
      statusCode = 400;
      response = {
        success: false,
        message: 'Invalid reference',
        error: 'FOREIGN_KEY_CONSTRAINT',
      };
    } else {
      statusCode = 500;
      response = {
        success: false,
        message: 'Database error',
        error: 'DATABASE_ERROR',
      };
    }
  }

  // Include stack trace in development
  if (config.server.nodeEnv === 'development') {
    response.stack = error.stack;
  }

  res.status(statusCode).json(response);
};

/**
 * 404 Not Found handler
 */
export const notFoundHandler = (
  req: Request,
  res: Response
): void => {
  const response = createErrorResponse(
    `Route ${req.method} ${req.path} not found`,
    'NOT_FOUND'
  );
  
  res.status(404).json(response);
};

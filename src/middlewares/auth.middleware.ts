import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '@/types/common.types';
import { extractToken, verifyAccessToken } from '@/utils/auth';
import { createErrorResponse } from '@/utils/response';
import logger from '@/utils/logger';

/**
 * Authentication middleware - verifies JWT token
 */
export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = extractToken(req.headers.authorization);

    if (!token) {
      res.status(401).json(createErrorResponse('Access token is required'));
      return;
    }

    const decoded = verifyAccessToken(token);
    req.user = decoded;

    next();
  } catch (error) {
    logger.error('Authentication error:', error);

    if (error instanceof Error) {
      if (error.name === 'TokenExpiredError') {
        res.status(401).json(createErrorResponse('Token expired'));
        return;
      }
      if (error.name === 'JsonWebTokenError') {
        res.status(401).json(createErrorResponse('Invalid token'));
        return;
      }
    }

    res.status(401).json(createErrorResponse('Authentication failed'));
  }
};

/**
 * Authorization middleware - checks user roles
 */
export const authorize = (...roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json(createErrorResponse('Authentication required'));
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json(createErrorResponse('Insufficient permissions'));
      return;
    }

    next();
  };
};

/**
 * Optional authentication middleware - doesn't fail if no token
 */
export const optionalAuth = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = extractToken(req.headers.authorization);

    if (token) {
      const decoded = verifyAccessToken(token);
      req.user = decoded;
    }

    next();
  } catch (error) {
    // Don't fail, just continue without user
    next();
  }
};

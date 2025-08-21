import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { createErrorResponse } from '@/utils/response';
import { ValidationError } from '@/types/common.types';

/**
 * Validation middleware factory
 */
export const validate = (schema: Joi.ObjectSchema, target: 'body' | 'params' | 'query' = 'body') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const dataToValidate = target === 'body' ? req.body : 
                          target === 'params' ? req.params : 
                          req.query;

    const { error, value } = schema.validate(dataToValidate, {
      abortEarly: false,
      allowUnknown: false,
      stripUnknown: true,
    });

    if (error) {
      const validationErrors: ValidationError[] = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      const response = createErrorResponse('Validation failed');
      res.status(400).json({
        ...response,
        validationErrors,
      });
      return;
    }

    // Replace the original data with validated and sanitized data
    if (target === 'body') req.body = value;
    else if (target === 'params') req.params = value;
    else req.query = value;

    next();
  };
};

/**
 * Sanitize input by removing potentially harmful characters
 */
export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  const sanitize = (obj: any): any => {
    if (typeof obj === 'string') {
      return obj.trim()
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
        .replace(/javascript:/gi, '') // Remove javascript: protocol
        .replace(/on\w+\s*=/gi, ''); // Remove event handlers
    }
    
    if (Array.isArray(obj)) {
      return obj.map(sanitize);
    }
    
    if (obj && typeof obj === 'object') {
      const sanitized: any = {};
      Object.keys(obj).forEach(key => {
        sanitized[key] = sanitize(obj[key]);
      });
      return sanitized;
    }
    
    return obj;
  };

  req.body = sanitize(req.body);
  req.query = sanitize(req.query);
  req.params = sanitize(req.params);
  
  next();
};

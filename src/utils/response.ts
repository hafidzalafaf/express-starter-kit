import { ApiResponse, PaginatedResponse, ValidationError } from '@/types/common.types';

/**
 * Create a standardized success response
 */
export const createSuccessResponse = <T>(
  data: T,
  message: string = 'Success'
): ApiResponse<T> => ({
  success: true,
  data,
  message,
});

/**
 * Create a standardized error response
 */
export const createErrorResponse = (
  message: string,
  error?: string
): ApiResponse => ({
  success: false,
  message,
  error,
});

/**
 * Create a standardized paginated response
 */
export const createPaginatedResponse = <T>(
  data: T[],
  page: number,
  limit: number,
  total: number,
  message: string = 'Success'
): PaginatedResponse<T> => ({
  success: true,
  data,
  message,
  pagination: {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  },
});

/**
 * Create validation error response
 */
export const createValidationErrorResponse = (
  validationErrors: ValidationError[]
): ApiResponse => ({
  success: false,
  message: 'Validation failed',
  error: 'VALIDATION_ERROR',
});

/**
 * Calculate pagination offset
 */
export const calculateOffset = (page: number, limit: number): number => {
  return (page - 1) * limit;
};

/**
 * Validate pagination parameters
 */
export const validatePagination = (page?: string, limit?: string) => {
  const parsedPage = page ? parseInt(page, 10) : 1;
  const parsedLimit = limit ? parseInt(limit, 10) : 10;

  const validPage = !isNaN(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const validLimit = !isNaN(parsedLimit) && parsedLimit > 0 && parsedLimit <= 100 
    ? parsedLimit : 10;

  return { page: validPage, limit: validLimit };
};

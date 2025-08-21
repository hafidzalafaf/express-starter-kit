import Joi from 'joi';

export const createTodoSchema = Joi.object({
  title: Joi.string()
    .min(1)
    .max(255)
    .required()
    .messages({
      'string.min': 'Title cannot be empty',
      'string.max': 'Title must not exceed 255 characters',
      'any.required': 'Title is required',
    }),
  description: Joi.string()
    .max(1000)
    .allow('', null)
    .messages({
      'string.max': 'Description must not exceed 1000 characters',
    }),
});

export const updateTodoSchema = Joi.object({
  title: Joi.string()
    .min(1)
    .max(255)
    .messages({
      'string.min': 'Title cannot be empty',
      'string.max': 'Title must not exceed 255 characters',
    }),
  description: Joi.string()
    .max(1000)
    .allow('', null)
    .messages({
      'string.max': 'Description must not exceed 1000 characters',
    }),
  status: Joi.string()
    .valid('pending', 'done')
    .messages({
      'any.only': 'Status must be either pending or done',
    }),
}).min(1).messages({
  'object.min': 'At least one field must be provided for update',
});

export const todoIdSchema = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'ID must be a number',
      'number.integer': 'ID must be an integer',
      'number.positive': 'ID must be positive',
      'any.required': 'ID is required',
    }),
});

export const todoQuerySchema = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .default(1)
    .messages({
      'number.base': 'Page must be a number',
      'number.integer': 'Page must be an integer',
      'number.min': 'Page must be at least 1',
    }),
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(10)
    .messages({
      'number.base': 'Limit must be a number',
      'number.integer': 'Limit must be an integer',
      'number.min': 'Limit must be at least 1',
      'number.max': 'Limit must not exceed 100',
    }),
  status: Joi.string()
    .valid('pending', 'done')
    .messages({
      'any.only': 'Status must be either pending or done',
    }),
  search: Joi.string()
    .max(255)
    .messages({
      'string.max': 'Search query must not exceed 255 characters',
    }),
});

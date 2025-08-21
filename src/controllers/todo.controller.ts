import { Response, NextFunction } from 'express';
import { TodoService } from '@/services/todo.service';
import { CreateTodoRequest, UpdateTodoRequest } from '@/types/todo.types';
import { AuthenticatedRequest } from '@/types/common.types';
import { createSuccessResponse, createErrorResponse, createPaginatedResponse, validatePagination } from '@/utils/response';

export class TodoController {
  /**
   * Create a new todo
   */
  static async createTodo(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json(createErrorResponse('Authentication required'));
        return;
      }

      const todoData: CreateTodoRequest = req.body;
      const todo = await TodoService.createTodo(todoData, req.user.userId);
      
      res.status(201).json(
        createSuccessResponse(todo, 'Todo created successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get user's todos with pagination and filtering
   */
  static async getTodos(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json(createErrorResponse('Authentication required'));
        return;
      }

      const { page: pageParam, limit: limitParam, status, search } = req.query;
      const { page, limit } = validatePagination(pageParam as string, limitParam as string);

      const result = await TodoService.getUserTodos(
        req.user.userId,
        page,
        limit,
        status as string,
        search as string
      );
      
      res.status(200).json(
        createPaginatedResponse(
          result.todos,
          page,
          limit,
          result.total,
          'Todos retrieved successfully'
        )
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get todo by ID
   */
  static async getTodoById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json(createErrorResponse('Authentication required'));
        return;
      }

      const { id } = req.params;
      if (!id) {
        res.status(400).json(createErrorResponse('Todo ID is required'));
        return;
      }
      const todo = await TodoService.getTodoById(parseInt(id), req.user.userId);
      
      res.status(200).json(
        createSuccessResponse(todo, 'Todo retrieved successfully')
      );
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json(createErrorResponse(error.message));
        return;
      }
      next(error);
    }
  }

  /**
   * Update todo
   */
  static async updateTodo(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json(createErrorResponse('Authentication required'));
        return;
      }

      const { id } = req.params;
      if (!id) {
        res.status(400).json(createErrorResponse('Todo ID is required'));
        return;
      }
      const updates: UpdateTodoRequest = req.body;
      
      const todo = await TodoService.updateTodo(parseInt(id), req.user.userId, updates);
      
      res.status(200).json(
        createSuccessResponse(todo, 'Todo updated successfully')
      );
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json(createErrorResponse(error.message));
        return;
      }
      next(error);
    }
  }

  /**
   * Delete todo
   */
  static async deleteTodo(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json(createErrorResponse('Authentication required'));
        return;
      }

      const { id } = req.params;
      if (!id) {
        res.status(400).json(createErrorResponse('Todo ID is required'));
        return;
      }
      await TodoService.deleteTodo(parseInt(id), req.user.userId);
      
      res.status(200).json(
        createSuccessResponse(null, 'Todo deleted successfully')
      );
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json(createErrorResponse(error.message));
        return;
      }
      next(error);
    }
  }

  // Admin endpoints

  /**
   * Admin: Get all todos with pagination and filtering
   */
  static async getAllTodos(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page: pageParam, limit: limitParam, status, search } = req.query;
      const { page, limit } = validatePagination(pageParam as string, limitParam as string);

      const result = await TodoService.getAllTodos(page, limit, status as string, search as string);
      
      res.status(200).json(
        createPaginatedResponse(
          result.todos,
          page,
          limit,
          result.total,
          'All todos retrieved successfully'
        )
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Admin: Get any todo by ID
   */
  static async getAnyTodoById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json(createErrorResponse('Todo ID is required'));
        return;
      }
      const todo = await TodoService.getAnyTodoById(parseInt(id));
      
      res.status(200).json(
        createSuccessResponse(todo, 'Todo retrieved successfully')
      );
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json(createErrorResponse(error.message));
        return;
      }
      next(error);
    }
  }

  /**
   * Admin: Update any todo
   */
  static async updateAnyTodo(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json(createErrorResponse('Todo ID is required'));
        return;
      }
      const updates: UpdateTodoRequest = req.body;
      
      const todo = await TodoService.updateAnyTodo(parseInt(id), updates);
      
      res.status(200).json(
        createSuccessResponse(todo, 'Todo updated successfully')
      );
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json(createErrorResponse(error.message));
        return;
      }
      next(error);
    }
  }

  /**
   * Admin: Delete any todo
   */
  static async deleteAnyTodo(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json(createErrorResponse('Todo ID is required'));
        return;
      }
      await TodoService.deleteAnyTodo(parseInt(id));
      
      res.status(200).json(
        createSuccessResponse(null, 'Todo deleted successfully')
      );
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json(createErrorResponse(error.message));
        return;
      }
      next(error);
    }
  }
}

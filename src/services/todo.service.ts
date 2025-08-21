import { TodoModel } from '@/models/todo.model';
import { CreateTodoRequest, UpdateTodoRequest, TodoResponse } from '@/types/todo.types';
import logger from '@/utils/logger';

export class TodoService {
  /**
   * Create a new todo
   */
  static async createTodo(todoData: CreateTodoRequest, userId: number): Promise<TodoResponse> {
    const todo = await TodoModel.create(todoData, userId);
    logger.info(`Todo created successfully: ${todo.id} by user ${userId}`);
    return todo;
  }

  /**
   * Get user's todos with pagination and filtering
   */
  static async getUserTodos(
    userId: number,
    page: number = 1,
    limit: number = 10,
    status?: string,
    search?: string
  ): Promise<{ todos: TodoResponse[]; total: number }> {
    return TodoModel.findByUserId(userId, page, limit, status, search);
  }

  /**
   * Get todo by ID (user can only access their own todos)
   */
  static async getTodoById(id: number, userId: number): Promise<TodoResponse> {
    const todo = await TodoModel.findByIdAndUserId(id, userId);
    if (!todo) {
      throw new Error('Todo not found');
    }
    return todo;
  }

  /**
   * Update todo (user can only update their own todos)
   */
  static async updateTodo(
    id: number,
    userId: number,
    updates: UpdateTodoRequest
  ): Promise<TodoResponse> {
    const todo = await TodoModel.update(id, userId, updates);
    if (!todo) {
      throw new Error('Todo not found or no changes made');
    }

    logger.info(`Todo updated successfully: ${id} by user ${userId}`);
    return todo;
  }

  /**
   * Delete todo (user can only delete their own todos)
   */
  static async deleteTodo(id: number, userId: number): Promise<void> {
    const deleted = await TodoModel.delete(id, userId);
    if (!deleted) {
      throw new Error('Todo not found');
    }

    logger.info(`Todo deleted successfully: ${id} by user ${userId}`);
  }

  /**
   * Admin: Get all todos with pagination and filtering
   */
  static async getAllTodos(
    page: number = 1,
    limit: number = 10,
    status?: string,
    search?: string
  ): Promise<{ todos: TodoResponse[]; total: number }> {
    return TodoModel.findAll(page, limit, status, search);
  }

  /**
   * Admin: Get any todo by ID
   */
  static async getAnyTodoById(id: number): Promise<TodoResponse> {
    const todo = await TodoModel.findById(id);
    if (!todo) {
      throw new Error('Todo not found');
    }
    return todo;
  }

  /**
   * Admin: Update any todo
   */
  static async updateAnyTodo(id: number, updates: UpdateTodoRequest): Promise<TodoResponse> {
    const todo = await TodoModel.adminUpdate(id, updates);
    if (!todo) {
      throw new Error('Todo not found or no changes made');
    }

    logger.info(`Todo updated by admin: ${id}`);
    return todo;
  }

  /**
   * Admin: Delete any todo
   */
  static async deleteAnyTodo(id: number): Promise<void> {
    const deleted = await TodoModel.adminDelete(id);
    if (!deleted) {
      throw new Error('Todo not found');
    }

    logger.info(`Todo deleted by admin: ${id}`);
  }
}

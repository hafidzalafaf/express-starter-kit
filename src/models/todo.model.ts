import { pool } from '@/config/database';
import { Todo, CreateTodoRequest, UpdateTodoRequest, TodoResponse } from '@/types/todo.types';

export class TodoModel {
  /**
   * Create a new todo
   */
  static async create(todoData: CreateTodoRequest, userId: number): Promise<TodoResponse> {
    const query = `
      INSERT INTO todos (title, description, user_id)
      VALUES ($1, $2, $3)
      RETURNING id, title, description, status, user_id, created_at, updated_at
    `;

    const values = [todoData.title, todoData.description || null, userId];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Find todo by ID and user ID
   */
  static async findByIdAndUserId(id: number, userId: number): Promise<TodoResponse | null> {
    const query = `
      SELECT id, title, description, status, user_id, created_at, updated_at 
      FROM todos 
      WHERE id = $1 AND user_id = $2
    `;
    const result = await pool.query(query, [id, userId]);
    return result.rows[0] || null;
  }

  /**
   * Find todo by ID (admin can access any todo)
   */
  static async findById(id: number): Promise<TodoResponse | null> {
    const query = `
      SELECT id, title, description, status, user_id, created_at, updated_at 
      FROM todos 
      WHERE id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  /**
   * Get user's todos with pagination and filtering
   */
  static async findByUserId(
    userId: number,
    page: number = 1,
    limit: number = 10,
    status?: string,
    search?: string
  ): Promise<{ todos: TodoResponse[]; total: number }> {
    const offset = (page - 1) * limit;
    let conditions = 'WHERE user_id = $1';
    let values: any[] = [userId];
    let paramCount = 1;

    // Add status filter
    if (status) {
      paramCount++;
      conditions += ` AND status = $${paramCount}`;
      values.push(status);
    }

    // Add search filter
    if (search) {
      paramCount++;
      conditions += ` AND (title ILIKE $${paramCount} OR description ILIKE $${paramCount})`;
      values.push(`%${search}%`);
    }

    // Count total records
    const countQuery = `SELECT COUNT(*) FROM todos ${conditions}`;
    const countResult = await pool.query(countQuery, values);
    const total = parseInt(countResult.rows[0].count);

    // Get paginated results
    const query = `
      SELECT id, title, description, status, user_id, created_at, updated_at 
      FROM todos 
      ${conditions}
      ORDER BY created_at DESC 
      LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
    `;

    values.push(limit, offset);
    const result = await pool.query(query, values);

    return {
      todos: result.rows,
      total,
    };
  }

  /**
   * Get all todos (admin only)
   */
  static async findAll(
    page: number = 1,
    limit: number = 10,
    status?: string,
    search?: string
  ): Promise<{ todos: TodoResponse[]; total: number }> {
    const offset = (page - 1) * limit;
    let conditions = '';
    let values: any[] = [];
    let paramCount = 0;

    // Add status filter
    if (status) {
      paramCount++;
      conditions += `${conditions ? ' AND' : 'WHERE'} status = $${paramCount}`;
      values.push(status);
    }

    // Add search filter
    if (search) {
      paramCount++;
      conditions += `${conditions ? ' AND' : 'WHERE'} (title ILIKE $${paramCount} OR description ILIKE $${paramCount})`;
      values.push(`%${search}%`);
    }

    // Count total records
    const countQuery = `SELECT COUNT(*) FROM todos ${conditions}`;
    const countResult = await pool.query(countQuery, values);
    const total = parseInt(countResult.rows[0].count);

    // Get paginated results
    const query = `
      SELECT t.id, t.title, t.description, t.status, t.user_id, t.created_at, t.updated_at,
             u.username, u.email
      FROM todos t
      JOIN users u ON t.user_id = u.id
      ${conditions}
      ORDER BY t.created_at DESC 
      LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
    `;

    values.push(limit, offset);
    const result = await pool.query(query, values);

    return {
      todos: result.rows,
      total,
    };
  }

  /**
   * Update todo
   */
  static async update(
    id: number,
    userId: number,
    updates: UpdateTodoRequest
  ): Promise<TodoResponse | null> {
    const setClause = [];
    const values = [];
    let paramCount = 0;

    if (updates.title !== undefined) {
      paramCount++;
      setClause.push(`title = $${paramCount}`);
      values.push(updates.title);
    }

    if (updates.description !== undefined) {
      paramCount++;
      setClause.push(`description = $${paramCount}`);
      values.push(updates.description);
    }

    if (updates.status !== undefined) {
      paramCount++;
      setClause.push(`status = $${paramCount}`);
      values.push(updates.status);
    }

    if (setClause.length === 0) {
      return null;
    }

    paramCount++;
    values.push(id);
    paramCount++;
    values.push(userId);

    const query = `
      UPDATE todos 
      SET ${setClause.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramCount - 1} AND user_id = $${paramCount}
      RETURNING id, title, description, status, user_id, created_at, updated_at
    `;

    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }

  /**
   * Admin update todo (can update any todo)
   */
  static async adminUpdate(id: number, updates: UpdateTodoRequest): Promise<TodoResponse | null> {
    const setClause = [];
    const values = [];
    let paramCount = 0;

    if (updates.title !== undefined) {
      paramCount++;
      setClause.push(`title = $${paramCount}`);
      values.push(updates.title);
    }

    if (updates.description !== undefined) {
      paramCount++;
      setClause.push(`description = $${paramCount}`);
      values.push(updates.description);
    }

    if (updates.status !== undefined) {
      paramCount++;
      setClause.push(`status = $${paramCount}`);
      values.push(updates.status);
    }

    if (setClause.length === 0) {
      return null;
    }

    paramCount++;
    values.push(id);

    const query = `
      UPDATE todos 
      SET ${setClause.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramCount}
      RETURNING id, title, description, status, user_id, created_at, updated_at
    `;

    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }

  /**
   * Delete todo
   */
  static async delete(id: number, userId: number): Promise<boolean> {
    const query = 'DELETE FROM todos WHERE id = $1 AND user_id = $2';
    const result = await pool.query(query, [id, userId]);
    return result.rowCount !== null && result.rowCount > 0;
  }

  /**
   * Admin delete todo (can delete any todo)
   */
  static async adminDelete(id: number): Promise<boolean> {
    const query = 'DELETE FROM todos WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rowCount !== null && result.rowCount > 0;
  }
}

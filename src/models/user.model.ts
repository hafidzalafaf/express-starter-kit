import { pool } from '@/config/database';
import { User, UserResponse, CreateUserRequest } from '@/types/user.types';

export class UserModel {
  /**
   * Create a new user
   */
  static async create(userData: CreateUserRequest): Promise<UserResponse> {
    const query = `
      INSERT INTO users (username, email, password, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id, username, email, role, created_at, updated_at
    `;
    
    const values = [
      userData.username,
      userData.email,
      userData.password,
      userData.role || 'user',
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Find user by email
   */
  static async findByEmail(email: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0] || null;
  }

  /**
   * Find user by ID
   */
  static async findById(id: number): Promise<UserResponse | null> {
    const query = `
      SELECT id, username, email, role, created_at, updated_at 
      FROM users WHERE id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  /**
   * Find user by username
   */
  static async findByUsername(username: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE username = $1';
    const result = await pool.query(query, [username]);
    return result.rows[0] || null;
  }

  /**
   * Update user refresh token
   */
  static async updateRefreshToken(userId: number, refreshToken: string | null): Promise<void> {
    const query = 'UPDATE users SET refresh_token = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2';
    await pool.query(query, [refreshToken, userId]);
  }

  /**
   * Find user by refresh token
   */
  static async findByRefreshToken(refreshToken: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE refresh_token = $1';
    const result = await pool.query(query, [refreshToken]);
    return result.rows[0] || null;
  }

  /**
   * Update user password
   */
  static async updatePassword(userId: number, password: string): Promise<void> {
    const query = 'UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2';
    await pool.query(query, [password, userId]);
  }

  /**
   * Delete user
   */
  static async delete(userId: number): Promise<void> {
    const query = 'DELETE FROM users WHERE id = $1';
    await pool.query(query, [userId]);
  }

  /**
   * Get all users (admin only)
   */
  static async findAll(page: number = 1, limit: number = 10): Promise<{ users: UserResponse[]; total: number }> {
    const offset = (page - 1) * limit;
    
    const countQuery = 'SELECT COUNT(*) FROM users';
    const countResult = await pool.query(countQuery);
    const total = parseInt(countResult.rows[0].count);

    const query = `
      SELECT id, username, email, role, created_at, updated_at 
      FROM users 
      ORDER BY created_at DESC 
      LIMIT $1 OFFSET $2
    `;
    
    const result = await pool.query(query, [limit, offset]);
    
    return {
      users: result.rows,
      total,
    };
  }
}

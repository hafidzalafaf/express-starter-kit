import { jest } from '@jest/globals';

// Mock the database models
jest.mock('../../src/models/user.model', () => ({
  default: {
    async findByEmail(email: string) {
      if (email === 'test@example.com') {
        return {
          id: 1,
          email: 'test@example.com',
          name: 'Test User',
          password: '$2b$10$hashed_password', // Mock hashed password
          role: 'user',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
      }
      return null;
    },

    async findById(id: number) {
      if (id === 1) {
        return {
          id: 1,
          email: 'test@example.com',
          name: 'Test User',
          password: '$2b$10$hashed_password',
          role: 'user',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
      }
      return null;
    },

    async create(userData: any) {
      return {
        id: 1,
        ...userData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }
  }
}));

jest.mock('../../src/models/todo.model', () => ({
  default: {
    async findByUserId(userId: number) {
      return [];
    },

    async create(todoData: any) {
      return {
        id: 1,
        ...todoData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }
  }
}));

// Mock the database connection
jest.mock('../../src/config/database', () => ({
  connectDB: jest.fn(),
  initializeDB: jest.fn(),
  pool: {
    query: jest.fn(() => Promise.resolve({ rows: [], rowCount: 0 }))
  }
}));

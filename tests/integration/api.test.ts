import request from 'supertest';
import App from '../../src/app';

describe('API Integration Tests', () => {
  let app: App;
  let server: any;

  beforeAll(async () => {
    app = new App();
    server = app.app;
  });

  afterAll(async () => {
    // Close any connections if needed
  });

  describe('Health Check', () => {
    it('should return API status', async () => {
      const response = await request(server)
        .get('/api/v1/health')
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        message: 'API is running',
      });
      expect(response.body.timestamp).toBeDefined();
      expect(response.body.uptime).toBeDefined();
    });
  });

  describe('Root Endpoint', () => {
    it('should return welcome message', async () => {
      const response = await request(server)
        .get('/')
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        message: 'Welcome to Express Starter Kit API',
        version: '1.0.0',
      });
    });
  });

  describe('404 Handler', () => {
    it('should return 404 for non-existent routes', async () => {
      const response = await request(server)
        .get('/non-existent-route')
        .expect(404);

      expect(response.body).toMatchObject({
        success: false,
        message: expect.stringContaining('Route GET /non-existent-route not found'),
        error: 'NOT_FOUND',
      });
    });
  });

  describe('Authentication Endpoints', () => {
    describe('POST /api/v1/auth/register', () => {
      it('should register a new user with valid data', async () => {
        const userData = {
          username: 'testuser',
          email: 'test@example.com',
          password: 'TestPass123!',
        };

        const response = await request(server)
          .post('/api/v1/auth/register')
          .send(userData)
          .expect(201);

        expect(response.body).toMatchObject({
          success: true,
          message: 'User registered successfully',
        });
        expect(response.body.data).toBeDefined();
        expect(response.body.data.email).toBe(userData.email);
        expect(response.body.data.username).toBe(userData.username);
        expect(response.body.data.password).toBeUndefined();
      });

      it('should return validation error for invalid data', async () => {
        const invalidUserData = {
          username: 'te', // Too short
          email: 'invalid-email',
          password: '123', // Too weak
        };

        const response = await request(server)
          .post('/api/v1/auth/register')
          .send(invalidUserData)
          .expect(400);

        expect(response.body).toMatchObject({
          success: false,
          message: 'Validation failed',
        });
        expect(response.body.validationErrors).toBeDefined();
        expect(Array.isArray(response.body.validationErrors)).toBe(true);
      });
    });

    describe('POST /api/v1/auth/login', () => {
      beforeAll(async () => {
        // Register a user for login tests
        await request(server)
          .post('/api/v1/auth/register')
          .send({
            username: 'logintest',
            email: 'logintest@example.com',
            password: 'LoginTest123!',
          });
      });

      it('should login with valid credentials', async () => {
        const loginData = {
          email: 'logintest@example.com',
          password: 'LoginTest123!',
        };

        const response = await request(server)
          .post('/api/v1/auth/login')
          .send(loginData)
          .expect(200);

        expect(response.body).toMatchObject({
          success: true,
          message: 'Login successful',
        });
        expect(response.body.data).toBeDefined();
        expect(response.body.data.accessToken).toBeDefined();
        expect(response.body.data.refreshToken).toBeDefined();
        expect(response.body.data.user).toBeDefined();
      });

      it('should return error for invalid credentials', async () => {
        const invalidLoginData = {
          email: 'logintest@example.com',
          password: 'wrongpassword',
        };

        const response = await request(server)
          .post('/api/v1/auth/login')
          .send(invalidLoginData)
          .expect(401);

        expect(response.body).toMatchObject({
          success: false,
          message: 'Invalid email or password',
        });
      });
    });
  });
});

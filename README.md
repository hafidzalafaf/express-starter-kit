# Express.js Starter Kit

A comprehensive, production-ready Express.js starter kit with TypeScript, authentication, PostgreSQL database, Docker support, and best practices.

## 🚀 Features

### 🔐 Authentication & Security
- JWT access tokens + refresh tokens
- Password hashing with bcrypt
- Role-based access control (user/admin)
- Input validation and sanitization
- Security headers with Helmet
- CORS configuration
- Rate limiting

### 📊 Database & Models
- PostgreSQL database with connection pooling
- User and Todo models with relationships
- Database migrations and initialization
- Connection health checks

### 🏗️ Architecture & Best Practices
- Modular folder structure (controllers, services, routes, middlewares, models)
- TypeScript with strict configuration
- Environment variable management
- Comprehensive error handling
- Request/response logging with Winston
- API documentation with Swagger/OpenAPI

### 🧪 Testing & Quality
- Unit and integration tests with Jest
- Test coverage reporting
- ESLint and Prettier configuration
- Pre-commit hooks with Husky
- Code formatting and linting

### 🐳 DevOps & Deployment
- Docker containerization
- Docker Compose for development
- Health check endpoints
- Graceful shutdown handling
- Production-ready configuration

## 📁 Project Structure

```
express-starter-kit/
├── src/
│   ├── config/         # Configuration files
│   │   ├── config.ts
│   │   ├── database.ts
│   │   └── swagger.ts
│   ├── controllers/    # Route controllers
│   │   ├── auth.controller.ts
│   │   └── todo.controller.ts
│   ├── middlewares/    # Custom middlewares
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── validation.middleware.ts
│   ├── models/         # Database models
│   │   ├── user.model.ts
│   │   └── todo.model.ts
│   ├── routes/         # API routes
│   │   ├── auth.routes.ts
│   │   ├── todo.routes.ts
│   │   └── index.ts
│   ├── services/       # Business logic
│   │   ├── auth.service.ts
│   │   └── todo.service.ts
│   ├── types/          # TypeScript type definitions
│   │   ├── common.types.ts
│   │   ├── user.types.ts
│   │   └── todo.types.ts
│   ├── utils/          # Utility functions
│   │   ├── auth.ts
│   │   ├── logger.ts
│   │   ├── response.ts
│   │   └── validation/
│   ├── app.ts          # Express app configuration
│   └── server.ts       # Server entry point
├── tests/              # Test files
│   ├── integration/
│   ├── unit/
│   └── setup.ts
├── docs/               # Documentation
├── docker-compose.yml  # Docker services
├── Dockerfile          # Container configuration
└── package.json
```

## 🛠️ Installation

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- Docker and Docker Compose (optional)

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/express-starter-kit.git
   cd express-starter-kit
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Database setup**
   ```bash
   # Option 1: Using Docker Compose (recommended)
   docker-compose up -d postgres
   
   # Option 2: Manual PostgreSQL setup
   createdb express_starter
   ```

5. **Build and start**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm run build
   npm start
   ```

## 🐳 Docker Setup

### Quick Start with Docker Compose
```bash
# Start all services (API + PostgreSQL + Redis)
docker-compose up -d

# Build and start only API
docker-compose up --build api

# View logs
docker-compose logs -f api

# Stop services
docker-compose down
```

### Environment Variables for Docker
Create a `.env` file:
```bash
# Database
DB_HOST=postgres
DB_PORT=5432
DB_NAME=express_starter
DB_USER=postgres
DB_PASSWORD=your_secure_password

# JWT Secrets (CHANGE THESE!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-jwt-key-change-this-in-production

# Server
PORT=3000
NODE_ENV=production
```

## 📚 API Documentation

Once the server is running, access the interactive API documentation at:
- **Swagger UI**: `http://localhost:3000/docs`
- **JSON Spec**: `http://localhost:3000/docs.json`

### Authentication Flow

1. **Register a new user**
   ```bash
   POST /api/v1/auth/register
   {
     "username": "johndoe",
     "email": "john@example.com",
     "password": "SecurePass123!",
     "role": "user"
   }
   ```

2. **Login**
   ```bash
   POST /api/v1/auth/login
   {
     "email": "john@example.com",
     "password": "SecurePass123!"
   }
   ```

3. **Access protected routes**
   ```bash
   Authorization: Bearer <access_token>
   ```

### Todo Operations

- `GET /api/v1/todos` - Get user's todos (with pagination/filtering)
- `POST /api/v1/todos` - Create new todo
- `GET /api/v1/todos/:id` - Get specific todo
- `PUT /api/v1/todos/:id` - Update todo
- `DELETE /api/v1/todos/:id` - Delete todo

### Admin Operations

- `GET /api/v1/todos/admin/all` - Get all todos (admin only)
- `PUT /api/v1/todos/admin/:id` - Update any todo (admin only)
- `DELETE /api/v1/todos/admin/:id` - Delete any todo (admin only)

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage

# Run specific test file
npm test -- auth.utils.test.ts
```

### Test Structure
- **Unit Tests**: Test individual functions and modules
- **Integration Tests**: Test API endpoints and workflows
- **Coverage**: Minimum 80% coverage target

## 📊 Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build TypeScript to JavaScript |
| `npm start` | Start production server |
| `npm test` | Run test suite |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |
| `npm run docker:build` | Build Docker image |
| `npm run docker:run` | Start with Docker Compose |

## 🔒 Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: Prevent abuse
- **Input Validation**: Joi schemas
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: Input sanitization
- **JWT Security**: Short-lived access tokens + refresh tokens

## 📈 Monitoring & Logging

- **Winston Logger**: Structured logging with levels
- **Request Logging**: HTTP request/response logging
- **Error Tracking**: Centralized error handling
- **Health Checks**: `/api/v1/health` endpoint

## 🚀 Deployment

### Environment Variables
Ensure all environment variables are set in production:
```bash
NODE_ENV=production
JWT_SECRET=your-production-secret
JWT_REFRESH_SECRET=your-production-refresh-secret
DB_HOST=your-db-host
DB_PASSWORD=your-secure-password
```

### Production Checklist
- [ ] Update JWT secrets
- [ ] Configure database connection
- [ ] Set up SSL/TLS
- [ ] Configure reverse proxy (Nginx)
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy
- [ ] Test health checks

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make changes and add tests
4. Run tests: `npm test`
5. Commit changes: `git commit -am 'Add feature'`
6. Push to branch: `git push origin feature-name`
7. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Express.js team for the fantastic framework
- TypeScript team for type safety
- All contributors to the open-source packages used

---

## 📞 Support

If you have any questions or need help getting started:

1. Check the [API documentation](http://localhost:3000/docs)
2. Review the test files for usage examples
3. Open an issue for bug reports or feature requests

**Happy coding! 🎉**

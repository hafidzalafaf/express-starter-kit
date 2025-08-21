<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Express.js Starter Kit - Copilot Instructions

This is an Express.js starter kit project with TypeScript. Please follow these guidelines when suggesting code:

## Architecture & Patterns

- Use **modular architecture** with clear separation of concerns:
  - Controllers handle HTTP requests/responses
  - Services contain business logic
  - Models handle database operations
  - Middlewares for cross-cutting concerns
  - Utilities for helper functions

- Follow **TypeScript best practices**:
  - Use strict type checking
  - Define interfaces for all data structures
  - Use generics where appropriate
  - Avoid `any` type unless absolutely necessary

## Code Style & Standards

- Use **ES6+ features** (async/await, destructuring, arrow functions)
- Follow **functional programming principles** where possible
- Use **meaningful variable and function names**
- Add **JSDoc comments** for public functions
- Prefer **composition over inheritance**

## Error Handling

- Use **try-catch blocks** in async functions
- Create **custom error classes** when needed
- Always return **consistent API responses** with success/error format
- Log errors with appropriate **log levels** using Winston

## Database Operations

- Use **parameterized queries** to prevent SQL injection
- Implement **proper connection pooling**
- Handle **database errors** gracefully
- Use **transactions** for multi-step operations
- Always **close connections** properly

## Security Best Practices

- **Validate all inputs** using Joi schemas
- **Sanitize user input** to prevent XSS
- Use **bcrypt** for password hashing
- Implement **proper JWT token handling**
- Follow **principle of least privilege** for database access
- Use **environment variables** for sensitive data

## API Design

- Follow **RESTful conventions**
- Use **proper HTTP status codes**
- Implement **pagination** for list endpoints
- Add **filtering and sorting** options
- Include **comprehensive API documentation** with Swagger
- Use **consistent response formats**

## Testing Guidelines

- Write **unit tests** for utilities and services
- Create **integration tests** for API endpoints
- Mock **external dependencies** in tests
- Aim for **high test coverage** (>80%)
- Use **descriptive test names** and organize with describe blocks

## Performance & Optimization

- Use **connection pooling** for database
- Implement **caching strategies** where appropriate
- Add **compression middleware**
- Use **rate limiting** to prevent abuse
- Optimize **database queries** and add indexes

## Environment & Configuration

- Use **environment variables** for all configuration
- Provide **.env.example** with all required variables
- Support **multiple environments** (dev, test, prod)
- Use **configuration validation** on startup

When generating code, please:

1. **Follow the existing folder structure** and naming conventions
2. **Import types** from the appropriate type definition files
3. **Use the existing error handling patterns**
4. **Add proper validation** for all inputs
5. **Include appropriate logging statements**
6. **Write accompanying tests** when creating new functions
7. **Update API documentation** when adding new endpoints
8. **Consider security implications** of any code changes

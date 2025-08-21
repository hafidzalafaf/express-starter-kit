import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { sanitizeInput } from '../../src/middlewares/validation.middleware';
import { errorHandler, notFoundHandler } from '../../src/middlewares/error.middleware';
import routes from '../../src/routes';
import config from '../../src/config/config';

/**
 * Test-specific app setup without database dependencies
 */
export function createTestApp(): express.Application {
  const app = express();

  // Basic middleware for testing
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  }));

  app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));

  app.use(compression());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(sanitizeInput);

  // API routes
  app.use(config.server.apiPrefix, routes);

  // Root endpoint
  app.get('/', (req, res) => {
    res.json({
      success: true,
      message: 'Welcome to Express Starter Kit API',
      version: '1.0.0',
      documentation: '/docs',
      apiPrefix: config.server.apiPrefix,
    });
  });

  // Error handling
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

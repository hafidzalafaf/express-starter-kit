import { Router } from 'express';
import authRoutes from './auth.routes';
import todoRoutes from './todo.routes';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API routes
router.use('/auth', authRoutes);
router.use('/todos', todoRoutes);

export default router;

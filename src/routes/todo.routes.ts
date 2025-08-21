import { Router } from 'express';
import { TodoController } from '@/controllers/todo.controller';
import { validate } from '@/middlewares/validation.middleware';
import { authenticate, authorize } from '@/middlewares/auth.middleware';
import { createTodoSchema, updateTodoSchema, todoIdSchema, todoQuerySchema } from '@/utils/validation/todo.validation';

const router = Router();

// Apply authentication to all todo routes
router.use(authenticate);

/**
 * @swagger
 * /api/v1/todos:
 *   post:
 *     summary: Create a new todo
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 255
 *               description:
 *                 type: string
 *                 maxLength: 1000
 *     responses:
 *       201:
 *         description: Todo created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Todo created successfully
 *                 data:
 *                   $ref: '#/components/schemas/TodoResponse'
 */
router.post('/', validate(createTodoSchema), TodoController.createTodo);

/**
 * @swagger
 * /api/v1/todos:
 *   get:
 *     summary: Get user's todos with pagination and filtering
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, done]
 *         description: Filter by todo status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           maxLength: 255
 *         description: Search in title and description
 *     responses:
 *       200:
 *         description: Todos retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Todos retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TodoResponse'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 */
router.get('/', validate(todoQuerySchema, 'query'), TodoController.getTodos);

/**
 * @swagger
 * /api/v1/todos/{id}:
 *   get:
 *     summary: Get todo by ID
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Todo ID
 *     responses:
 *       200:
 *         description: Todo retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Todo retrieved successfully
 *                 data:
 *                   $ref: '#/components/schemas/TodoResponse'
 */
router.get('/:id', validate(todoIdSchema, 'params'), TodoController.getTodoById);

/**
 * @swagger
 * /api/v1/todos/{id}:
 *   put:
 *     summary: Update todo
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Todo ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 255
 *               description:
 *                 type: string
 *                 maxLength: 1000
 *               status:
 *                 type: string
 *                 enum: [pending, done]
 *     responses:
 *       200:
 *         description: Todo updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Todo updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/TodoResponse'
 */
router.put('/:id', 
  validate(todoIdSchema, 'params'),
  validate(updateTodoSchema),
  TodoController.updateTodo
);

/**
 * @swagger
 * /api/v1/todos/{id}:
 *   delete:
 *     summary: Delete todo
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Todo ID
 *     responses:
 *       200:
 *         description: Todo deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Todo deleted successfully
 */
router.delete('/:id', validate(todoIdSchema, 'params'), TodoController.deleteTodo);

// Admin routes
/**
 * @swagger
 * /api/v1/todos/admin/all:
 *   get:
 *     summary: Admin - Get all todos with pagination and filtering
 *     tags: [Admin - Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, done]
 *         description: Filter by todo status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           maxLength: 255
 *         description: Search in title and description
 *     responses:
 *       200:
 *         description: All todos retrieved successfully
 */
router.get('/admin/all', 
  authorize('admin'),
  validate(todoQuerySchema, 'query'), 
  TodoController.getAllTodos
);

/**
 * @swagger
 * /api/v1/todos/admin/{id}:
 *   get:
 *     summary: Admin - Get any todo by ID
 *     tags: [Admin - Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Todo ID
 *     responses:
 *       200:
 *         description: Todo retrieved successfully
 */
router.get('/admin/:id', 
  authorize('admin'),
  validate(todoIdSchema, 'params'), 
  TodoController.getAnyTodoById
);

/**
 * @swagger
 * /api/v1/todos/admin/{id}:
 *   put:
 *     summary: Admin - Update any todo
 *     tags: [Admin - Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Todo ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 255
 *               description:
 *                 type: string
 *                 maxLength: 1000
 *               status:
 *                 type: string
 *                 enum: [pending, done]
 *     responses:
 *       200:
 *         description: Todo updated successfully
 */
router.put('/admin/:id', 
  authorize('admin'),
  validate(todoIdSchema, 'params'),
  validate(updateTodoSchema),
  TodoController.updateAnyTodo
);

/**
 * @swagger
 * /api/v1/todos/admin/{id}:
 *   delete:
 *     summary: Admin - Delete any todo
 *     tags: [Admin - Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Todo ID
 *     responses:
 *       200:
 *         description: Todo deleted successfully
 */
router.delete('/admin/:id', 
  authorize('admin'),
  validate(todoIdSchema, 'params'), 
  TodoController.deleteAnyTodo
);

export default router;

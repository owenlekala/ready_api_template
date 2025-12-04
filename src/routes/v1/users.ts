import { Router } from 'express';
import { userController } from '../../controllers/userController';
import { requireAuth } from '../../middleware/auth';
import { validate } from '../../middleware/validator';
import { z } from 'zod';

const router = Router();

// All user routes require authentication
router.use(requireAuth);

// GET /api/v1/users - Get all users (with pagination)
router.get(
  '/',
  validate({
    query: z.object({
      page: z.string().transform(Number).pipe(z.number().int().positive()).optional(),
      limit: z.string().transform(Number).pipe(z.number().int().positive().max(100)).optional(),
    }),
  }),
  userController.getAll
);

// GET /api/v1/users/:id - Get user by ID
router.get(
  '/:id',
  validate({
    params: z.object({
      id: z.string().uuid('Invalid user ID format'),
    }),
  }),
  userController.getById
);

// POST /api/v1/users - Create new user
router.post(
  '/',
  validate({
    body: z.object({
      email: z.string().email('Invalid email format'),
      name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
    }),
  }),
  userController.create
);

// PUT /api/v1/users/:id - Update user
router.put(
  '/:id',
  validate({
    params: z.object({
      id: z.string().uuid('Invalid user ID format'),
    }),
    body: z.object({
      email: z.string().email('Invalid email format').optional(),
      name: z.string().min(1, 'Name is required').max(100, 'Name is too long').optional(),
    }),
  }),
  userController.update
);

// DELETE /api/v1/users/:id - Delete user
router.delete(
  '/:id',
  validate({
    params: z.object({
      id: z.string().uuid('Invalid user ID format'),
    }),
  }),
  userController.delete
);

export default router;


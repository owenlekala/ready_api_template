import { Request, Response, NextFunction } from 'express';
import { userService } from '../services/userService';
import { sendSuccess } from '../utils/responses';
import { PaginatedResponse } from '../types';

export const userController = {
  getAll: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = (req.query.page as number) || 1;
      const limit = (req.query.limit as number) || 10;

      const result = await userService.getAll(page, limit);

      const response: PaginatedResponse<typeof result.users[0]> = {
        data: result.users,
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: result.totalPages,
        },
      };

      sendSuccess(res, response);
    } catch (error) {
      next(error);
    }
  },

  getById: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const user = await userService.getById(id);
      sendSuccess(res, user);
    } catch (error) {
      next(error);
    }
  },

  create: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData = req.body;
      const user = await userService.create(userData);
      sendSuccess(res, user, 201);
    } catch (error) {
      next(error);
    }
  },

  update: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const userData = req.body;
      const user = await userService.update(id, userData);
      sendSuccess(res, user);
    } catch (error) {
      next(error);
    }
  },

  delete: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await userService.delete(id);
      sendSuccess(res, { message: 'User deleted successfully' });
    } catch (error) {
      next(error);
    }
  },
};


import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import env from '../config/env';
import { AuthenticationError } from '../utils/errors';
import logger from '../config/logger';
import { UserPayload } from '../types/express';

export interface AuthOptions {
  optional?: boolean;
}

export const authenticate = (options: AuthOptions = {}) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        if (options.optional) {
          return next();
        }
        throw new AuthenticationError('Authorization header is required');
      }

      const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

      if (!token) {
        if (options.optional) {
          return next();
        }
        throw new AuthenticationError('Token is required');
      }

      try {
        const decoded = jwt.verify(token, env.JWT_SECRET) as UserPayload;

        if (!decoded.userId) {
          throw new AuthenticationError('Invalid token: userId is missing');
        }

        req.user = decoded;
        next();
      } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
          logger.warn({ error: error.message }, 'JWT verification failed');
          throw new AuthenticationError('Invalid or expired token');
        }
        if (error instanceof jwt.TokenExpiredError) {
          throw new AuthenticationError('Token has expired');
        }
        throw error;
      }
    } catch (error) {
      next(error);
    }
  };
};

export const requireAuth = authenticate({ optional: false });
export const optionalAuth = authenticate({ optional: true });


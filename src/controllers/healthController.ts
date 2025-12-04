import { Request, Response, NextFunction } from 'express';
import { sendSuccess } from '../utils/responses';
import { HealthCheckResponse } from '../types';
import env from '../config/env';
import supabase from '../config/database';
import logger from '../config/logger';

export const healthController = {
  check: async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Quick database connectivity check
      const { error: dbError } = await supabase.from('_health').select('*').limit(1);

      const healthData: HealthCheckResponse = {
        status: dbError && dbError.code !== 'PGRST116' ? 'unhealthy' : 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: env.NODE_ENV,
      };

      if (dbError && dbError.code !== 'PGRST116') {
        logger.warn({ error: dbError }, 'Database health check failed');
      }

      sendSuccess(res, healthData);
    } catch (error) {
      next(error);
    }
  },
};


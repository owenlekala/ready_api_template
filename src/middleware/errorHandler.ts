import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import logger from '../config/logger';
import { sendError } from '../utils/responses';
import env from '../config/env';

export const errorHandler = (
  error: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Log the error
  if (error instanceof AppError) {
    if (error.statusCode >= 500) {
      logger.error(
        {
          error: error.message,
          stack: error.stack,
          statusCode: error.statusCode,
          code: error.code,
          requestId: req.requestId,
          path: req.path,
          method: req.method,
        },
        'Application error'
      );
    } else {
      logger.warn(
        {
          error: error.message,
          statusCode: error.statusCode,
          code: error.code,
          requestId: req.requestId,
          path: req.path,
          method: req.method,
        },
        'Client error'
      );
    }
  } else {
    // Unknown error
    logger.error(
      {
        error: error.message,
        stack: error.stack,
        requestId: req.requestId,
        path: req.path,
        method: req.method,
      },
      'Unhandled error'
    );
  }

  // Send error response
  if (error instanceof AppError) {
    if (error instanceof Error && 'errors' in error) {
      // ValidationError with field errors
      sendError(
        res,
        error.message,
        error.statusCode,
        error.code,
        (error as { errors: Array<{ field: string; message: string }> }).errors
      );
    } else {
      sendError(res, error.message, error.statusCode, error.code);
    }
  } else {
    // Unknown error - don't expose internal details in production
    const isDevelopment = env.NODE_ENV === 'development';
    sendError(
      res,
      isDevelopment ? error.message : 'Internal server error',
      500,
      'INTERNAL_SERVER_ERROR'
    );
  }
};


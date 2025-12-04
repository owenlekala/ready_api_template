import { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import env from '../config/env';
import { RateLimitError } from '../utils/errors';

// Helmet security headers
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
  crossOriginEmbedderPolicy: false,
});

// CORS configuration
export const corsMiddleware = cors({
  origin: env.CORS_ORIGIN === '*' ? true : env.CORS_ORIGIN.split(','),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id'],
  exposedHeaders: ['X-Request-Id'],
});

// Rate limiting
export const rateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX_REQUESTS,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req: Request, _res: Response) => {
    throw new RateLimitError('Too many requests, please try again later');
  },
});

// Request size limit middleware
export const requestSizeLimit = (req: Request, res: Response, next: NextFunction): void => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const contentLength = req.headers['content-length'];

  if (contentLength && parseInt(contentLength, 10) > maxSize) {
    res.status(413).json({
      success: false,
      error: {
        message: 'Request entity too large',
        code: 'PAYLOAD_TOO_LARGE',
      },
      timestamp: new Date().toISOString(),
    });
    return;
  }

  next();
};


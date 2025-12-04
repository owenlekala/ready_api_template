import express, { Express } from 'express';
import 'express-async-errors';
import compression from 'compression';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';
import { requestIdMiddleware } from './middleware/requestId';
import { requestLogger } from './middleware/requestLogger';
import {
  securityHeaders,
  corsMiddleware,
  rateLimiter,
  requestSizeLimit,
} from './middleware/security';
import logger from './config/logger';

const createApp = (): Express => {
  const app = express();

  // Trust proxy (important for rate limiting and IP detection behind reverse proxy)
  app.set('trust proxy', 1);

  // Security middleware (must be first)
  app.use(securityHeaders);
  app.use(corsMiddleware);
  app.use(requestSizeLimit);

  // Compression middleware (reduce response size)
  app.use(compression());

  // Request ID middleware (before logging)
  app.use(requestIdMiddleware);

  // Request logging
  app.use(requestLogger);

  // Body parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Health check endpoint (before rate limiting)
  app.get('/health', (req, res) => {
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
    });
  });

  // Rate limiting (after health check)
  app.use('/api', rateLimiter);

  // API routes
  app.use('/api', routes);

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      error: {
        message: 'Route not found',
        code: 'NOT_FOUND',
      },
      requestId: res.locals.requestId,
      timestamp: new Date().toISOString(),
    });
  });

  // Global error handler (must be last)
  app.use(errorHandler);

  logger.info('Express application initialized');

  return app;
};

export default createApp;


import createApp from './app';
import env from './config/env';
import logger from './config/logger';

const app = createApp();

const server = app.listen(env.PORT, () => {
  logger.info(
    {
      port: env.PORT,
      environment: env.NODE_ENV,
    },
    'Server started successfully'
  );
});

// Graceful shutdown
const shutdown = async (signal: string): Promise<void> => {
  logger.info({ signal }, 'Received shutdown signal, closing server gracefully');

  server.close(() => {
    logger.info('HTTP server closed');

    // Close database connections, cleanup, etc.
    // Supabase client doesn't require explicit cleanup, but we log it
    logger.info('Cleanup completed');
    process.exit(0);
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => {
  void shutdown('SIGTERM');
});
process.on('SIGINT', () => {
  void shutdown('SIGINT');
});

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  logger.error({ error }, 'Uncaught exception');
  void shutdown('uncaughtException');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: unknown) => {
  logger.error({ reason }, 'Unhandled promise rejection');
  void shutdown('unhandledRejection');
});

export default server;


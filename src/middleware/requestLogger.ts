import pinoHttp from 'pino-http';
import { Request, Response } from 'express';
import logger from '../config/logger';

export const requestLogger = pinoHttp({
  logger,
  genReqId: (req: Request) => req.requestId || (req.headers['x-request-id'] as string),
  serializers: {
    req: (req: Request) => ({
      id: req.id,
      method: req.method,
      url: req.url,
      query: req.query,
      params: req.params,
    }),
    res: (res: Response) => ({
      statusCode: res.statusCode,
    }),
  },
  customLogLevel: (_req: Request, res: Response, err?: Error) => {
    if (res.statusCode >= 400 && res.statusCode < 500) {
      return 'warn';
    } else if (res.statusCode >= 500 || err) {
      return 'error';
    }
    return 'info';
  },
  customSuccessMessage: (req: Request, res: Response) => {
    return `${req.method} ${req.url} ${res.statusCode}`;
  },
  customErrorMessage: (req: Request, res: Response, err: Error) => {
    return `${req.method} ${req.url} ${res.statusCode} - ${err.message}`;
  },
});


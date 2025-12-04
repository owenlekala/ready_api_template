import { Response } from 'express';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    errors?: Array<{ field: string; message: string }>;
  };
  requestId?: string;
  timestamp: string;
}

export const sendSuccess = <T>(res: Response, data: T, statusCode: number = 200): void => {
  const response: ApiResponse<T> = {
    success: true,
    data,
    requestId: res.locals.requestId,
    timestamp: new Date().toISOString(),
  };

  res.status(statusCode).json(response);
};

export const sendError = (
  res: Response,
  message: string,
  statusCode: number = 500,
  code?: string,
  errors?: Array<{ field: string; message: string }>
): void => {
  const response: ApiResponse = {
    success: false,
    error: {
      message,
      code,
      errors,
    },
    requestId: res.locals.requestId,
    timestamp: new Date().toISOString(),
  };

  res.status(statusCode).json(response);
};


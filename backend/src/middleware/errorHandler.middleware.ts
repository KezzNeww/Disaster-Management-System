import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { sendError } from '../utils/response';

export function errorHandlerMiddleware(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  logger.error(`Unhandled error at ${req.method} ${req.url}:`, err.message);

  return sendError(
    res,
    process.env.NODE_ENV === 'production'
      ? 'An unexpected error occurred in mission control engine.'
      : err.message,
    500,
    err.stack
  );
}

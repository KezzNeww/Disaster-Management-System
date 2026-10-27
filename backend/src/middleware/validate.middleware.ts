import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';

export function validatePayload(requiredFields: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const missing = requiredFields.filter((field) => !(field in req.body));
    if (missing.length > 0) {
      return sendError(
        res,
        `Missing required payload fields: ${missing.join(', ')}`,
        400
      );
    }
    next();
  };
}

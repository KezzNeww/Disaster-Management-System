import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
    clearanceLevel: string;
  };
}

export function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  // Skeleton authorization check
  const authHeader = req.headers.authorization;
  if (!authHeader && process.env.NODE_ENV === 'production') {
    return sendError(res, 'Authentication token missing or invalid', 401);
  }

  // Inject skeleton commander context for development
  req.user = {
    id: 'USR-COMMANDER-01',
    role: 'CHIEF_INCIDENT_COMMANDER',
    clearanceLevel: 'LEVEL_4',
  };

  next();
}

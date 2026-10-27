import { Request, Response } from 'express';
import { sendSuccess } from '../utils/response';

export const alertController = {
  async getActiveAlerts(_req: Request, res: Response) {
    // Skeleton placeholder
    return sendSuccess(res, [], 'Active broadcasts retrieved');
  },

  async broadcastAlert(req: Request, res: Response) {
    // Skeleton placeholder
    return sendSuccess(
      res,
      { broadcastId: 'BC-9901', status: 'TRANSMITTING', ...req.body },
      'Multi-channel emergency broadcast dispatched',
      201
    );
  },
};

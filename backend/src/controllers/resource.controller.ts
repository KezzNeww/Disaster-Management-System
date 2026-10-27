import { Request, Response } from 'express';
import { sendSuccess } from '../utils/response';

export const resourceController = {
  async getAllResources(_req: Request, res: Response) {
    // Skeleton placeholder
    return sendSuccess(res, [], 'Fleet units status retrieved');
  },

  async dispatchResource(req: Request, res: Response) {
    const { id } = req.params;
    // Skeleton placeholder
    return sendSuccess(
      res,
      { id, status: 'DEPLOYED', ...req.body },
      `Resource ${id} dispatched`
    );
  },

  async updateResourceStatus(req: Request, res: Response) {
    const { id } = req.params;
    // Skeleton placeholder
    return sendSuccess(res, { id, ...req.body }, `Resource ${id} telemetry updated`);
  },
};

import { Request, Response } from 'express';
import { sendSuccess } from '../utils/response';

export const disasterController = {
  async getAllDisasters(_req: Request, res: Response) {
    // Skeleton placeholder
    return sendSuccess(res, [], 'Disaster telemetry retrieved successfully');
  },

  async getDisasterById(req: Request, res: Response) {
    const { id } = req.params;
    // Skeleton placeholder
    return sendSuccess(res, { id }, `Disaster ${id} retrieved`);
  },

  async createDisaster(req: Request, res: Response) {
    // Skeleton placeholder
    return sendSuccess(res, req.body, 'Disaster record registered', 201);
  },

  async updateDisaster(req: Request, res: Response) {
    const { id } = req.params;
    // Skeleton placeholder
    return sendSuccess(res, { id, ...req.body }, `Disaster ${id} updated`);
  },
};

import { Request, Response } from 'express';
import { sendSuccess } from '../utils/response';

export const incidentController = {
  async getAllIncidents(_req: Request, res: Response) {
    // Skeleton placeholder
    return sendSuccess(res, [], 'Incident queue retrieved successfully');
  },

  async logIncident(req: Request, res: Response) {
    // Skeleton placeholder
    return sendSuccess(res, req.body, 'Incident logged into tactical queue', 201);
  },

  async updateIncidentStatus(req: Request, res: Response) {
    const { id } = req.params;
    // Skeleton placeholder
    return sendSuccess(res, { id, ...req.body }, `Incident ${id} triage updated`);
  },
};

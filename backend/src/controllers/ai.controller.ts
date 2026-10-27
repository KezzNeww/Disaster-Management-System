import { Request, Response } from 'express';
import { sendSuccess } from '../utils/response';

export const aiController = {
  async getPrediction(req: Request, res: Response) {
    const { disasterId } = req.params;
    // Skeleton placeholder
    return sendSuccess(
      res,
      {
        disasterId,
        modelIdentifier: 'GEOSPATIAL-PROPAGATION-V3',
        confidenceScore: 0.94,
        vectors: [],
      },
      'AI predictive inference completed'
    );
  },

  async runSimulation(req: Request, res: Response) {
    const { disasterId } = req.params;
    // Skeleton placeholder
    return sendSuccess(
      res,
      {
        disasterId,
        simulationStatus: 'COMPLETED',
        parameters: req.body,
      },
      'Monte Carlo spread simulation generated'
    );
  },
};

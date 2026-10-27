import { api, ApiResponse } from './api';
import { AIPredictionResult } from '../types';

export const aiService = {
  async getPrediction(disasterId: string): Promise<ApiResponse<AIPredictionResult>> {
    return api.get<ApiResponse<AIPredictionResult>>(`/ai/predict/${disasterId}`);
  },

  async runSimulation(disasterId: string, parameters: { windSpeed?: number; rainfallMm?: number }): Promise<ApiResponse<AIPredictionResult>> {
    return api.post<ApiResponse<AIPredictionResult>>(`/ai/simulate/${disasterId}`, parameters);
  },
};

import { api, ApiResponse } from './api';
import { ResourceUnit } from '../types';

export const resourceService = {
  async getAllResources(): Promise<ApiResponse<ResourceUnit[]>> {
    return api.get<ApiResponse<ResourceUnit[]>>('/resources');
  },

  async dispatchResource(resourceId: string, incidentId: string): Promise<ApiResponse<ResourceUnit>> {
    return api.post<ApiResponse<ResourceUnit>>(`/resources/${resourceId}/dispatch`, { incidentId });
  },

  async updateStatus(resourceId: string, status: string): Promise<ApiResponse<ResourceUnit>> {
    return api.put<ApiResponse<ResourceUnit>>(`/resources/${resourceId}/status`, { status });
  },
};

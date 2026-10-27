import { api, ApiResponse } from './api';
import { Disaster } from '../types';

export const disasterService = {
  async getAll(): Promise<ApiResponse<Disaster[]>> {
    return api.get<ApiResponse<Disaster[]>>('/disasters');
  },

  async getById(id: string): Promise<ApiResponse<Disaster>> {
    return api.get<ApiResponse<Disaster>>(`/disasters/${id}`);
  },

  async create(payload: Partial<Disaster>): Promise<ApiResponse<Disaster>> {
    return api.post<ApiResponse<Disaster>>('/disasters', payload);
  },

  async update(id: string, payload: Partial<Disaster>): Promise<ApiResponse<Disaster>> {
    return api.put<ApiResponse<Disaster>>(`/disasters/${id}`, payload);
  },
};

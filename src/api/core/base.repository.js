import { apiClient } from './apiClient';

export class BaseRepository {
  constructor(endpoint, localMockData = null, forceBackend = false) {
    this.endpoint = endpoint;
    this.localMockData = localMockData;
    this.useBackend = forceBackend;
  }

  async getAll(params = {}) {
    if (!this.useBackend && this.localMockData !== null) {
      return Promise.resolve(this.localMockData);
    }

    try {
      const response = await apiClient.get(this.endpoint, { params });
      return response.data;
    } catch (error) {
      if (this.localMockData !== null) {
        return Promise.resolve(this.localMockData);
      }
      throw error;
    }
  }

  async getById(id) {
    const response = await apiClient.get(`${this.endpoint}/${id}`);
    return response.data;
  }

  async create(payload) {
    const response = await apiClient.post(this.endpoint, payload);
    return response.data;
  }

  async update(id, payload) {
    const response = await apiClient.put(`${this.endpoint}/${id}`, payload);
    return response.data;
  }

  async remove(id) {
    const response = await apiClient.delete(`${this.endpoint}/${id}`);
    return response.data;
  }
}
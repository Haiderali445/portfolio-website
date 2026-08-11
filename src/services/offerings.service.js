import { servicesData } from '../utils/data/services-data';

export const offeringsService = {
  /**
   * Fetches services offered.
   * [Backend Swap]: Replace with `await apiClient.get('/services')`
   */
  async getServices() {
    return Promise.resolve([...servicesData]);
  },

  /**
   * Fetches service details by ID.
   * [Backend Swap]: Replace with `await apiClient.get(`/services/${id}`)`
   */
  async getServiceById(id) {
    const service = servicesData.find((s) => s.id === Number(id));
    return Promise.resolve(service || null);
  }
};

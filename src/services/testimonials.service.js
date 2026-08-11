import { testimonialData } from '../utils/data/testem-data';

export const testimonialsService = {
  /**
   * Fetches testimonials.
   * [Backend Swap]: Replace with `await apiClient.get('/testimonials')`
   */
  async getTestimonials() {
    return Promise.resolve([...testimonialData]);
  }
};

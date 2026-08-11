import { educations } from '../utils/data/educations';

export const educationService = {
  /**
   * Fetches educational history.
   * [Backend Swap]: Replace with `await apiClient.get('/education')`
   */
  async getEducations() {
    return Promise.resolve([...educations]);
  }
};

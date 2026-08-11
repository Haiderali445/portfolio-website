import { experienceData } from '../utils/data/experience-data';

export const experienceService = {
  /**
   * Fetches work experiences.
   * [Backend Swap]: Replace with `await apiClient.get('/experience')`
   */
  async getExperiences() {
    return Promise.resolve([...experienceData]);
  }
};

import { personalData } from '../utils/data/personal-data';

export const profileService = {
  /**
   * Fetches profile/personal identity details.
   * [Backend Swap]: Replace with `await apiClient.get('/profile')`
   */
  async getProfile() {
    return Promise.resolve({ ...personalData });
  }
};

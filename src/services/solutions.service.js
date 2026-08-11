import { solutionsData } from '../utils/data/solutionsData';

export const solutionsService = {
  /**
   * Fetches technical solutions.
   * [Backend Swap]: Replace with `await apiClient.get('/solutions')`
   */
  async getSolutions() {
    return Promise.resolve([...solutionsData]);
  }
};

import { skillsData } from '../utils/data/skills';
import { skillCategories } from '../utils/data/skill-catagories';

export const skillsService = {
  /**
   * Fetches skill list.
   * [Backend Swap]: Replace with `await apiClient.get('/skills')`
   */
  async getSkills() {
    return Promise.resolve([...skillsData]);
  },

  /**
   * Fetches skill categories.
   * [Backend Swap]: Replace with `await apiClient.get('/skills/categories')`
   */
  async getCategories() {
    return Promise.resolve([...skillCategories]);
  }
};

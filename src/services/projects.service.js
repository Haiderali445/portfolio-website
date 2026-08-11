import { projectsData } from '../utils/data/projects-data';

export const projectsService = {
  /**
   * Fetches all projects.
   * [Backend Swap]: Replace with `await apiClient.get('/projects')`
   */
  async getProjects() {
    return Promise.resolve([...projectsData]);
  },

  /**
   * Fetches a project by ID.
   * [Backend Swap]: Replace with `await apiClient.get(`/projects/${id}`)`
   */
  async getProjectById(id) {
    const project = projectsData.find((p) => p.id === Number(id));
    return Promise.resolve(project || null);
  }
};

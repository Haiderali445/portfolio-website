import { BaseRepository } from '../core/base.repository';
import { projectsData } from '../../utils/data/projects-data';

class ProjectsService extends BaseRepository {
  constructor() {
    super('/projects', projectsData);
  }

  async getProjects() {
    return this.getAll();
  }

  async getProjectById(id) {
    return this.getById(id);
  }
}

export const projectsService = new ProjectsService();
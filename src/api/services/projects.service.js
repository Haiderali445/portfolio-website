import { BaseRepository } from '../core/base.repository';
import { projectsData } from '../../utils/data/projects-data';
import { logger } from '../core/logger';

class ProjectsService extends BaseRepository {
  constructor() {
    super('projects', projectsData);
  }

  async getProjects() {
    const start = performance.now();

    if (!this.useBackend && this.localMockData !== null) {
      logger.info(this.endpoint, `[Mock Mode] Serving local mock data for projects`);
      return Promise.resolve(this.localMockData);
    }

    try {
      const { data: projects, error } = await this.supabase
        .from('projects')
        .select('*');

      if (error) throw error;
      if (!projects || projects.length === 0) return this.localMockData;

      const projectIds = projects.map(p => p.id);
      const [toolsRes, imagesRes, contributorsRes] = await Promise.all([
        this.supabase.from('project_tools').select('*').in('project_id', projectIds),
        this.supabase.from('project_images').select('*').in('project_id', projectIds),
        this.supabase.from('project_contributors').select('*').in('project_id', projectIds)
      ]);

      const formattedProjects = projects.map(project => ({
        ...project,
        tools: toolsRes.data?.filter(t => t.project_id === project.id).map(t => t.tool) || [],
        images: imagesRes.data?.filter(img => img.project_id === project.id).map(img => img.image_url) || [],
        contributors: contributorsRes.data?.filter(c => c.project_id === project.id).map(c => ({
          name: c.name,
          github: c.github,
          profileUrl: c.profileUrl
        })) || []
      }));

      const duration = (performance.now() - start).toFixed(2);
      logger.morgan('GET', `/api/projects/with-relations`, 200, duration);
      logger.success(this.endpoint, `Successfully fetched projects with relations (${formattedProjects.length} records)`);

      return formattedProjects;
    } catch (error) {
      const duration = (performance.now() - start).toFixed(2);
      logger.morgan('GET', `/api/projects/with-relations`, 500, duration);
      logger.error(this.endpoint, 'Failed to fetch projects from Supabase, using local fallback', error);
      return this.localMockData;
    }
  }

  async getProjectById(id) {
    const projects = await this.getProjects();
    return projects.find(p => p.id === Number(id)) || null;
  }
}

export const projectsService = new ProjectsService();
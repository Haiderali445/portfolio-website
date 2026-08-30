import { BaseRepository } from '../core/base.repository';
import { experienceData } from '../../utils/data/experience-data';
import { logger } from '../core/logger';

class ExperienceService extends BaseRepository {
  constructor() {
    super('experience', experienceData);
  }

  async getExperiences() {
    const start = performance.now();

    if (!this.useBackend && this.localMockData !== null) {
      logger.info(this.endpoint, `[Mock Mode] Serving local mock data for experience`);
      return Promise.resolve(this.localMockData);
    }

    try {
      const { data: experiences, error } = await this.supabase
        .from('experience')
        .select('*');

      if (error) throw error;
      if (!experiences || experiences.length === 0) return this.localMockData;

      const expIds = experiences.map(e => e.id);
      const { data: techData, error: techError } = await this.supabase
        .from('experience_tech')
        .select('*')
        .in('experience_id', expIds);

      if (techError) throw techError;

      const formattedExperiences = experiences.map(exp => ({
        ...exp,
        companyUrl: exp.companyUrl ?? exp.company_url ?? '',
        tech: techData?.filter(t => t.experience_id === exp.id).map(t => t.tech) || []
      }));

      const duration = (performance.now() - start).toFixed(2);
      logger.morgan('GET', `/api/experience/with-relations`, 200, duration);
      logger.success(this.endpoint, `Successfully fetched experiences with tech stack (${formattedExperiences.length} records)`);

      return formattedExperiences;
    } catch (error) {
      const duration = (performance.now() - start).toFixed(2);
      logger.morgan('GET', `/api/experience/with-relations`, 500, duration);
      logger.error(this.endpoint, 'Failed to fetch experience from Supabase, using local fallback', error);
      return this.localMockData;
    }
  }
}

export const experienceService = new ExperienceService();
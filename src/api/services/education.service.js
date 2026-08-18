import { BaseRepository } from '../core/base.repository';
import { educations } from '../../utils/data/educations';
import { logger } from '../core/logger';

class EducationService extends BaseRepository {
  constructor() {
    super('education', educations);
  }

  async getEducations() {
    const start = performance.now();

    if (!this.useBackend && this.localMockData !== null) {
      logger.info(this.endpoint, `[Mock Mode] Serving local mock data for education`);
      return Promise.resolve(this.localMockData);
    }

    try {
      const { data, error } = await this.supabase
        .from('education')
        .select('*');

      if (error) throw error;
      
      const duration = (performance.now() - start).toFixed(2);
      logger.morgan('GET', `/api/education`, 200, duration);

      if (!data || data.length === 0) {
        logger.info(this.endpoint, `Table empty, falling back to local mock data`);
        return this.localMockData;
      }

      logger.success(this.endpoint, `Successfully fetched education records (${data.length} records)`);
      return data;
    } catch (error) {
      const duration = (performance.now() - start).toFixed(2);
      logger.morgan('GET', `/api/education`, 500, duration);
      logger.error(this.endpoint, 'Failed to fetch education from Supabase, using local fallback', error);
      return this.localMockData;
    }
  }
}

export const educationService = new EducationService();
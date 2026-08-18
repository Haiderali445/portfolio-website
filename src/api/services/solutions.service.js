import { BaseRepository } from '../core/base.repository';
import { solutionsData } from '../../utils/data/solutionsData';
import { logger } from '../core/logger';

class SolutionsService extends BaseRepository {
  constructor() {
    super('solutions', solutionsData);
  }

  async getSolutions() {
    const start = performance.now();

    if (!this.useBackend && this.localMockData !== null) {
      logger.info(this.endpoint, `[Mock Mode] Serving local mock data for solutions`);
      return Promise.resolve(this.localMockData);
    }

    try {
      const { data: solutions, error } = await this.supabase
        .from('solutions')
        .select('*');

      if (error) throw error;
      if (!solutions || solutions.length === 0) return this.localMockData;

      const solutionIds = solutions.map(s => s.id);
      const { data: techData, error: techError } = await this.supabase
        .from('solution_tech')
        .select('*')
        .in('solution_id', solutionIds);

      if (techError) throw techError;

      const formattedSolutions = solutions.map(sol => ({
        ...sol,
        tech: techData?.filter(t => t.solution_id === sol.id).map(t => t.tech) || []
      }));

      const duration = (performance.now() - start).toFixed(2);
      logger.morgan('GET', `/api/solutions/with-relations`, 200, duration);
      logger.success(this.endpoint, `Successfully fetched solutions with tech stack (${formattedSolutions.length} records)`);

      return formattedSolutions;
    } catch (error) {
      const duration = (performance.now() - start).toFixed(2);
      logger.morgan('GET', `/api/solutions/with-relations`, 500, duration);
      logger.error(this.endpoint, 'Failed to fetch solutions from Supabase, using local fallback', error);
      return this.localMockData;
    }
  }
}

export const solutionsService = new SolutionsService();
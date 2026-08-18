import { BaseRepository } from '../core/base.repository';
import { testimonialData } from '../../utils/data/testem-data';
import { logger } from '../core/logger';

class TestimonialsService extends BaseRepository {
  constructor() {
    super('testimonials', testimonialData);
  }

  async getTestimonials() {
    const start = performance.now();

    if (!this.useBackend && this.localMockData !== null) {
      logger.info(this.endpoint, `[Mock Mode] Serving local mock data for testimonials`);
      return Promise.resolve(this.localMockData);
    }

    try {
      const { data, error } = await this.supabase
        .from('testimonials')
        .select('*');

      if (error) throw error;

      const duration = (performance.now() - start).toFixed(2);
      logger.morgan('GET', `/api/testimonials`, 200, duration);

      if (!data || data.length === 0) return this.localMockData;

      logger.success(this.endpoint, `Successfully fetched testimonials (${data.length} records)`);
      return data;
    } catch (error) {
      const duration = (performance.now() - start).toFixed(2);
      logger.morgan('GET', `/api/testimonials`, 500, duration);
      logger.error(this.endpoint, 'Failed to fetch testimonials from Supabase, using local fallback', error);
      return this.localMockData;
    }
  }
}

export const testimonialsService = new TestimonialsService();
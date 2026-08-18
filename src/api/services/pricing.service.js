import { BaseRepository } from '../core/base.repository';
import { planData } from '../../utils/data/plan-data';
import { logger } from '../core/logger';

class PricingService extends BaseRepository {
  constructor() {
    super('pricing', planData);
  }

  async getPricingPlans() {
    const start = performance.now();

    if (!this.useBackend && this.localMockData !== null) {
      logger.info(this.endpoint, `[Mock Mode] Serving local mock data for pricing`);
      return Promise.resolve(this.localMockData);
    }

    try {
      const { data, error } = await this.supabase
        .from('pricing')
        .select('*');

      if (error) throw error;

      const duration = (performance.now() - start).toFixed(2);
      logger.morgan('GET', `/api/pricing`, 200, duration);

      if (!data || data.length === 0) {
        logger.info(this.endpoint, `Table empty, falling back to local mock data`);
        return this.localMockData;
      }

      logger.success(this.endpoint, `Successfully fetched pricing plans (${data.length} records)`);
      return data;
    } catch (error) {
      const duration = (performance.now() - start).toFixed(2);
      logger.morgan('GET', `/api/pricing`, 500, duration);
      logger.error(this.endpoint, 'Failed to fetch pricing plans from Supabase, using local fallback', error);
      return this.localMockData;
    }
  }
}

export const pricingService = new PricingService();
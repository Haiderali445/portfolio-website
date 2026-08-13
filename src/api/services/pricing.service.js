import { BaseRepository } from '../core/base.repository';
import { planData } from '../../utils/data/plan-data';

class PricingService extends BaseRepository {
  constructor() {
    super('/pricing', planData);
  }

  async getPricingPlans() {
    return this.getAll();
  }
}

export const pricingService = new PricingService();
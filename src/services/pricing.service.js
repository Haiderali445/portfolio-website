import { planData } from '../utils/data/plan-data';

export const pricingService = {
  /**
   * Fetches pricing plans.
   * [Backend Swap]: Replace with `await apiClient.get('/pricing')`
   */
  async getPricingPlans() {
    return Promise.resolve([...planData]);
  }
};

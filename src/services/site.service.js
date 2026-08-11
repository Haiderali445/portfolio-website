import { siteConfig } from '../utils/data/site-config';

export const siteService = {
  /**
   * Fetches site configuration and UI copy.
   * [Backend Swap]: Replace with `await apiClient.get('/site-config')`
   */
  async getSiteConfig() {
    return Promise.resolve({ ...siteConfig });
  }
};

import { BaseRepository } from '../core/base.repository';
import { siteConfig } from '../../utils/data/site-config';
import { logger } from '../core/logger';

class SiteService extends BaseRepository {
  constructor() {
    super('site_config', siteConfig);
  }

  async getSiteConfig() {
    const start = performance.now();

    if (!this.useBackend && this.localMockData !== null) {
      logger.info(this.endpoint, `[Mock Mode] Serving local mock data for site config`);
      return Promise.resolve(this.localMockData);
    }

    try {
      const { data, error } = await this.supabase
        .from('site_config')
        .select('*')
        .eq('id', 1)
        .maybeSingle();

      if (error) throw error;
      if (!data) return this.localMockData;

      const formattedConfig = {
        ...data,
        devStack: {
          os: data.devStack_os,
          editor: data.devStack_editor,
          shell: data.devStack_shell,
          framework: data.devStack_framework,
          style: data.devStack_style,
        }
      };

      const duration = (performance.now() - start).toFixed(2);
      logger.morgan('GET', `/api/site_config`, 200, duration);
      logger.success(this.endpoint, `Successfully fetched site configuration`);

      return formattedConfig;
    } catch (error) {
      const duration = (performance.now() - start).toFixed(2);
      logger.morgan('GET', `/api/site_config`, 500, duration);
      logger.error(this.endpoint, 'Failed to fetch site config from Supabase, using local fallback', error);
      return this.localMockData;
    }
  }
}

export const siteService = new SiteService();
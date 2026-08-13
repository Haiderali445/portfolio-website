import { BaseRepository } from '../core/base.repository';
import { siteConfig } from '../../utils/data/site-config';

class SiteService extends BaseRepository {
  constructor() {
    super('/site-config', siteConfig);
  }

  async getSiteConfig() {
    return this.getAll();
  }
}

export const siteService = new SiteService();
import { BaseRepository } from '../core/base.repository';
import { skillsData } from '../../utils/data/skills';
import { skillCategories } from '../../utils/data/skill-catagories';
import { logger } from '../core/logger';

class SkillsService extends BaseRepository {
  constructor() {
    super('skills', skillsData);
  }

  async getSkills() {
    const start = performance.now();

    if (!this.useBackend && this.localMockData !== null) {
      logger.info(this.endpoint, `[Mock Mode] Serving local mock data for skills`);
      return Promise.resolve(this.localMockData);
    }

    try {
      const { data, error } = await this.supabase
        .from('skills')
        .select('*');

      if (error) throw error;

      const duration = (performance.now() - start).toFixed(2);
      logger.morgan('GET', `/api/skills`, 200, duration);

      if (!data || data.length === 0) return this.localMockData;

      logger.success(this.endpoint, `Successfully fetched skills (${data.length} records)`);
      return data;
    } catch (error) {
      const duration = (performance.now() - start).toFixed(2);
      logger.morgan('GET', `/api/skills`, 500, duration);
      logger.error(this.endpoint, 'Failed to fetch skills from Supabase, using local fallback', error);
      return this.localMockData;
    }
  }

  async getCategories() {
    const start = performance.now();

    if (!this.useBackend) {
      return Promise.resolve(skillCategories);
    }

    try {
      const { data: categories, error } = await this.supabase
        .from('skill_categories')
        .select('*');

      if (error) throw error;
      if (!categories || categories.length === 0) return skillCategories;

      const catIds = categories.map(c => c.id);
      const { data: itemsData, error: itemsError } = await this.supabase
        .from('skill_category_items')
        .select('*')
        .in('skill_category_id', catIds);

      if (itemsError) throw itemsError;

      const formattedCategories = categories.map(cat => ({
        ...cat,
        skills: itemsData?.filter(i => i.skill_category_id === cat.id).map(i => i.skill_name) || []
      }));

      const duration = (performance.now() - start).toFixed(2);
      logger.morgan('GET', `/api/skill_categories/with-items`, 200, duration);
      logger.success('skill_categories', `Successfully fetched skill categories with items (${formattedCategories.length} categories)`);

      return formattedCategories;
    } catch (error) {
      const duration = (performance.now() - start).toFixed(2);
      logger.morgan('GET', `/api/skill_categories/with-items`, 500, duration);
      logger.error('skill_categories', 'Failed to fetch skill categories from Supabase, using local fallback', error);
      return skillCategories;
    }
  }
}

export const skillsService = new SkillsService();
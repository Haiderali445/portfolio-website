import { BaseRepository } from '../core/base.repository';
import { skillsData } from '../../utils/data/skills';
import { skillCategories } from '../../utils/data/skill-catagories';

class SkillsService extends BaseRepository {
  constructor() {
    super('/skills', skillsData);
  }

  async getSkills() {
    return this.getAll();
  }

  async getCategories() {
    // If categories have their own endpoint / dataset
    const catRepo = new BaseRepository('/skills/categories', skillCategories);
    return catRepo.getAll();
  }
}

export const skillsService = new SkillsService();
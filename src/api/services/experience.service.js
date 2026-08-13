import { BaseRepository } from '../core/base.repository';
import { experienceData } from '../../utils/data/experience-data';

class ExperienceService extends BaseRepository {
  constructor() {
    super('/experience', experienceData);
  }

  async getExperiences() {
    return this.getAll();
  }
}

export const experienceService = new ExperienceService();
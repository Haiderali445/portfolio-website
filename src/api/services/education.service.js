import { BaseRepository } from '../core/base.repository';
import { educations } from '../../utils/data/educations';

class EducationService extends BaseRepository {
  constructor() {
    super('/education', educations);
  }

  async getEducations() {
    return this.getAll();
  }
}

export const educationService = new EducationService();
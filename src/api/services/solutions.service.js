import { BaseRepository } from '../core/base.repository';
import { solutionsData } from '../../utils/data/solutionsData';

class SolutionsService extends BaseRepository {
  constructor() {
    super('/solutions', solutionsData);
  }

  async getSolutions() {
    return this.getAll();
  }
}

export const solutionsService = new SolutionsService();
import { BaseRepository } from '../core/base.repository';
import { personalData } from '../../utils/data/personal-data';

class ProfileService extends BaseRepository {
  constructor() {
    super('/profile', personalData);
  }

  async getProfile() {
    return this.getAll();
  }
}

export const profileService = new ProfileService();
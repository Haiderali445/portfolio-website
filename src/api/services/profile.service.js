import { BaseRepository } from '../core/base.repository';
import { personalData } from '../../utils/data/personal-data';
import { logger } from '../core/logger';

class ProfileService extends BaseRepository {
  constructor() {
    super('profile', personalData);
  }

  async getProfile() {
    const start = performance.now();

    if (!this.useBackend && this.localMockData !== null) {
      logger.info(this.endpoint, `[Mock Mode] Serving local mock data for profile`);
      return Promise.resolve(this.localMockData);
    }

    try {
      const { data: profile, error } = await this.supabase
        .from('profile')
        .select('*')
        .eq('id', 1)
        .maybeSingle();

      if (error) throw error;
      if (!profile) return this.localMockData;

      const [titlesRes, interestsRes, focusRes] = await Promise.all([
        this.supabase.from('profile_typewriter_titles').select('title').eq('profile_id', profile.id),
        this.supabase.from('profile_interests').select('interest').eq('profile_id', profile.id),
        this.supabase.from('about_focus').select('*').eq('profile_id', profile.id)
      ]);

      const formattedProfile = {
        ...profile,
        typewriterTitles: titlesRes.data?.map(t => t.title) || this.localMockData.typewriterTitles,
        interests: interestsRes.data?.map(i => i.interest) || this.localMockData.interests,
        aboutFocus: focusRes.data?.length ? focusRes.data : this.localMockData.aboutFocus
      };

      const duration = (performance.now() - start).toFixed(2);
      logger.morgan('GET', `/api/profile/with-relations`, 200, duration);
      logger.success(this.endpoint, `Successfully fetched complete profile dataset`);

      return formattedProfile;
    } catch (error) {
      const duration = (performance.now() - start).toFixed(2);
      logger.morgan('GET', `/api/profile/with-relations`, 500, duration);
      logger.error(this.endpoint, 'Failed to fetch profile from Supabase, falling back to local data', error);
      return this.localMockData;
    }
  }
}

export const profileService = new ProfileService();
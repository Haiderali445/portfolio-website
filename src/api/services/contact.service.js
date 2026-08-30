import { BaseRepository } from '../core/base.repository';
import { logger } from '../core/logger';
import { gmailService } from './gmail.service';

class ContactService extends BaseRepository {
  constructor() {
    super('contact');
  }

  async getContacts() {
    const start = performance.now();

    if (!this.useBackend && this.localMockData !== null) {
      logger.info(this.endpoint, `[Mock Mode] Serving local mock data for contact messages`);
      return Promise.resolve(this.localMockData);
    }

    try {
      const { data, error } = await this.supabase
        .from('contact')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const duration = (performance.now() - start).toFixed(2);
      logger.morgan('GET', `/api/contact`, 200, duration);

      if (!data || data.length === 0) {
        logger.info(this.endpoint, `Table empty, no contact messages found`);
        return [];
      }

      logger.success(this.endpoint, `Successfully fetched contact messages (${data.length} records)`);
      return data;
    } catch (error) {
      const duration = (performance.now() - start).toFixed(2);
      logger.morgan('GET', `/api/contact`, 500, duration);
      logger.error(this.endpoint, 'Failed to fetch contact messages from Supabase', error);
      return [];
    }
  }

  async sendForm(formElement) {
    if (this.useBackend) {
      try {
        const formData = new FormData(formElement);
        const payload = {
          name: formData.get('from_name') || formData.get('name'),
          email: formData.get('from_email') || formData.get('email'),
          message: formData.get('message'),
        };
        await this.create(payload);
      } catch (error) {
        logger.error(this.endpoint, 'Failed to save contact submission to Supabase backend, continuing with EmailJS', error);
      }
    }

    return gmailService.sendDirectMail(formElement, {
      origin_mode: 'Direct Visitor Submission (Human)',
      sendConfirmation: true,
    });
  }
}

export const contactService = new ContactService();

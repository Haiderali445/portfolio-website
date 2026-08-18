import { BaseRepository } from '../core/base.repository';
import emailjs from '@emailjs/browser';
import { logger } from '../core/logger';

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
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      throw new Error('Contact form is not configured. Please set up EmailJS environment variables.');
    }

    if (this.useBackend) {
      try {
        const formData = new FormData(formElement);
        const payload = Object.fromEntries(formData);
        return await this.create(payload);
      } catch (error) {
        logger.error(this.endpoint, 'Failed to save contact submission to Supabase backend, attempting EmailJS fallback', error);
      }
    }

    return emailjs.sendForm(serviceId, templateId, formElement, publicKey);
  }
}

export const contactService = new ContactService();
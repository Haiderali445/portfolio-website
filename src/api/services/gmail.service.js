import { BaseRepository } from '../core/base.repository';
import emailjs from '@emailjs/browser';
import { logger } from '../core/logger';

class GmailService extends BaseRepository {
  constructor() {
    super('gmail_dispatcher');
  }

  async sendDirectMail(formElement, additionalParams = {}) {
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      throw new Error('EmailJS environment variables are not fully configured.');
    }

    try {
      const startTime = performance.now();
      
      let payload = {};
      if (formElement instanceof HTMLFormElement) {
        const formData = new FormData(formElement);
        payload = Object.fromEntries(formData);
      }

      const finalParams = {
        from_name: payload.name || additionalParams.name || 'Portfolio Visitor',
        from_email: payload.email || additionalParams.email || '',
        message: payload.message || additionalParams.message || '',
        to_email: additionalParams.toEmail || import.meta.env.VITE_PORTFOLIO_OWNER_EMAIL || '',
        ...additionalParams,
      };

      const response = await emailjs.send(serviceId, templateId, finalParams, publicKey);
      
      const duration = (performance.now() - startTime).toFixed(2);
      logger.success(this.endpoint, `Successfully dispatched mail via ${serviceId} (${duration}ms)`);
      
      return response;
    } catch (error) {
      logger.error(this.endpoint, 'Failed to dispatch email via EmailJS', error);
      throw error;
    }
  }
}

export const gmailService = new GmailService();
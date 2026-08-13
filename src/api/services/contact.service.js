import { BaseRepository } from '../core/base.repository';
import emailjs from '@emailjs/browser';

class ContactService extends BaseRepository {
  constructor() {
    super('/contact');
  }

  async sendForm(formElement) {
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      throw new Error('Contact form is not configured. Please set up EmailJS environment variables.');
    }

    if (this.useBackend) {
      const formData = new FormData(formElement);
      return this.create(Object.fromEntries(formData));
    }

    return emailjs.sendForm(serviceId, templateId, formElement, publicKey);
  }
}

export const contactService = new ContactService();
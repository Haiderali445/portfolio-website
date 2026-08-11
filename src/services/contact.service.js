import emailjs from '@emailjs/browser';
import { apiClient } from './apiClient';

export const contactService = {
  /**
   * Submits contact form message.
   * Encapsulates third-party / HTTP client operations so UI components call only domain functions.
   *
   * [Backend Swap]: When NestJS backend is live, replace EmailJS call with:
   *   const formData = new FormData(formElement);
   *   return apiClient.post('/contact', Object.fromEntries(formData));
   */
  async sendForm(formElement) {
    const serviceId  = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      throw new Error('Contact form is not configured. Please set up EmailJS environment variables.');
    }

    return emailjs.sendForm(serviceId, templateId, formElement, publicKey);
  }
};

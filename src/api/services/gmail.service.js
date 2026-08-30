import { BaseRepository } from '../core/base.repository';
import emailjs from '@emailjs/browser';
import { logger } from '../core/logger';
import { personalData } from '../../utils/data/personal-data';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value = '') {
  return EMAIL_PATTERN.test(String(value).trim());
}

function resolveOwnerEmail(explicit) {
  return (
    String(explicit || '').trim() ||
    import.meta.env.VITE_PORTFOLIO_OWNER_EMAIL ||
    personalData.email ||
    ''
  );
}

function setNamedValue(formElement, name, value) {
  let input = formElement.querySelector(`[name="${name}"]`);
  if (!input) {
    input = document.createElement('input');
    input.type = 'hidden';
    input.name = name;
    formElement.appendChild(input);
  }
  input.value = value ?? '';
  return input;
}

class GmailService extends BaseRepository {
  constructor() {
    super('gmail_dispatcher');
  }

  getEmailJsConfig() {
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    return { serviceId, templateId, publicKey };
  }

  assertEmailJsConfigured() {
    const { serviceId, templateId, publicKey } = this.getEmailJsConfig();
    if (!serviceId || !templateId || !publicKey) {
      throw new Error('EmailJS environment variables are not fully configured.');
    }
    return { serviceId, templateId, publicKey };
  }

  /**
   * Maps Contact.jsx fields (`name`, `email`, `message`) onto EmailJS template
   * variables (`from_name`, `from_email`, `reply_to`, `to_email`).
   */
  mapFormParameters(formElement, additionalParams = {}) {
    const formData = new FormData(formElement);
    const fromName =
      additionalParams.name ||
      formData.get('from_name') ||
      formData.get('name') ||
      '';
    const fromEmail =
      additionalParams.email ||
      formData.get('from_email') ||
      formData.get('email') ||
      '';
    const message = additionalParams.message || formData.get('message') || '';
    const toEmail = resolveOwnerEmail(additionalParams.toEmail);
    const originMode = additionalParams.origin_mode || 'Direct Visitor Submission (Human)';
    const subject = additionalParams.subject || formData.get('subject') || 'Portfolio inquiry';

    setNamedValue(formElement, 'from_name', fromName);
    setNamedValue(formElement, 'from_email', fromEmail);
    setNamedValue(formElement, 'reply_to', fromEmail);
    setNamedValue(formElement, 'to_email', toEmail);
    setNamedValue(formElement, 'origin_mode', originMode);
    setNamedValue(formElement, 'subject', subject);
    if (message && !formElement.querySelector('[name="message"]')) {
      setNamedValue(formElement, 'message', message);
    }

    return { fromName, fromEmail, message, toEmail, originMode, subject };
  }

  buildTemplateParams(additionalParams = {}) {
    const fromName =
      additionalParams.name ||
      additionalParams.from_name ||
      additionalParams.sender_name ||
      'Ego AI Copilot';
    const fromEmail =
      additionalParams.email ||
      additionalParams.from_email ||
      additionalParams.sender_email ||
      '';
    const toEmail = resolveOwnerEmail(
      additionalParams.toEmail || additionalParams.recipient_email || additionalParams.owner_email
    );
    const message = additionalParams.message || '';
    const subject = additionalParams.subject || 'Portfolio inquiry';

    return {
      from_name: fromName,
      from_email: fromEmail,
      reply_to: fromEmail,
      message,
      subject,
      to_email: toEmail,
      recipient_name: additionalParams.recipient_name || 'Haider Ali',
      sender_name: additionalParams.sender_name || fromName,
      origin_mode: additionalParams.origin_mode || 'Ego AI Autonomous Assistant',
    };
  }

  async sendConfirmationCopy({ fromName, fromEmail, toEmail, originalMessage, subject }) {
    if (!isValidEmail(fromEmail) || fromEmail.toLowerCase() === String(toEmail).toLowerCase()) {
      return { skipped: true };
    }

    const { serviceId, templateId, publicKey } = this.assertEmailJsConfigured();
    const confirmationParams = {
      from_name: 'Ego Copilot',
      from_email: toEmail || fromEmail,
      reply_to: toEmail,
      to_email: fromEmail,
      subject: `Copy: ${subject || 'Your message to Haider Ali'}`,
      origin_mode: 'Ego AI Sender Confirmation',
      message: `Hi ${fromName || 'there'},\n\nThis is a confirmation that your message was delivered to Haider Ali. He will reply to ${fromEmail}.\n\n--- Original message ---\n${originalMessage || '(no body)'}`,
    };

    await emailjs.send(serviceId, templateId, confirmationParams, { publicKey });
    logger.info(this.endpoint, `Sent confirmation copy to sender (${fromEmail})`);
    return { skipped: false };
  }

  async sendDirectMail(formElement, additionalParams = {}) {
    const { serviceId, templateId, publicKey } = this.assertEmailJsConfigured();
    const sendConfirmation = additionalParams.sendConfirmation !== false;

    try {
      const startTime = performance.now();
      let mapped;
      let response;

      if (formElement instanceof HTMLFormElement) {
        mapped = this.mapFormParameters(formElement, additionalParams);

        if (!mapped.toEmail) {
          throw new Error('Portfolio owner email (to_email) is missing. Set VITE_PORTFOLIO_OWNER_EMAIL.');
        }

        response = await emailjs.sendForm(serviceId, templateId, formElement, { publicKey });
      } else {
        mapped = this.buildTemplateParams(additionalParams);

        if (!mapped.to_email) {
          throw new Error('Portfolio owner email (to_email) is missing. Set VITE_PORTFOLIO_OWNER_EMAIL.');
        }

        response = await emailjs.send(serviceId, templateId, mapped, { publicKey });
        mapped = {
          fromName: mapped.from_name,
          fromEmail: mapped.from_email,
          message: mapped.message,
          toEmail: mapped.to_email,
          subject: mapped.subject,
        };
      }

      if (sendConfirmation && isValidEmail(mapped.fromEmail)) {
        try {
          await this.sendConfirmationCopy({
            fromName: mapped.fromName,
            fromEmail: mapped.fromEmail,
            toEmail: mapped.toEmail,
            originalMessage: mapped.message,
            subject: mapped.subject,
          });
        } catch (confirmError) {
          logger.error(this.endpoint, 'Owner mail sent, but sender confirmation copy failed', confirmError);
        }
      }

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

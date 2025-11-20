import React, { useRef } from 'react';
import emailjs from '@emailjs/browser';
import './Contact.css';
import { contactsData } from '../../utils/data/contactsData';
import toast from 'react-hot-toast';
import {
  FaGithub,
  FaLinkedin,
  FaInstagram,
  FaWhatsapp,
  FaEnvelope,
} from 'react-icons/fa';

const Contact = () => {
  const form = useRef();
  const { email, phone, github, instagram, linkedIn } = contactsData;

  const sendEmail = (e) => {
    e.preventDefault();
    
    // Show loading toast
    const loadingToast = toast.loading('Sending message...');
    
    emailjs
      .sendForm('service_fbo485p', 'template_fa82428', form.current, 'dXT9wdRoCleHwfiYg')
      .then(() => {
        toast.success('Message sent successfully! 🎉', { id: loadingToast });
        e.target.reset();
      })
      .catch((error) => {
        console.error(error);
        toast.error('Something went wrong. Please try again.', { id: loadingToast });
      });
  };

  return (
    <section id="contact" className="contact-section">
      <h2 className="contact-heading">Contact Me</h2>

      <div className="contact-wrapper">
        {/* Left: Form */}
        <form ref={form} onSubmit={sendEmail} className="contact-form">
          <h3 className="form-title">Send me a message</h3>

          <div className="form__group">
            <input
              type="text"
              name="title"
              id="title"
              className="form__input"
              placeholder=" "
              required
            />
            <label htmlFor="title" className="form__label">
              Subject
            </label>
          </div>

          <div className="form__group">
            <input
              type="text"
              name="name"
              id="name"
              className="form__input"
              placeholder=" "
              required
            />
            <label htmlFor="name" className="form__label">
              Your Name
            </label>
          </div>

          <div className="form__group">
            <input
              type="email"
              name="email"
              id="email"
              className="form__input"
              placeholder=" "
              required
            />
            <label htmlFor="email" className="form__label">
              Your Email
            </label>
          </div>

          <div className="form__group">
            <input
              type="text"
              name="time"
              id="time"
              className="form__input"
              placeholder=" "
              defaultValue={new Date().toLocaleString()}
              readOnly
            />
            <label htmlFor="time" className="form__label">
              Time
            </label>
          </div>

          <div className="form__group">
            <textarea
              name="message"
              id="message"
              rows="4"
              className="form__input"
              placeholder=" "
              required
            />
            <label htmlFor="message" className="form__label">
              Message
            </label>
          </div>

          <button type="submit" className="submit-btn">
            Send Message
          </button>
        </form>

        {/* Right: Socials */}
        <div className="contact-socials">
          <h3 className="socials-title">Connect with me</h3>

          <div className="social-links">
            <a href={github} className="social-link" target="_blank" rel="noopener noreferrer">
              <FaGithub /> GitHub
            </a>
            <a href={linkedIn} className="social-link" target="_blank" rel="noopener noreferrer">
              <FaLinkedin /> LinkedIn
            </a>
            <a href={instagram} className="social-link" target="_blank" rel="noopener noreferrer">
              <FaInstagram /> Instagram
            </a>
          </div>

          <div className="contact-methods">
            <a
              href={`https://wa.me/${phone}?text=Hello Haider, I want to discuss a project.`}
              className="contact-method"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaWhatsapp /> WhatsApp
            </a>
            <a
              href={`mailto:${email}?subject=Project%20Inquiry&body=Hello%20Haider%2C%0AI'm%20reaching%20out%20to%20discuss%20a%20potential%20project.`}
              className="contact-method"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaEnvelope /> Gmail
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

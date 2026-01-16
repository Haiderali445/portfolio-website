import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { contactsData } from '../../utils/data/contactsData';
import toast from 'react-hot-toast';
import { FaGithub, FaLinkedin, FaInstagram, FaWhatsapp, FaEnvelope } from 'react-icons/fa';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const ContactField = ({ id, label, type = "text", name, ...props }) => {
  return (
    <div className="relative group">
      {type === 'textarea' ? (
        <textarea
          id={id}
          name={name}
          placeholder=" "
          className="peer w-full bg-glass border border-glass-border rounded-lg px-4 py-3 pt-5 text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-y min-h-[120px]"
          {...props}
        />
      ) : (
        <input
          type={type}
          id={id}
          name={name}
          placeholder=" "
          className="peer w-full bg-glass border border-glass-border rounded-lg px-4 py-3 pt-5 text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          {...props}
        />
      )}

      <label
        htmlFor={id}
        className="absolute left-4 top-1 text-xs text-text-muted transition-all 
                   peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
                   peer-focus:top-1 peer-focus:text-xs peer-focus:text-primary"
      >
        {label}
      </label>
    </div>
  );
};

const Contact = () => {
  const form = useRef();
  const { email, phone, github, instagram, linkedIn } = contactsData;

  const sendEmail = (e) => {
    e.preventDefault();
    const loadingToast = toast.loading('Sending message...');

    // Use Environment Variables for Security
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_fbo485p'; // Fallback for dev if env not set
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_fa82428';
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'dXT9wdRoCleHwfiYg';

    emailjs
      .sendForm(serviceId, templateId, form.current, publicKey)
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
    <section id="contact" className="py-24 relative z-10">
      <div className="container mx-auto px-4 max-w-5xl">
        <h2 className="text-4xl md:text-5xl font-sans font-bold mb-16 text-center text-gradient">
          Get in Touch
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          {/* Left: Form */}
          <div className="glass-card p-8 rounded-3xl">
            <h3 className="text-2xl font-semibold mb-6 text-white">Send me a message</h3>
            <form ref={form} onSubmit={sendEmail} className="space-y-6">
              <ContactField id="title" name="title" label="Subject" required />
              <ContactField id="name" name="name" label="Your Name" required />
              <ContactField id="email" name="email" type="email" label="Your Email" required />
              <ContactField id="message" name="message" type="textarea" label="Message" required />

              <button
                type="submit"
                className="w-full py-4 bg-primary text-black font-semibold rounded-lg hover:bg-primary/90 transition-colors shadow-[0_0_20px_rgba(0,234,255,0.3)] hover:shadow-[0_0_30px_rgba(0,234,255,0.5)]"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Right: Socials & Info */}
          <div className="flex flex-col justify-center space-y-12">
            <div>
              <h3 className="text-2xl font-semibold mb-6 text-white">Connect with me</h3>
              <p className="text-text-muted mb-8 leading-relaxed">
                I'm currently open to new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!
              </p>

              <div className="flex gap-4 mb-10">
                {[
                  { icon: FaGithub, link: github, label: "GitHub" },
                  { icon: FaLinkedin, link: linkedIn, label: "LinkedIn" },
                  { icon: FaInstagram, link: instagram, label: "Instagram" }
                ].map((social, i) => (
                  <a
                    key={i}
                    href={social.link}
                    target="_blank"
                    rel="noreferrer"
                    className="p-4 bg-glass border border-glass-border rounded-full hover:bg-white/10 hover:border-white/20 transition-all group"
                    aria-label={social.label}
                  >
                    <social.icon size={24} className="text-text-muted group-hover:text-white transition-colors" />
                  </a>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-4 p-4 glass-card rounded-xl hover:bg-white/5 transition-colors"
              >
                <div className="p-3 bg-primary/10 rounded-full text-primary">
                  <FaEnvelope size={20} />
                </div>
                <div>
                  <div className="text-xs text-text-muted">Email</div>
                  <div className="text-white font-mono text-sm md:text-base">{email}</div>
                </div>
              </a>
              <a
                href={`https://wa.me/${phone}`}
                className="flex items-center gap-4 p-4 glass-card rounded-xl hover:bg-white/5 transition-colors"
                target="_blank"
                rel="noreferrer"
              >
                <div className="p-3 bg-green-500/10 rounded-full text-green-400">
                  <FaWhatsapp size={20} />
                </div>
                <div>
                  <div className="text-xs text-text-muted">WhatsApp</div>
                  <div className="text-white font-mono text-sm md:text-base">{phone}</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

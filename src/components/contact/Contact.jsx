import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import toast from 'react-hot-toast';
import { FaGithub, FaLinkedin, FaInstagram, FaWhatsapp, FaEnvelope } from 'react-icons/fa';

const ContactField = ({ id, label, type = "text", name, ...props }) => {
  return (
    <div className="relative group">
      {type === 'textarea' ? (
        <textarea
          id={id}
          name={name}
          placeholder=" "
          className="peer w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 pt-5 text-white outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all resize-y min-h-[120px]"
          {...props}
        />
      ) : (
        <input
          type={type}
          id={id}
          name={name}
          placeholder=" "
          className="peer w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 pt-5 text-white outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all"
          {...props}
        />
      )}
      <label
        htmlFor={id}
        className="absolute left-4 top-1 text-xs text-gray-400 transition-all 
                   peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500
                   peer-focus:top-1 peer-focus:text-xs peer-focus:text-cyan-400"
      >
        {label}
      </label>
    </div>
  );
};

const Contact = ({ contactInfo }) => {
  const form = useRef();
  const [loading, setLoading] = useState(false);

  // Fallback data if props are missing
  const data = contactInfo || {
    email: "rajahaider7896@gmail.com",
    phone: "+923225629058",
    github: "#",
    linkedin: "#",
    instagram: "#"
  };

  const handleSend = (e) => {
    e.preventDefault();
    setLoading(true);

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    emailjs.sendForm(serviceId, templateId, form.current, publicKey)
      .then(() => {
        toast.success('Message sent successfully!');
        e.target.reset();
      }, (error) => {
        console.error(error);
        toast.error('Failed to send message.');
      })
      .finally(() => setLoading(false));
  };

  return (
    <section id="contact" className="py-24 relative z-10 bg-[#050505]">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* Info Side */}
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white">
              Get in <span className="text-gray-500">Touch</span>
            </h2>
            <p className="text-gray-400 mb-12 text-lg max-w-md">
              Have a project in mind or want to discuss AI? I'm open to new connections.
            </p>

            <div className="space-y-6">
              <a href={`mailto:${data.email}`} className="flex items-center gap-6 group">
                <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-cyan-400 transition-all">
                  <FaEnvelope size={24} className="text-white group-hover:text-black" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-widest">Email</p>
                  <p className="text-xl font-bold text-white">{data.email}</p>
                </div>
              </a>

              <a href={`https://wa.me/${data.phone?.replace(/[^0-9]/g, '')}`} className="flex items-center gap-6 group">
                <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-green-500 transition-all">
                  <FaWhatsapp size={24} className="text-white group-hover:text-black" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-widest">WhatsApp</p>
                  <p className="text-xl font-bold text-white">{data.phone}</p>
                </div>
              </a>

              <div className="flex gap-4 mt-8">
                {[
                  { icon: FaGithub, link: data.github },
                  { icon: FaLinkedin, link: data.linkedin },
                  { icon: FaInstagram, link: data.instagram }
                ].map((social, i) => (
                  <a key={i} href={social.link} target="_blank" rel="noreferrer"
                    className="p-4 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-all">
                    <social.icon size={22} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="bg-white/[0.03] p-8 rounded-3xl border border-white/[0.08] backdrop-blur-md">
            <h3 className="text-2xl font-semibold mb-6 text-white">Send a message</h3>
            <form ref={form} onSubmit={handleSend} className="space-y-6">
              <ContactField id="name" name="name" label="Your Name" required />
              <ContactField id="email" name="email" type="email" label="Your Email" required />
              <ContactField id="message" name="message" type="textarea" label="Message" required />

              <button
                type="submit"
                className="w-full py-4 bg-cyan-400 text-black font-bold rounded-lg hover:bg-cyan-300 transition-all shadow-[0_0_20px_rgba(0,234,255,0.2)]"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

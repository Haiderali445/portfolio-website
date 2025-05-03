import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPaperPlane } from 'react-icons/fa';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    type: 'success',  // 'success' or 'error'
    message: 'Your message has been sent!',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Set submitting state to true and reset previous notifications
    setIsSubmitting(true);
    setNotification({ show: false, type: 'success', message: 'Your message has been sent!' });

    try {
      // Simulate the form submission (can replace with real API)
      const response = await fetch('https://formspree.io/f/xgvkanly', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // If successful, show success message
        setNotification({
          show: true,
          type: 'success',
          message: 'Message sent successfully!',
        });
      } else {
        // If submission fails, show error message
        setNotification({
          show: true,
          type: 'error',
          message: 'Something went wrong. Please try again.',
        });
      }
    } catch (error) {
      // Handle errors
      setNotification({
        show: true,
        type: 'error',
        message: 'Network error. Please check your connection.',
      });
    } finally {
      setIsSubmitting(false);
      // Reset form data
      setFormData({
        name: '',
        email: '',
        message: '',
      });

      // Hide notification after 2 seconds
      setTimeout(() => {
        setNotification({ show: false, type: 'success', message: '' });
      }, 15000) 
    }
  };

  return (
    <section className="min-h-screen flex justify-center items-center bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-6">
      {/* Notification Popup */}
      {notification.show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className={`fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50`}
        >
          <div
            className={`${
              notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            } text-white p-6 rounded-xl shadow-lg text-center`}
          >
            <p className="text-2xl font-bold">{notification.message}</p>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="bg-white bg-opacity-10 backdrop-blur-lg shadow-lg rounded-xl p-8 w-full max-w-md text-white"
      >
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-3xl font-extrabold text-center mb-6"
        >
          Get In Touch
        </motion.h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name Field */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <label htmlFor="name" className="block mb-2 text-lg">Your Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="John Doe"
              required
              className="w-full p-3 rounded-lg bg-black bg-opacity-20 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </motion.div>

          {/* Email Field */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <label htmlFor="email" className="block mb-2 text-lg">Your Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="johndoe@example.com"
              required
              className="w-full p-3 rounded-lg bg-black bg-opacity-20 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </motion.div>

          {/* Message Field */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <label htmlFor="message" className="block mb-2 text-lg">Your Message</label>
            <textarea
              id="message"
              name="message"
              rows="3"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="What would you like to discuss?"
              required
              className="w-full p-3 rounded-lg bg-black bg-opacity-20 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </motion.div>

          {/* Animated Submit Button */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05, rotate: 2 }}
            whileTap={{ scale: 0.95, rotate: -1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="w-full flex justify-center items-center gap-3 px-6 py-3 rounded-2xl bg-yellow-400 text-black font-bold text-lg shadow-md hover:shadow-xl"
            disabled={isSubmitting}  // Disable button during submission
          >
            {isSubmitting ? 'Sending...' : 'Send'} <FaPaperPlane />
          </motion.button>
        </form>
      </motion.div>
    </section>
  );
}

export default Contact;

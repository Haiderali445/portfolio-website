import React from 'react';
import { motion } from 'framer-motion';
import { FaPaperPlane } from 'react-icons/fa';

function Contact() {
  return (
    <section className="min-h-screen flex justify-center items-center bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-6">
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

        <form action="https://formspree.io/f/xgvkanly" method="POST" className="space-y-5">
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
          >
            Send <FaPaperPlane />
          </motion.button>
        </form>
      </motion.div>
    </section>
  );
}

export default Contact;
``
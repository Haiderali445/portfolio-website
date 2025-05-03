// src/components/Hero.jsx
import React from 'react';
import { Typewriter } from 'react-simple-typewriter';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaReact } from 'react-icons/fa';

function Hero() {
  return (
    <section className="relative flex justify-center items-center h-screen overflow-hidden bg-gradient-to-r from-purple-500 via-blue-500 to-teal-500">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black opacity-40"></div>

      {/* Floating icons */}
      <FaReact className="absolute text-cyan-400 text-6xl top-10 left-10 animate-spin-slow" />
      <FaGithub className="absolute text-gray-200 text-5xl bottom-16 right-10 animate-bounce" />
      <FaLinkedin className="absolute text-blue-300 text-5xl top-1/2 right-12 animate-pulse" />

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="z-10 text-center text-white p-6 max-w-2xl"
      >
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-4xl md:text-6xl font-bold mb-4"
        >
          Hello, I'm <span className="text-yellow-300">Haider</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1, duration: 1 }}
          className="text-lg md:text-2xl"
        >
          <Typewriter
            words={['React Developer', 'MERN Stack Enthusiast', 'Software Engineer']}
            loop
            cursor
            cursorStyle="_"
            typeSpeed={90}
            deleteSpeed={40}
            delaySpeed={1200}
          />
        </motion.p>

        {/* Call-to-action button */}
        <motion.a
          href="#contact"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="inline-block mt-8 px-8 py-3 bg-yellow-400 text-black font-semibold rounded-lg shadow-lg hover:bg-yellow-300 transition"
        >
          Contact Me
        </motion.a>
      </motion.div>
    </section>
  );
}

export default Hero;

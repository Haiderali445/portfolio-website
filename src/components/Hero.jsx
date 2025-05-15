import React, { useState } from 'react';
import { Typewriter } from 'react-simple-typewriter';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaReact, FaSun, FaMoon } from 'react-icons/fa';
import myPic from '../Assets/images/pic1.jpg';

function Hero() {
  const [darkMode, setDarkMode] = useState(false);
  const toggleTheme = () => setDarkMode(!darkMode);

  return (
    <section
      className={`relative flex items-center justify-center min-h-screen px-4 ${
        darkMode
          ? 'bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-700'
          : 'bg-gradient-to-tr from-purple-600 via-blue-500 to-teal-400'
      } transition-colors duration-500`}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-0" />

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 z-10 bg-yellow-300 text-black p-3 rounded-full shadow-lg hover:bg-yellow-400 transition"
        aria-label="Toggle Theme"
      >
        {darkMode ? <FaSun /> : <FaMoon />}
      </button>

      {/* Animated Icons */}
      <FaReact className="absolute text-cyan-300 text-6xl top-10 left-6 animate-spin-slow hover:scale-110 transition z-10" />
      <FaGithub className="absolute text-white text-5xl bottom-10 right-6 animate-bounce hover:scale-110 transition z-10" />
      <FaLinkedin className="absolute text-blue-200 text-5xl top-1/2 right-8 animate-pulse hover:scale-110 transition z-10" />

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 flex flex-col md:flex-row items-center gap-8 max-w-6xl mx-auto text-white"
      >
        {/* Image */}
        <motion.div
          className="relative w-40 h-40 sm:w-48 sm:h-48 md:w-60 md:h-60 transform skew-y-6 overflow-hidden shadow-2xl rounded-xl"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05, rotate: 4 }}
          transition={{ delay: 0.2, duration: 1 }}
        >
          <img
            src={myPic}
            alt="Haider"
            className="w-full h-full object-cover transform -skew-y-8"
          />
          <div className="absolute inset-0 border-4 border-yellow-300 rounded-xl pointer-events-none" />
        </motion.div>

        {/* Text */}
        <div className="text-center md:text-left max-w-xl px-2">
          <motion.h1
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight"
          >
            Hello, I’m{' '}
            <span className="text-yellow-300 dark:text-yellow-400">Haider</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="text-lg md:text-xl mb-6"
          >
            <Typewriter
              words={[
                'Software Engineer',
                'Full-Stack Developer',
                'MERN Specialist',
                'Building Scalable Web Apps',
              ]}
              loop
              cursor
              cursorStyle="_"
              typeSpeed={70}
              deleteSpeed={40}
              delaySpeed={1200}
            />
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="flex flex-col sm:flex-row justify-center md:justify-start items-center gap-4"
          >
            <a
              href="#contact"
              className="w-full sm:w-auto px-6 py-3 bg-yellow-400 text-black font-semibold rounded-lg shadow-md hover:bg-yellow-300 transition transform hover:scale-105"
            >
              ✉️ Get in Touch
            </a>
            <a
              href="https://github.com/haiderali445"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg shadow-md hover:bg-gray-800 transition transform hover:scale-105"
            >
              💻 GitHub
            </a>
            <a
              href="https://linkedin.com/in/hayder-ali-8a025b290"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-500 transition transform hover:scale-105"
            >
              🔗 LinkedIn
            </a>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

export default Hero;

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
      className={`relative flex justify-center items-center h-screen ${
        darkMode
          ? 'bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-700'
          : 'bg-gradient-to-tr from-purple-600 via-blue-500 to-teal-400'
      } transition-colors duration-500`}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 bg-yellow-300 text-black p-3 rounded-full shadow-lg hover:bg-yellow-400 transition"
        aria-label="Toggle Theme"
      >
        {darkMode ? <FaSun /> : <FaMoon />}
      </button>

      {/* Floating Icons */}
      <FaReact className="absolute text-cyan-300 text-7xl top-12 left-12 animate-spin-slow hover:scale-110 transition" />
      <FaGithub className="absolute text-gray-100 text-6xl bottom-20 right-14 animate-bounce hover:scale-110 transition" />
      <FaLinkedin className="absolute text-blue-200 text-6xl top-1/3 right-16 animate-pulse hover:scale-110 transition" />

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="z-10 flex flex-col md:flex-row items-center text-white max-w-5xl px-6"
      >
        <motion.div
          className="relative w-60 h-60 mb-8 md:mb-0 md:mr-12 transform skew-y-6 overflow-hidden shadow-2xl rounded-xl"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05, rotate: 4 }}
          transition={{ delay: 0.2, duration: 1 }}
        >
          <img
            src={myPic}
            alt="Haider"
            className="w-full h-full object-cover transform -skew-y-6 scale-116"
          />
          <div className="absolute inset-0 border-4 border-yellow-300 rounded-xl"></div>
        </motion.div>

        {/* Text Content */}
        <div className="text-center md:text-left">
          <motion.h1
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight"
          >
            Hello, I’m{' '}
            <span className="text-yellow-300 dark:text-yellow-400">Haider</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="text-lg md:text-2xl mb-6 max-w-xl"
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="flex justify-center md:justify-start gap-4"
          >
            <a
              href="#contact"
              className="inline-block px-8 py-3 bg-yellow-400 text-black font-bold rounded-lg shadow-xl hover:bg-yellow-300 transition transform hover:scale-105"
            >
              Get in Touch
            </a>
            <a
              href="https://github.com/haiderali445"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-3 bg-gray-800 text-white font-bold rounded-lg shadow-xl hover:bg-gray-700 transition transform hover:scale-105"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/hayder-ali-8a025b290"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-xl hover:bg-blue-500 transition transform hover:scale-105"
            >
              LinkedIn
            </a>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

export default Hero;

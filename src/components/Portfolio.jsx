// src/components/Portfolio.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FaLink, FaGithub } from 'react-icons/fa';

const projects = [
  {
    title: 'Point of Sale (MERN)',
    description: 'A full-featured Point of Sale system built with the MERN stack, offering inventory, billing, and reporting functionalities.',
    link: '', // No live link provided for POS
    github: 'https://github.com/Haiderali445/mern-pos',
    image: 'https://cdn.pixabay.com/photo/2017/05/10/17/45/pos-2308044_1280.jpg', // Image for POS project
  },
  {
    title: 'My Blog',
    description: 'A personal blogging website showcasing my articles, powered by Vite and React.',
    link: 'https://haideraliblog.netlify.app/',
    github: 'https://github.com/Haiderali445/portfolio-website',
    image: 'https://cdn.pixabay.com/photo/2015/01/08/18/29/startup-593341_1280.jpg', // Image for Blog project
  },
]

function Portfolio() {
  return (
    <section className="min-h-screen bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 p-6">
      <h1 className="text-4xl font-bold text-center text-white mb-12">My Creative Projects</h1>
      
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {projects.map((project, index) => (
          <motion.div
            key={index}
            className="relative group transform transition duration-300 hover:scale-105"
          >
            <div className="flip-card w-full h-full bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="flip-card-inner h-full">
                <div className="flip-card-front bg-gradient-to-r from-teal-400 to-blue-500 text-white p-6">
                  <h3 className="text-xl font-semibold mb-4">{project.title}</h3>
                  <p>{project.description}</p>
                </div>
                <div className="flip-card-back bg-gray-800 text-white p-6 flex flex-col justify-between">
                  <h3 className="text-xl font-semibold mb-4">Details</h3>
                  <p>Learn more about the project and its technologies.</p>
                  <div className="flex gap-4 mt-4">
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:text-yellow-500">
                      <FaLink size={24} />
                    </a>
                    <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:text-yellow-500">
                      <FaGithub size={24} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

export default Portfolio;

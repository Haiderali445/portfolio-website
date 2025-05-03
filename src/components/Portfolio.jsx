// src/components/Portfolio.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FaLink, FaGithub } from 'react-icons/fa';

const projects = [
  {
    title: 'Project One',
    description: 'A brief description of the project.',
    link: 'https://example.com',
    github: 'https://github.com/example',
  },
  {
    title: 'Project Two',
    description: 'A brief description of the project.',
    link: 'https://example.com',
    github: 'https://github.com/example',
  },
  {
    title: 'Project Three',
    description: 'A brief description of the project.',
    link: 'https://example.com',
    github: 'https://github.com/example',
  },
];

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

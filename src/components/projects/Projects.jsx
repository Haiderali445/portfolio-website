import React, { useEffect, useState } from 'react';
import { projectsData as initialData } from '../../utils/data/projects-data';
import { FaGithub, FaEye } from 'react-icons/fa';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'framer-motion';
import MagneticButton from '../helper/MagneticButton';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  // Mock API Fetch
  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 800));
        setProjects(initialData);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const visibleProjects = expanded ? projects : projects.slice(0, 4);

  if (isLoading) {
    return (
      <section id="projects" className="py-24 relative z-10">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-spin-slow w-12 h-12 border-t-2 border-primary rounded-full mx-auto" />
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-32 relative z-10">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <h2 className="text-4xl md:text-5xl font-sans font-bold mb-4 text-center text-white">
          Selected <span className="text-text-muted">Works</span>
        </h2>
        <p className="text-center text-text-muted mb-16 max-w-xl mx-auto">
          A curated selection of projects that demonstrate my technical capabilities and product design sensibilities.
        </p>

        {/* Bento Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[400px]"
        >
          <AnimatePresence>
            {visibleProjects.map((project, index) => {
              // Asymmetrical grid logic: 
              // Every 1st item spans 2 cols on large screens
              // Every 4th item spans 2 cols
              const isFeatured = index === 0 || index === 3;

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  key={project.id}
                  className={cn(
                    "group relative overflow-hidden rounded-3xl glass-card transition-all duration-500 hover:border-white/20",
                    isFeatured ? "md:col-span-2" : "col-span-1"
                  )}
                >
                  {/* Image Background */}
                  <div className="absolute inset-0 w-full h-full transform transition-transform duration-700 group-hover:scale-105">
                    <div className="absolute inset-0 bg-[#0a0a0a] z-0" />
                    {project.images && (
                      <img
                        src={project.images}
                        alt={project.name}
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-500"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent opacity-90" />
                  </div>

                  {/* Content */}
                  <div className="relative z-10 p-8 h-full flex flex-col justify-end">
                    {project.inprogress && (
                      <div className="absolute top-6 right-6 px-3 py-1 bg-yellow-500/10 text-yellow-300 text-xs font-mono rounded-full border border-yellow-500/20 backdrop-blur-md">
                        WIP
                      </div>
                    )}

                    <div className="transform transition-transform duration-500 translate-y-4 group-hover:translate-y-0">
                      <h3 className="text-2xl md:text-3xl font-semibold mb-3 text-white">
                        {project.name}
                      </h3>

                      <p className="text-text-muted text-sm md:text-base line-clamp-2 md:line-clamp-3 mb-6 max-w-lg">
                        {project.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-8">
                        {project.tools.slice(0, 4).map((tool, i) => (
                          <span key={i} className="text-xs font-mono text-white/70 bg-white/5 px-2 py-1 rounded border border-white/5">
                            {tool}
                          </span>
                        ))}
                        {project.tools.length > 4 && (
                          <span className="text-xs font-mono text-white/50 px-2 py-1">+{project.tools.length - 4}</span>
                        )}
                      </div>

                      <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                        {project.code && (
                          <a
                            href={project.code}
                            target="_blank"
                            rel="noreferrer"
                            className="p-3 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-colors"
                          >
                            <FaGithub size={20} />
                          </a>
                        )}
                        {project.demo && (
                          <a
                            href={project.demo}
                            target="_blank"
                            rel="noreferrer"
                            className="px-6 py-3 bg-white text-black font-medium rounded-full hover:bg-gray-200 transition-colors flex items-center gap-2"
                          >
                            <FaEye size={18} /> View Live
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* View All Button */}
        {!expanded && projects.length > 4 && (
          <div className="mt-16 flex justify-center">
            <MagneticButton onClick={() => setExpanded(true)}>
              <div className="relative px-8 py-4 bg-transparent text-white font-mono text-sm tracking-widest uppercase rounded-full border border-primary/30 hover:bg-primary/10 transition-all duration-300 shadow-[0_0_20px_rgba(0,234,255,0.1)] hover:shadow-[0_0_30px_rgba(0,234,255,0.2)]">
                View All Projects
              </div>
            </MagneticButton>
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;
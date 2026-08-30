import React, { useState } from 'react';
import { FaGithub, FaEye } from 'react-icons/fa';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'framer-motion';
import MagneticButton from '../helper/MagneticButton';
import { getGitHubAvatar } from '../../utils/github';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const ProjectsSkeleton = () => (
  <section id="projects" className="py-32 relative z-10">
    <div className="container mx-auto px-4 md:px-8 max-w-7xl">
      <div className="mb-8 h-10 w-64 mx-auto rounded-full skeleton-shimmer bg-white/[0.06]" />
      <div className="mb-16 h-4 w-80 mx-auto rounded-full skeleton-shimmer bg-white/[0.05]" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[400px] grid-flow-dense">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className={cn(
              "rounded-3xl border border-white/[0.08] bg-white/[0.03] p-8",
              index % 3 === 0 ? "md:col-span-2 lg:col-span-2" : "col-span-1"
            )}
          >
            <div className="h-full flex flex-col justify-end">
              <div className="mb-4 h-4 w-24 rounded-full skeleton-shimmer bg-white/[0.06]" />
              <div className="mb-4 h-8 w-3/4 rounded-xl skeleton-shimmer bg-white/[0.07]" />
              <div className="mb-6 space-y-3">
                <div className="h-4 w-full rounded-full skeleton-shimmer bg-white/[0.05]" />
                <div className="h-4 w-11/12 rounded-full skeleton-shimmer bg-white/[0.05]" />
                <div className="h-4 w-1/2 rounded-full skeleton-shimmer bg-white/[0.05]" />
              </div>
              <div className="mb-8 flex flex-wrap gap-2">
                {Array.from({ length: 4 }).map((__, tagIndex) => (
                  <div key={tagIndex} className="h-8 w-20 rounded-full skeleton-shimmer bg-white/[0.06]" />
                ))}
              </div>
              <div className="h-12 w-full rounded-full skeleton-shimmer bg-white/[0.05]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Projects = ({ projects = [], personalData = {}, isLoading = false }) => {
  const [expanded, setExpanded] = useState(false);

  if (isLoading) {
    return <ProjectsSkeleton />;
  }

  if (!projects || projects.length === 0) return null;

  const visibleProjects = expanded ? projects : projects.slice(0, 4);

  return (
    <section id="projects" className="py-32 relative z-10">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <h2 className="text-4xl md:text-5xl font-sans font-bold mb-4 text-center text-white">
          Selected <span className="text-text-muted">Works</span>
        </h2>
        <p className="text-center text-text-muted mb-16 max-w-xl mx-auto">
          {personalData.projectsSectionSubtitle}
        </p>

        {isLoading ? (
          <ProjectsSkeleton />
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[400px] grid-flow-dense"
          >
            <AnimatePresence>
              {visibleProjects.map((project, index) => {
              // Every 3rd item (0, 3, 6...) spans 2 columns
              const isFeatured = index % 3 === 0;

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  key={project.id}
                  className={cn(
                    "group relative overflow-hidden rounded-3xl glass-card transition-all duration-500 hover:border-white/20",
                    isFeatured ? "md:col-span-2 lg:col-span-2" : "col-span-1"
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
                    
                    {/* Top Right WIP Badge */}
                    {(project.inProgress || project.inprogress) && (
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
                        {project.tools && project.tools.slice(0, 4).map((tool, i) => (
                          <span key={i} className="text-xs font-mono text-white/70 bg-white/5 px-2 py-1 rounded border border-white/5">
                            {tool}
                          </span>
                        ))}
                        {project.tools && project.tools.length > 4 && (
                          <span className="text-xs font-mono text-white/50 px-2 py-1">+{project.tools.length - 4}</span>
                        )}
                      </div>

                      {/* Bottom Action Row */}
                      <div className="flex items-center justify-between gap-4">
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

                        {/* Contributor Overlapping Stack */}
                        {project.contributors && project.contributors.length > 0 && (
                          <div className="flex items-center -space-x-2 overflow-hidden bg-background/60 backdrop-blur-md p-1 rounded-full border border-white/10 ml-auto shadow-lg shrink-0">
                            {project.contributors.map((contributor, i) => {
                              const githubIdOrUrl = contributor.github || contributor.profileUrl;
                              const avatarSrc = getGitHubAvatar(githubIdOrUrl, 56);

                              return (
                                <a
                                  key={i}
                                  href={contributor.profileUrl || `https://github.com/${contributor.github}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  title={contributor.name}
                                  className="inline-block transition-transform duration-300 hover:scale-125 hover:z-30 hover:-translate-y-1"
                                >
                                  <img
                                    src={avatarSrc}
                                    alt={contributor.name || 'Contributor'}
                                    loading="eager"
                                    decoding="async"
                                    className="w-7 h-7 rounded-full object-cover ring-2 ring-background bg-slate-800 shadow-sm"
                                  />
                                </a>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}

        {/* View All Button */}
        {!isLoading && projects.length > 4 && (
          <div className="mt-16 flex justify-center">
            <MagneticButton onClick={() => setExpanded(!expanded)}>
              <div className="relative px-8 py-4 bg-transparent text-white font-mono text-sm tracking-widest uppercase rounded-full border border-primary/30 hover:bg-primary/10 transition-all duration-300 shadow-[0_0_20px_rgba(0,234,255,0.1)] hover:shadow-[0_0_30px_rgba(0,234,255,0.2)]">
                {expanded ? 'Show Less Projects' : `View All Projects (${projects.length})`}
              </div>
            </MagneticButton>
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;
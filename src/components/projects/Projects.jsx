import React, { useState } from 'react';
import { FaGithub, FaEye } from 'react-icons/fa';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import MagneticButton from '../helper/MagneticButton';
import { getGitHubAvatar } from '../../utils/github';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const ProjectsSkeleton = () => (
  <section id="projects" className="relative z-10 isolate overflow-hidden py-32">
    <div className="container relative z-10 mx-auto max-w-7xl px-4 md:px-8">
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
    <section id="projects" className="relative z-10 isolate overflow-hidden py-32">
      <div className="container relative z-10 mx-auto max-w-7xl px-4 md:px-8">
        <h2 className="text-4xl md:text-5xl font-sans font-bold mb-4 text-center text-white">
          Selected <span className="text-white/40">Works</span>
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
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  key={project.id}
                  className={cn(
                    "group relative",
                    isFeatured ? "md:col-span-2 lg:col-span-2" : "col-span-1"
                  )}
                >
                  <Tilt
                    perspective={1200}
                    tiltMaxAngleX={4}
                    tiltMaxAngleY={4}
                    scale={1.01}
                    glareEnable={true}
                    glareMaxOpacity={0.06}
                    glareColor="#06b6d4"
                    glarePosition="all"
                    className="h-full w-full rounded-3xl"
                  >
                    <div className="relative h-full w-full overflow-hidden rounded-3xl border border-white/[0.08] bg-surface-1/90 transition-all duration-500 group-hover:border-white/20">
                      {/* Top Specular Edge */}
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-x-8 top-0 z-20 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
                      />

                      {/* Image Background */}
                      <div className="absolute inset-0 w-full h-full transform transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105">
                        <div className="absolute inset-0 bg-[#000000] z-0" />
                        {project.images && (
                          <img
                            src={project.images}
                            alt={project.name}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover opacity-50 group-hover:opacity-35 transition-opacity duration-500"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/85 to-transparent opacity-95" />
                      </div>

                      {/* Content */}
                      <div className="relative z-10 p-8 h-full flex flex-col justify-end">
                        
                        {/* Top Right WIP Badge with Amber Domain Token */}
                        {(project.inProgress || project.inprogress) && (
                          <div className="absolute top-6 right-6 px-3 py-1 bg-amber-500/10 text-amber-300 text-xs font-mono rounded-full border border-amber-500/30 backdrop-blur-md shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                            WIP
                          </div>
                        )}

                        <div className="transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] translate-y-3 group-hover:translate-y-0">
                          <h3 className="text-2xl md:text-3xl font-semibold mb-3 text-white tracking-tight">
                            {project.name}
                          </h3>

                          <p className="text-text-muted text-sm md:text-base line-clamp-2 md:line-clamp-3 mb-6 max-w-lg leading-relaxed">
                            {project.description}
                          </p>

                          <div className="flex flex-wrap gap-2 mb-8">
                            {project.tools && project.tools.slice(0, 4).map((tool, i) => (
                              <span
                                key={i}
                                className="text-xs font-mono text-white/70 bg-black/40 px-2.5 py-1 rounded-lg border border-white/[0.08] transition-colors duration-200 group-hover:border-cyan-400/30 group-hover:text-white"
                              >
                                {tool}
                              </span>
                            ))}
                            {project.tools && project.tools.length > 4 && (
                              <span className="text-xs font-mono text-white/50 px-2 py-1">+{project.tools.length - 4}</span>
                            )}
                          </div>

                          {/* Bottom Action Row */}
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3 opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                              {project.code && (
                                <a
                                  href={project.code}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="p-3 bg-white/5 hover:bg-white/15 rounded-full border border-white/10 hover:border-cyan-400/40 text-white/80 hover:text-white transition-all duration-300 hover:scale-105"
                                  aria-label="View source on GitHub"
                                >
                                  <FaGithub size={18} />
                                </a>
                              )}
                              {project.demo && (
                                <a
                                  href={project.demo}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="px-5 py-2.5 bg-gradient-to-r from-cyan-400 to-azure-500 text-black font-semibold text-xs rounded-full hover:opacity-90 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.4)] flex items-center gap-2"
                                >
                                  <FaEye size={14} /> View Live
                                </a>
                              )}
                            </div>

                            {/* Contributor Overlapping Stack */}
                            {project.contributors && project.contributors.length > 0 && (
                              <div className="flex items-center -space-x-2 overflow-hidden bg-background/80 backdrop-blur-md p-1 rounded-full border border-white/10 ml-auto shrink-0">
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
                                      className="inline-block transition-transform duration-300 hover:scale-125 hover:z-30 hover:-translate-y-0.5"
                                    >
                                      <img
                                        src={avatarSrc}
                                        alt={contributor.name || 'Contributor'}
                                        loading="lazy"
                                        decoding="async"
                                        className="w-7 h-7 rounded-full object-cover ring-2 ring-background bg-slate-800"
                                      />
                                    </a>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Tilt>
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
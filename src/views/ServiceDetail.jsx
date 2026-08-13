import React, { useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import MagneticButton from "../components/helper/MagneticButton";
import {
  FaArrowLeft,
  FaArrowRight,
  FaGithub,
  FaExternalLinkAlt,
} from "react-icons/fa";
import MetaTags from "../components/common/MetaTags";
import { getGitHubAvatar } from "../utils/github";

const ServiceDetail = ({ services = [], projects = [] }) => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const service = services?.find((s) => String(s.id) === String(serviceId));

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [serviceId]);

  const relatedProjects = useMemo(() => {
    if (!service || !Array.isArray(projects) || !projects.length) {
      return [];
    }
    const serviceTechnologies = new Set(
      (service.fullTechStack || [])
        .map((tech) => String(tech).toLowerCase().trim())
        .filter(Boolean),
    );
    if (!serviceTechnologies.size) {
      return [];
    }
    return projects
      .map((project) => {
        const projectTools = (project.tools || [])
          .map((tool) => String(tool).toLowerCase().trim())
          .filter(Boolean);
        const matchedTools = projectTools.filter((tool) =>
          [...serviceTechnologies].some(
            (technology) =>
              technology === tool ||
              technology.includes(tool) ||
              tool.includes(technology),
          ),
        );
        return { ...project, matchedTools, relevance: matchedTools.length };
      })
      .filter((project) => project.relevance > 0)
      .sort((a, b) => {
        if (b.relevance !== a.relevance) {
          return b.relevance - a.relevance;
        }
        return (a.sortOrder ?? a.id ?? 0) - (b.sortOrder ?? b.id ?? 0);
      })
      .slice(0, 3);
  }, [service, projects]);

  if (!service) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white">
        <MetaTags title="Service Not Found | Haider Ali Portfolio" />
        <h2 className="text-2xl font-bold mb-4 font-mono">
          Service Not Found
        </h2>
        <button
          onClick={() => navigate("/#services")}
          className="px-6 py-3 bg-primary text-black font-semibold rounded-full hover:bg-cyan-300 transition-colors"
        >
          Return to Services
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="min-h-screen pt-32 pb-20 px-6 container mx-auto max-w-5xl relative z-10"
    >
      <MetaTags
        title={`${service.name} | Haider Ali`}
        description={service.description}
      />
      <div className="mb-12">
        <MagneticButton onClick={() => navigate("/#services")}>
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-sm font-mono cursor-pointer">
            <FaArrowLeft /> Back to Services
          </div>
        </MagneticButton>
      </div>
      <div className="mb-20">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl font-bold font-sans mb-6 text-white"
        >
          {service.name}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-text-muted max-w-2xl leading-relaxed"
        >
          {service.description}
        </motion.p>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-24"
      >
        <h3 className="text-sm font-mono text-primary mb-8 uppercase tracking-widest border-b border-white/10 pb-2 inline-block">
          Tech Stack Used
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {service.fullTechStack?.map((tech, i) => (
            <div
              key={`${tech}-${i}`}
              className="p-4 rounded-xl bg-white/5 border border-white/5 text-center hover:bg-white/10 transition-colors"
            >
              <span className="text-sm font-medium text-white/80">
                {tech}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
      <div className="mb-24">
        <h3 className="text-sm font-mono text-primary mb-8 uppercase tracking-widest border-b border-white/10 pb-2 inline-block">
          System Architecture
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-3xl glass-card border border-red-500/10 bg-red-500/5"
          >
            <h3 className="text-xl font-bold text-white mb-4">
              The Challenge
            </h3>
            <p className="text-text-muted leading-relaxed">
              {service.problem}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-3xl glass-card border border-green-500/10 bg-green-500/5"
          >
            <h3 className="text-xl font-bold text-white mb-4">
              The Solution
            </h3>
            <p className="text-text-muted leading-relaxed">
              {service.solution}
            </p>
          </motion.div>
        </div>
      </div>
      <div className="mb-24">
        <h3 className="text-sm font-mono text-primary mb-12 uppercase tracking-widest border-b border-white/10 pb-2 inline-block">
          Implementation Roadmap
        </h3>
        <div className="relative border-l border-white/10 ml-4 md:ml-8 space-y-12">
          {service.implementationSteps?.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative pl-8 md:pl-12"
            >
              <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-black border-2 border-primary" />
              <h4 className="text-xl font-bold text-white mb-2">
                {step.title}
              </h4>
              <p className="text-text-muted max-w-xl">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
      {relatedProjects.length > 0 && (
        <section id="related-projects" className="mb-24">
          <div className="flex items-end justify-between gap-6 mb-10">
            <div>
              <h3 className="text-sm font-mono text-primary mb-4 uppercase tracking-widest">
                Related Projects
              </h3>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Relevant Work
              </h2>
            </div>
            <span className="hidden md:block text-sm font-mono text-text-muted">
              {relatedProjects.length} projects
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProjects.map((project, index) => (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group rounded-3xl overflow-hidden border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/20 transition-all duration-500 flex flex-col justify-between"
              >
                <div>
                  {project.images?.[0] && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={project.images[0]}
                        alt={project.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <span className="text-xs font-mono text-primary uppercase tracking-wider">
                        {project.role}
                      </span>
                      {project.inProgress && (
                        <span className="text-xs font-mono text-yellow-400">
                          In Progress
                        </span>
                      )}
                    </div>
                    <h4 className="text-xl font-bold text-white mb-3">
                      {project.name}
                    </h4>
                    <p className="text-sm text-text-muted leading-relaxed line-clamp-3 mb-5">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tools?.slice(0, 5).map((tool) => (
                        <span
                          key={tool}
                          className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/70"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-0 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => navigate("/#projects")}
                    className="inline-flex items-center gap-2 text-sm font-mono text-white hover:text-primary transition-colors"
                  >
                    View Project <FaArrowRight className="text-xs" />
                  </button>

                  <div className="flex items-center gap-3">
                    {project.contributors && project.contributors.length > 0 && (
                      <div className="flex items-center -space-x-2 overflow-hidden bg-background/60 backdrop-blur-md p-1 rounded-full border border-white/10 shadow-sm shrink-0 mr-2">
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
                                className="w-6 h-6 rounded-full object-cover ring-2 ring-background bg-slate-800 shadow-sm"
                              />
                            </a>
                          );
                        })}
                      </div>
                    )}
                    {project.code && (
                      <a
                        href={project.code}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`View ${project.name} source code`}
                        className="text-white/60 hover:text-white transition-colors"
                      >
                        <FaGithub />
                      </a>
                    )}
                    {project.demo && (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`View ${project.name} live demo`}
                        className="text-white/60 hover:text-primary transition-colors"
                      >
                        <FaExternalLinkAlt />
                      </a>
                    )}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </section>
      )}
    </motion.div>
  );
};
export default ServiceDetail;
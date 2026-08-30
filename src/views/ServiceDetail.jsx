import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import MagneticButton from "../components/helper/MagneticButton";
import {
  FaArrowLeft,
  FaArrowRight,
  FaGithub,
  FaExternalLinkAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaLayerGroup,
  FaRocket,
  FaClock,
  FaCode,
  FaCogs,
  FaShieldAlt,
  FaFilter
} from "react-icons/fa";
import MetaTags from "../components/common/MetaTags";
import { getGitHubAvatar } from "../utils/github";

const ServiceDetail = ({ services = [], projects = [] }) => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const service = services?.find((s) => String(s.id) === String(serviceId));

  // Interactive UI state for tech stack category filter
  const [activeTechFilter, setActiveTechFilter] = useState("all");

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
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white p-6">
        <MetaTags title="Service Not Found | Haider Ali Portfolio" />
        <div className="p-8 rounded-3xl glass-card border border-primary/20 text-center max-w-md w-full shadow-2xl backdrop-blur-xl bg-white/[0.02]">
          <h2 className="text-2xl font-bold mb-2 font-mono text-primary">
            [ 404 ] Service Not Found
          </h2>
          <p className="text-text-muted mb-6 text-sm">The requested engineering specification could not be located.</p>
          <button
            onClick={() => navigate("/#services")}
            className="w-full py-4 bg-primary text-black font-bold font-mono text-xs uppercase tracking-wider rounded-full hover:opacity-90 transition-all shadow-lg shadow-primary/20"
          >
            Return to Solutions Grid
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="min-h-screen pt-32 pb-24 px-6 container mx-auto max-w-5xl relative z-10"
    >
      <MetaTags
        title={`${service.name} | Haider Ali`}
        description={service.description}
      />

      {/* Back Navigation Bar with Metadata Badge */}
      <div className="mb-12 flex items-center justify-between">
        <MagneticButton onClick={() => navigate("/#services")}>
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/40 transition-all text-xs font-mono cursor-pointer text-white/90 shadow-sm">
            <FaArrowLeft className="text-primary text-xs" /> Back to Services
          </div>
        </MagneticButton>
        <div className="hidden md:flex items-center gap-2 font-mono text-xs text-text-muted bg-white/5 px-4 py-2 rounded-full border border-white/5">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span>ID: {service.id} // System Specification</span>
        </div>
      </div>

      {/* Hero Header Section with Dynamic Ambient Glow */}
      <div className="mb-16 relative">
        <div className="absolute -top-10 -left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-mono text-xs mb-6 backdrop-blur-md">
          <FaRocket size={10} />
          <span>Enterprise Engineering Architecture</span>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl font-bold font-sans mb-6 text-white leading-tight tracking-tight"
        >
          {service.name}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-text-muted max-w-3xl leading-relaxed"
        >
          {service.description}
        </motion.p>
      </div>

      {/* Dynamic Interactive Quick Metrics Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 p-5 rounded-2xl glass-card border border-white/10 bg-white/[0.02] backdrop-blur-xl shadow-xl"
      >
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
          <div className="p-2.5 rounded-lg bg-primary/10 text-primary border border-primary/20">
            <FaClock size={14} />
          </div>
          <div>
            <p className="text-[10px] text-text-muted font-mono uppercase tracking-wider">Timeline</p>
            <p className="text-xs font-bold text-white font-mono mt-0.5">{service.timeline || 'Custom Scale'}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
          <div className="p-2.5 rounded-lg bg-primary/10 text-primary border border-primary/20">
            <FaLayerGroup size={14} />
          </div>
          <div>
            <p className="text-[10px] text-text-muted font-mono uppercase tracking-wider">Classification</p>
            <p className="text-xs font-bold text-white font-mono mt-0.5">{service.category || 'Core System'}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
          <div className="p-2.5 rounded-lg bg-primary/10 text-primary border border-primary/20">
            <FaShieldAlt size={14} />
          </div>
          <div>
            <p className="text-[10px] text-text-muted font-mono uppercase tracking-wider">Reliability</p>
            <p className="text-xs font-bold text-white font-mono mt-0.5">99.9% Production</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
          <div className="p-2.5 rounded-lg bg-primary/10 text-primary border border-primary/20">
            <FaCogs size={14} />
          </div>
          <div>
            <p className="text-[10px] text-text-muted font-mono uppercase tracking-wider">Tooling Count</p>
            <p className="text-xs font-bold text-white font-mono mt-0.5">{service.fullTechStack?.length || 0} Modules</p>
          </div>
        </div>
      </motion.div>

      {/* Tech Stack Matrix with Live Filter Interactivity */}
      {service.fullTechStack && service.fullTechStack.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-24"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <FaCode size={16} />
              </div>
              <h3 className="text-sm font-mono text-white uppercase tracking-widest font-bold">
                Tech Stack Matrix & Dependencies
              </h3>
            </div>
            
            {/* Filter tags generated dynamically from data */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
              <span className="text-[10px] font-mono text-text-muted flex items-center gap-1 mr-1">
                <FaFilter size={8} /> Filter:
              </span>
              {["all", ...new Set(service.fullTechStack.map(t => t.toLowerCase().split(' ')[0]))].slice(0, 4).map((filterKey) => (
                <button
                  key={filterKey}
                  onClick={() => setActiveTechFilter(filterKey)}
                  className={`px-3 py-1 rounded-full text-xs font-mono uppercase transition-all ${
                    activeTechFilter === filterKey
                      ? "bg-primary text-black font-bold shadow-md shadow-primary/20"
                      : "bg-white/5 text-text-muted hover:bg-white/10 hover:text-white border border-white/5"
                  }`}
                >
                  {filterKey}
                </button>
              ))}
            </div>
          </div>

          <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <AnimatePresence>
              {service.fullTechStack
                .filter(tech => activeTechFilter === "all" || tech.toLowerCase().includes(activeTechFilter))
                .map((tech, i) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    key={`${tech}-${i}`}
                    className="p-5 rounded-2xl glass-card border border-white/5 bg-white/[0.03] text-center hover:bg-white/[0.07] hover:border-primary/45 transition-all duration-300 group flex flex-col items-center justify-center min-h-[100px] shadow-lg relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="text-[10px] font-mono text-primary/70 mb-1 group-hover:scale-110 transition-transform">#0{i+1}</span>
                    <span className="text-sm font-bold text-white/90 group-hover:text-primary transition-colors relative z-10">
                      {tech}
                    </span>
                  </motion.div>
                ))}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}

      {/* Advanced Challenge vs Solution Modern Split Cards */}
      <div className="mb-24">
        <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-4">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <FaCogs size={16} />
          </div>
          <h3 className="text-sm font-mono text-white uppercase tracking-widest font-bold">
            System Architecture
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            className="p-8 rounded-3xl glass-card border border-red-500/30 bg-gradient-to-br from-red-500/[0.08] via-red-500/[0.02] to-transparent relative overflow-hidden shadow-xl"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 text-red-400 pointer-events-none">
              <FaExclamationTriangle size={120} />
            </div>
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="p-3 rounded-xl bg-red-500/15 text-red-400 border border-red-500/20">
                <FaExclamationTriangle size={20} />
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">The Challenge</h3>
            </div>
            <p className="text-text-muted leading-relaxed text-base relative z-10">
              {service.problem}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            className="p-8 rounded-3xl glass-card border border-green-500/30 bg-gradient-to-br from-green-500/[0.08] via-green-500/[0.02] to-transparent relative overflow-hidden shadow-xl"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 text-green-400 pointer-events-none">
              <FaCheckCircle size={120} />
            </div>
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="p-3 rounded-xl bg-green-500/15 text-green-400 border border-green-500/20">
                <FaCheckCircle size={20} />
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">The Solution</h3>
            </div>
            <p className="text-text-muted leading-relaxed text-base relative z-10">
              {service.solution}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Implementation Roadmap Timeline with Enhanced Card Wrappers */}
      {service.implementationSteps && service.implementationSteps.length > 0 && (
        <div className="mb-24">
          <div className="flex items-center gap-3 mb-12 border-b border-white/10 pb-4">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <FaRocket size={16} />
            </div>
            <h3 className="text-sm font-mono text-white uppercase tracking-widest font-bold">
              Implementation Roadmap
            </h3>
          </div>

          <div className="relative border-l-2 border-primary/30 ml-4 md:ml-8 space-y-12">
            {service.implementationSteps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ delay: i * 0.1 }}
                className="relative pl-8 md:pl-12 group"
              >
                <span className="absolute -left-[11px] top-1.5 w-5 h-5 rounded-full bg-black border-2 border-primary group-hover:bg-primary group-hover:scale-125 transition-all shadow-[0_0_12px_rgba(var(--primary-rgb),0.5)]" />
                
                <div className="p-6 rounded-3xl glass-card border border-white/5 bg-white/[0.02] group-hover:border-primary/40 group-hover:bg-white/[0.05] transition-all duration-300 shadow-lg">
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <h4 className="text-xl font-bold text-white group-hover:text-primary transition-colors">
                      {step.title}
                    </h4>
                    <span className="text-xs font-mono text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                      Phase 0{i + 1}
                    </span>
                  </div>
                  <p className="text-text-muted max-w-2xl leading-relaxed text-sm">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Relevant Case Study Work Projects Grid */}
      {relatedProjects.length > 0 && (
        <section id="related-projects" className="mb-24">
          <div className="flex items-end justify-between gap-6 mb-10 border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <FaLayerGroup size={14} />
                </div>
                <h3 className="text-sm font-mono text-white uppercase tracking-widest font-bold">
                  Related Projects
                </h3>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Relevant Work
              </h2>
            </div>
            <span className="hidden md:inline-block text-xs font-mono text-primary bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-full">
              {relatedProjects.length} Matched Projects
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProjects.map((project, index) => (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ delay: index * 0.1 }}
                className="group rounded-3xl overflow-hidden border border-white/10 bg-white/[0.03] hover:bg-white/[0.07] hover:border-primary/40 transition-all duration-500 flex flex-col justify-between shadow-xl"
              >
                <div>
                  {project.images?.[0] && (
                    <div className="aspect-video overflow-hidden border-b border-white/5 relative">
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
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
                      <span className="text-xs font-mono text-primary uppercase tracking-wider bg-primary/10 px-2.5 py-1 rounded-md border border-primary/20">
                        {project.role}
                      </span>
                      {project.inProgress && (
                        <span className="text-xs font-mono text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded border border-yellow-400/20">
                          In Progress
                        </span>
                      )}
                    </div>
                    <h4 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors">
                      {project.name}
                    </h4>
                    <p className="text-sm text-text-muted leading-relaxed line-clamp-3 mb-5">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tools?.slice(0, 5).map((tool) => (
                        <span
                          key={tool}
                          className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/70 font-mono"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-0 flex items-center justify-between gap-3 border-t border-white/5 pt-4 mt-auto">
                  <button
                    type="button"
                    onClick={() => navigate("/#projects")}
                    className="inline-flex items-center gap-2 text-xs font-mono text-white hover:text-primary transition-colors font-bold"
                  >
                    View Project <FaArrowRight className="text-[10px]" />
                  </button>

                  <div className="flex items-center gap-3">
                    {project.contributors && project.contributors.length > 0 && (
                      <div className="flex items-center -space-x-2 overflow-hidden bg-background/65 backdrop-blur-md p-1 rounded-full border border-white/10 shadow-sm shrink-0 mr-2">
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
                        className="text-white/60 hover:text-white transition-colors p-1"
                      >
                        <FaGithub size={16} />
                      </a>
                    )}
                    {project.demo && (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`View ${project.name} live demo`}
                        className="text-white/60 hover:text-primary transition-colors p-1"
                      >
                        <FaExternalLinkAlt size={14} />
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
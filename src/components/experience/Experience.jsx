import React, { useState } from 'react';
import { FaBriefcase, FaArrowUpRightFromSquare, FaClock } from 'react-icons/fa6';
import { motion } from 'framer-motion';
import { useExperience } from '../../hooks/useExperience';

const Experience = ({ experiences = [], isLoading = false }) => {
    const [activeTechFilter, setActiveTechFilter] = useState(null);
    const normalizedExperiences = useExperience(experiences);

    if (isLoading) {
        return (
            <section id="experience" className="relative z-10 isolate overflow-hidden py-24">
                <div className="container relative z-10 mx-auto max-w-6xl px-6">
                    <div className="mb-16 flex flex-col md:flex-row items-center md:items-start gap-4">
                        <div className="h-14 w-14 rounded-full skeleton-shimmer bg-white/[0.06]" />
                        <div className="w-full md:w-auto">
                            <div className="mx-auto h-10 w-64 rounded-full skeleton-shimmer bg-white/[0.06] md:mx-0" />
                            <div className="mt-3 h-4 w-72 rounded-full skeleton-shimmer bg-white/[0.04] mx-auto md:mx-0" />
                        </div>
                    </div>

                    <div className="space-y-8">
                        {Array.from({ length: 3 }).map((_, index) => (
                            <div key={index} className="rounded-3xl border border-white/[0.06] bg-white/[0.03] p-8">
                                <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                    <div className="space-y-3">
                                        <div className="h-7 w-72 rounded-xl skeleton-shimmer bg-white/[0.06]" />
                                        <div className="h-5 w-52 rounded-xl skeleton-shimmer bg-white/[0.05]" />
                                    </div>
                                    <div className="h-10 w-32 rounded-full skeleton-shimmer bg-white/[0.05]" />
                                </div>
                                <div className="space-y-3 pt-3">
                                    <div className="h-4 w-full rounded-full skeleton-shimmer bg-white/[0.05]" />
                                    <div className="h-4 w-11/12 rounded-full skeleton-shimmer bg-white/[0.05]" />
                                    <div className="h-4 w-4/5 rounded-full skeleton-shimmer bg-white/[0.05]" />
                                </div>
                                <div className="mt-6 flex flex-wrap gap-2">
                                    {Array.from({ length: 4 }).map((__, tagIndex) => (
                                        <div key={tagIndex} className="h-8 w-20 rounded-full skeleton-shimmer bg-white/[0.05]" />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    const handleTechClick = (tech) => {
        setActiveTechFilter(activeTechFilter === tech ? null : tech);
    };

    const filteredExperiences = activeTechFilter
        ? normalizedExperiences.filter((exp) => exp.tech && exp.tech.includes(activeTechFilter))
        : normalizedExperiences;

    return (
        <section id="experience" className="relative z-10 isolate overflow-hidden py-24">
            <div className="container relative z-10 mx-auto max-w-6xl px-6">
                {/* Header */}
                <div className="mb-14 text-center">
                    <h2 className="text-3xl md:text-5xl font-sans font-bold text-white tracking-tight">
                        Professional <span className="text-white/40">Journey</span>
                    </h2>
                </div>

                {/* Active Filter Pill */}
                {activeTechFilter && (
                    <div className="mb-8 flex items-center justify-center md:justify-start gap-2">
                        <span className="text-xs font-mono text-text-muted">Filtering roles by tech:</span>
                        <span className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 px-3 py-1 rounded-full text-xs font-mono text-primary">
                            <strong>{activeTechFilter}</strong>
                            <button 
                                onClick={() => setActiveTechFilter(null)}
                                className="ml-1 text-white hover:text-primary transition-colors font-bold"
                            >
                                ×
                            </button>
                        </span>
                    </div>
                )}

                {isLoading ? (
                    <ExperienceSkeleton />
                ) : !normalizedExperiences || normalizedExperiences.length === 0 ? (
                    <div className="text-center text-text-muted py-12 glass-card rounded-3xl border border-glass-border">
                        <p className="font-mono text-sm">No professional history available.</p>
                    </div>
                ) : filteredExperiences.length === 0 ? (
                    <div className="text-center text-text-muted py-12 glass-card rounded-3xl border border-glass-border">
                        <p className="font-mono text-sm">No experience entries found matching "{activeTechFilter}".</p>
                        <button 
                            onClick={() => setActiveTechFilter(null)}
                            className="mt-3 text-xs font-mono text-primary underline hover:text-white transition-colors"
                        >
                            Reset filter
                        </button>
                    </div>
                ) : (
                    <div className="relative border-l border-white/10 ml-3 md:ml-8 space-y-12">
                        {filteredExperiences.map((exp, index) => (
                            <motion.div
                                key={exp.id || index}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: '-40px' }}
                                transition={{ delay: index * 0.1 }}
                                className="relative pl-6 md:pl-12 group"
                            >
                                {/* Timeline Dot with Glow */}
                                <span className="absolute -left-[9px] top-6 w-4 h-4 rounded-full bg-black border-2 border-cyan-400 group-hover:bg-cyan-400 group-hover:shadow-[0_0_16px_rgba(6,182,212,0.8)] transition-all duration-300" />

                                <div className="relative overflow-hidden p-8 rounded-3xl border border-white/[0.08] bg-surface-1/90 backdrop-blur-xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-cyan-400/40 hover:bg-surface-2/90">
                                    {/* Top Specular Edge */}
                                    <div
                                        aria-hidden="true"
                                        className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/25 to-transparent"
                                    />

                                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                                        <div>
                                            <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                                                {exp.title}
                                            </h3>
                                            {exp.companyUrl ? (
                                                <a
                                                    href={exp.companyUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 text-lg font-medium text-white/80 transition-colors hover:text-cyan-400 hover:underline"
                                                >
                                                    <span>{exp.company}</span>
                                                    <FaArrowUpRightFromSquare className="h-3.5 w-3.5" />
                                                </a>
                                            ) : (
                                                <p className="text-lg text-white/80 font-medium">{exp.company}</p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 text-white/70 font-mono text-xs bg-surface-2 px-4 py-2 rounded-full w-fit border border-white/[0.08]">
                                            <FaClock size={12} className="text-cyan-400" />
                                            <span>{exp.duration}</span>
                                        </div>
                                    </div>

                                    <p className="text-text-muted leading-relaxed mb-6 max-w-3xl text-sm md:text-base">
                                        {exp.description}
                                    </p>

                                    <div className="flex flex-wrap gap-2">
                                        {exp.tech?.map((t, i) => {
                                            const isSelected = activeTechFilter === t;
                                            return (
                                                <button
                                                    key={i}
                                                    type="button"
                                                    onClick={() => handleTechClick(t)}
                                                    className={`text-xs font-mono px-2.5 py-1 rounded-lg border transition-all duration-200 cursor-pointer ${
                                                        isSelected
                                                            ? 'bg-cyan-400 text-black font-bold border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.4)] scale-105'
                                                            : 'text-cyan-300 bg-cyan-950/30 border-cyan-500/20 hover:bg-cyan-900/40 hover:border-cyan-400/50'
                                                    }`}
                                                >
                                                    {t}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Experience;
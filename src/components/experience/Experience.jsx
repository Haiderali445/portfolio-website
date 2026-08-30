import React, { useState } from 'react';
import { FaBriefcase, FaArrowUpRightFromSquare, FaClock } from 'react-icons/fa6';
import { motion } from 'framer-motion';
import { useExperience } from '../../hooks/useExperience';

const Experience = ({ experiences = [], isLoading = false }) => {
    const [activeTechFilter, setActiveTechFilter] = useState(null);
    const normalizedExperiences = useExperience(experiences);

    if (isLoading) {
        return (
            <section id="experience" className="py-24 relative z-10">
                <div className="container mx-auto px-6 max-w-6xl">
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
        <section id="experience" className="py-24 relative z-10">
            <div className="container mx-auto px-6 max-w-6xl">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-center md:items-start gap-4 mb-16">
                    <div className="p-3 rounded-full bg-primary/10 text-primary border border-primary/20">
                        <FaBriefcase size={24} />
                    </div>
                    <div className="text-center md:text-left">
                        <h2 className="text-3xl md:text-5xl font-sans font-bold text-white">Professional Journey</h2>
                        <p className="text-text-muted text-sm mt-1">Track record of engineering systems and architectural scaling.</p>
                    </div>
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
                                <span className="absolute -left-[9px] top-6 w-4 h-4 rounded-full bg-black border-2 border-primary group-hover:bg-primary group-hover:shadow-[0_0_12px_rgba(var(--primary-rgb),0.6)] transition-all duration-300" />

                                <div className="p-8 rounded-3xl glass-card border border-white/5 bg-white/5 hover:bg-white/10 transition-all duration-300 relative group-hover:border-primary/30">
                                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                                        <div>
                                            <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
                                                {exp.title}
                                            </h3>
                                            {exp.companyUrl ? (
                                                <a
                                                    href={exp.companyUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 text-lg font-medium text-white/80 transition-colors hover:text-primary hover:underline"
                                                >
                                                    <span>{exp.company}</span>
                                                    <FaArrowUpRightFromSquare className="h-3.5 w-3.5" />
                                                </a>
                                            ) : (
                                                <p className="text-lg text-white/80 font-medium">{exp.company}</p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 text-text-muted font-mono text-sm bg-black/40 px-4 py-2 rounded-full w-fit border border-white/5 shadow-inner">
                                            <FaClock size={12} className="text-primary/70" />
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
                                                    className={`text-xs font-mono px-2.5 py-1 rounded border transition-all duration-200 cursor-pointer ${
                                                        isSelected
                                                            ? 'bg-primary text-black font-bold border-primary shadow-md scale-105'
                                                            : 'text-primary/90 bg-primary/10 border-primary/20 hover:bg-primary/20 hover:border-primary/40'
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
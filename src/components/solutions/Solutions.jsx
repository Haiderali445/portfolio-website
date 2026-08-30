import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaMinus } from 'react-icons/fa';

const SolutionCard = ({ solution, isOpen, onClick, onTagClick, activeTag }) => {
    return (
        <motion.div
            layout
            onClick={onClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onClick();
                }
            }}
            className={`relative p-6 rounded-3xl glass-card border border-glass-border cursor-pointer transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                isOpen ? 'bg-white/5 border-primary/30' : 'hover:bg-white/5'
            }`}
        >
            <div className="flex justify-between items-start">
                <div>
                    <span className="text-xs font-mono text-primary/80 mb-2 block">{solution.category}</span>
                    <h3 className="text-xl font-bold text-white mb-2">{solution.title}</h3>
                </div>
                <div className={`p-2 rounded-full border border-white/10 text-white transition-transform duration-300 ${isOpen ? 'rotate-180 bg-white text-black' : ''}`}>
                    {isOpen ? <FaMinus size={12} /> : <FaPlus size={12} />}
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <p className="text-text-muted mt-4 text-sm leading-relaxed border-t border-white/5 pt-4">
                            {solution.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-4" onClick={(e) => e.stopPropagation()}>
                            {solution.tech?.map((t, i) => {
                                const isSelected = activeTag === t;
                                return (
                                    <button
                                        key={i}
                                        type="button"
                                        onClick={() => onTagClick ? onTagClick(t) : null}
                                        className={`text-[10px] uppercase tracking-wider font-mono px-2 py-1 rounded transition-all duration-200 ${
                                            isSelected 
                                                ? 'bg-primary text-black font-bold shadow-lg shadow-primary/20 scale-105' 
                                                : 'text-white/50 bg-white/5 hover:bg-white/10 hover:text-white'
                                        }`}
                                    >
                                        {t}
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

const SolutionsSkeleton = () => (
    <section id="solutions" className="py-24 relative z-10">
        <div className="container mx-auto px-6 max-w-6xl">
            <div className="mb-16 text-center">
                <div className="mx-auto mb-4 h-12 w-72 rounded-full skeleton-shimmer bg-white/[0.06]" />
                <div className="mx-auto h-4 w-96 max-w-full rounded-full skeleton-shimmer bg-white/[0.05]" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="rounded-3xl border border-white/[0.08] bg-white/[0.03] p-6">
                        <div className="mb-4 h-4 w-24 rounded-full skeleton-shimmer bg-white/[0.06]" />
                        <div className="mb-3 h-7 w-3/4 rounded-xl skeleton-shimmer bg-white/[0.07]" />
                        <div className="space-y-3 pt-4">
                            <div className="h-4 w-full rounded-full skeleton-shimmer bg-white/[0.05]" />
                            <div className="h-4 w-11/12 rounded-full skeleton-shimmer bg-white/[0.05]" />
                            <div className="h-4 w-2/3 rounded-full skeleton-shimmer bg-white/[0.05]" />
                        </div>
                        <div className="mt-5 flex flex-wrap gap-2">
                            {Array.from({ length: 3 }).map((__, tagIndex) => (
                                <div key={tagIndex} className="h-8 w-20 rounded-full skeleton-shimmer bg-white/[0.05]" />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const Solutions = ({ solutions = [], personalData = {}, isLoading = false }) => {
    const [openIndex, setOpenIndex] = useState(null);
    const [activeTagFilter, setActiveTagFilter] = useState(null);

    if (isLoading) {
        return <SolutionsSkeleton />;
    }

    if (!solutions || solutions.length === 0) return null;

    const toggleAccordion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const handleTagClick = (tag) => {
        setActiveTagFilter(activeTagFilter === tag ? null : tag);
    };

    // Filter solutions dynamically based on selected tech tag, keeping data strictly props-driven
    const filteredSolutions = activeTagFilter 
        ? solutions.filter(s => s.tech && s.tech.includes(activeTagFilter))
        : solutions;

    return (
        <section id="solutions" className="py-24 relative z-10">
            <div className="container mx-auto px-6 max-w-6xl">
                <div className="mb-16 text-center">
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
                        Explored <span className="text-text-muted">Solutions</span>
                    </h2>
                    <p className="text-text-muted max-w-2xl mx-auto">
                        {personalData.solutionsSectionSubtitle || "Explore customized system layouts, architectural approaches, and enterprise-grade solutions."}
                    </p>
                    {activeTagFilter && (
                        <div className="mt-4 inline-flex items-center gap-2 bg-primary/10 border border-primary/30 px-3 py-1 rounded-full text-xs font-mono text-primary">
                            <span>Filtering by: <strong>{activeTagFilter}</strong></span>
                            <button 
                                onClick={() => setActiveTagFilter(null)}
                                className="ml-2 text-white hover:text-primary transition-colors font-bold"
                            >
                                × Reset
                            </button>
                        </div>
                    )}
                </div>

                {isLoading ? (
                    <SolutionsSkeleton />
                ) : filteredSolutions.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredSolutions.map((solution, index) => (
                            <SolutionCard
                                key={index}
                                solution={solution}
                                isOpen={openIndex === index}
                                onClick={() => toggleAccordion(index)}
                                onTagClick={handleTagClick}
                                activeTag={activeTagFilter}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 glass-card rounded-3xl border border-glass-border">
                        <p className="text-text-muted text-sm font-mono">No solutions found matching this technology filter.</p>
                        <button 
                            onClick={() => setActiveTagFilter(null)}
                            className="mt-4 text-xs font-mono text-primary underline hover:text-white transition-colors"
                        >
                            Clear filter
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Solutions;
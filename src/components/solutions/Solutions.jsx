import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaMinus, FaLightbulb } from 'react-icons/fa';

const SolutionCard = ({ solution, isOpen, onClick }) => {
    return (
        <motion.div
            layout
            onClick={onClick}
            className={`relative p-6 rounded-3xl glass-card border border-glass-border cursor-pointer transition-colors duration-300 ${isOpen ? 'bg-white/5 border-primary/30' : 'hover:bg-white/5'}`}
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
                        <div className="flex flex-wrap gap-2 mt-4">
                            {solution.tech.map((t, i) => (
                                <span key={i} className="text-[10px] uppercase tracking-wider font-mono text-white/50 bg-white/5 px-2 py-1 rounded">
                                    {t}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

const Solutions = ({ solutions = [] }) => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleAccordion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section id="solutions" className="py-24 relative z-10">
            <div className="container mx-auto px-6 max-w-6xl">
                <div className="mb-16 text-center">
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
                        Explored <span className="text-text-muted">Solutions</span>
                    </h2>
                    <p className="text-text-muted max-w-2xl mx-auto">
                        A collection of technical challenges I've tackled, from system architecture to AI integration.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {solutions.map((solution, index) => (
                        <SolutionCard
                            key={index}
                            solution={solution}
                            isOpen={openIndex === index}
                            onClick={() => toggleAccordion(index)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Solutions;

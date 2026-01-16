import React, { useState } from 'react';
import { solutionsData } from '../../utils/data/solutionsData';
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

const Solutions = () => {
    const [openId, setOpenId] = useState(null);

    const handleToggle = (id) => {
        setOpenId(openId === id ? null : id);
    };

    return (
        <section id="solutions" className="py-24 relative z-10">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="flex items-center gap-4 mb-12">
                    <div className="p-3 rounded-full bg-primary/10 text-primary">
                        <FaLightbulb size={24} />
                    </div>
                    <h2 className="text-3xl md:text-5xl font-sans font-bold text-white">Explored Solutions</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {solutionsData.map((solution) => (
                        <SolutionCard
                            key={solution.id}
                            solution={solution}
                            isOpen={openId === solution.id}
                            onClick={() => handleToggle(solution.id)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Solutions;

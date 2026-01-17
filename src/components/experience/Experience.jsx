import React from 'react';
import { FaBriefcase, FaCalendarAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Experience = ({ experiences = [] }) => {

    return (
        <section id="experience" className="py-24 relative z-10">
            <div className="container mx-auto px-6 max-w-6xl">
                <div className="flex items-center gap-4 mb-16 justify-center md:justify-start">
                    <div className="p-3 rounded-full bg-primary/10 text-primary">
                        <FaBriefcase size={24} />
                    </div>
                    <h2 className="text-3xl md:text-5xl font-sans font-bold text-white">Professional Journey</h2>
                </div>

                {!experiences || experiences.length === 0 ? (
                    <div className="text-center text-text-muted py-12">
                        <p>Loading professional history...</p>
                    </div>
                ) : (
                    <div className="relative border-l border-white/10 ml-4 md:ml-12 space-y-16">
                        {experiences.map((exp, index) => (
                            <motion.div
                                key={exp.id}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="relative pl-8 md:pl-16 group"
                            >
                                {/* Timeline Dot */}
                                <span className="absolute -left-[9px] top-6 w-4 h-4 rounded-full bg-black border-2 border-primary group-hover:bg-primary transition-colors duration-300" />

                                <div className="p-8 rounded-3xl glass-card border border-white/5 bg-white/5 hover:bg-white/10 transition-all duration-300 relative">
                                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                                        <div>
                                            <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-primary transition-colors">{exp.title}</h3>
                                            <p className="text-lg text-white/80 font-medium">{exp.company}</p>
                                        </div>
                                        <div className="flex items-center gap-2 text-text-muted font-mono text-sm bg-black/40 px-4 py-2 rounded-full w-fit border border-white/5">
                                            <FaCalendarAlt size={12} />
                                            <span>{exp.duration}</span>
                                        </div>
                                    </div>

                                    <p className="text-text-muted leading-relaxed mb-6 max-w-3xl">
                                        {exp.description}
                                    </p>

                                    <div className="flex flex-wrap gap-2">
                                        {exp.tech.map((t, i) => (
                                            <span key={i} className="text-xs font-mono text-primary/90 bg-primary/10 px-2 py-1 rounded border border-primary/20">
                                                {t}
                                            </span>
                                        ))}
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

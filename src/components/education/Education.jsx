import React, { useState } from 'react';
import { FaGraduationCap, FaCalendarAlt, FaUniversity, FaSearch } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Education = ({ educations = [] }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Dynamic UI-only filter using existing title or institution fields
  const filteredEducations = educations.filter((edu) => {
    const query = searchQuery.toLowerCase();
    const title = edu.title ? edu.title.toLowerCase() : '';
    const institution = edu.institution ? edu.institution.toLowerCase() : '';
    return title.includes(query) || institution.includes(query);
  });

  return (
    <section id="education" className="py-24 relative z-10 bg-black/20">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Section Header with UI Search Toggle */}
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 mb-16">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-primary/10 text-primary border border-primary/20">
              <FaGraduationCap size={24} />
            </div>
            <div>
              <h2 className="text-3xl md:text-5xl font-sans font-bold text-white">Academic Foundation</h2>
              <p className="text-text-muted text-sm mt-1">Formal education milestones and institutional background.</p>
            </div>
          </div>

          {/* Non-destructive UI filter input */}
          {educations.length > 1 && (
            <div className="relative w-full md:w-72">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                <FaSearch size={12} />
              </span>
              <input
                type="text"
                placeholder="Filter milestones..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-full pl-9 pr-4 py-2 text-xs text-white placeholder-text-muted focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
          )}
        </div>

        {!educations || educations.length === 0 ? (
          <div className="text-center text-text-muted py-12 glass-card rounded-3xl border border-glass-border">
            <p className="font-mono text-sm">Loading education history...</p>
          </div>
        ) : filteredEducations.length === 0 ? (
          <div className="text-center text-text-muted py-12 glass-card rounded-3xl border border-glass-border">
            <p className="font-mono text-sm">No academic entries found matching "{searchQuery}".</p>
            <button 
              onClick={() => setSearchQuery('')}
              className="mt-3 text-xs font-mono text-primary underline hover:text-white transition-colors"
            >
              Clear filter
            </button>
          </div>
        ) : (
          <div className="relative border-l border-white/10 ml-3 md:ml-8 space-y-12">
            {filteredEducations.map((edu, index) => (
              <motion.div
                key={edu.id || index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative pl-6 md:pl-12 group"
              >
                {/* Timeline Dot with Glow Effect */}
                <span className="absolute -left-[9px] top-6 w-4 h-4 rounded-full bg-black border-2 border-primary group-hover:bg-primary group-hover:shadow-[0_0_12px_rgba(var(--primary-rgb),0.6)] transition-all duration-300" />

                <div className="p-8 rounded-3xl glass-card border border-white/5 bg-white/5 hover:bg-white/10 transition-all duration-300 relative group-hover:border-primary/30 group-hover:translate-x-1">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
                        {edu.title}
                      </h3>
                      <p className="text-lg text-white/80 font-medium flex items-center gap-2">
                        <FaUniversity className="text-primary/70 text-sm" />
                        {edu.institution}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-text-muted font-mono text-sm bg-black/40 px-4 py-2 rounded-full w-fit border border-white/5 shadow-inner">
                      <FaCalendarAlt size={12} className="text-primary/70" />
                      <span>{edu.duration}</span>
                    </div>
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

export default Education;
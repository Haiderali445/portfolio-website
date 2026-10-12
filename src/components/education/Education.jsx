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
    <section id="education" className="relative z-10 isolate overflow-hidden bg-black/20 py-24">
      <div className="container relative z-10 mx-auto max-w-6xl px-6">
        {/* Section Header */}
        <div className="mb-14 text-center flex flex-col items-center">
          <h2 className="text-3xl md:text-5xl font-sans font-bold text-white tracking-tight">
            Academic <span className="text-white/40">Foundation</span>
          </h2>

          {/* Non-destructive UI filter input */}
          {educations.length > 2 && (
            <div className="relative w-full max-w-xs mt-6">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                <FaSearch size={12} />
              </span>
              <input
                type="text"
                placeholder="Search education..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#181818] border border-white/10 rounded-full pl-9 pr-4 py-2 text-xs text-white placeholder-text-muted focus:outline-none focus:border-cyan-400/50 transition-colors"
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
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: index * 0.1 }}
                className="relative pl-6 md:pl-12 group"
              >
                {/* Timeline Dot with Glow Effect */}
                <span className="absolute -left-[9px] top-6 w-4 h-4 rounded-full bg-black border-2 border-cyan-400 group-hover:bg-cyan-400 group-hover:shadow-[0_0_16px_rgba(6,182,212,0.8)] transition-all duration-300" />

                <div className="relative overflow-hidden p-8 rounded-3xl border border-white/[0.08] bg-surface-1/90 backdrop-blur-xl hover:bg-surface-2/90 hover:border-cyan-400/35 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
                  {/* Top Specular Edge */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/25 to-transparent"
                  />
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                        {edu.title}
                      </h3>
                      <p className="text-lg text-white/80 font-medium flex items-center gap-2">
                        <FaUniversity className="text-cyan-400 text-sm" />
                        {edu.institution}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-white/70 font-mono text-xs bg-surface-2 px-4 py-2 rounded-full w-fit border border-white/[0.08]">
                      <FaCalendarAlt size={12} className="text-cyan-400" />
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
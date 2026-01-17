import React from "react";
import Marquee from "react-fast-marquee";
import { skillsImage } from "../../utils/skill-image";

const SkillCard = ({ title, skills, glowClass, glowRGB, className }) => (
  <div
    className={`p-8 rounded-3xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl relative overflow-hidden group transition-all duration-500 hover:scale-[1.02] ${className} hover:border-opacity-50 hover:shadow-[0_0_50px_-12px_rgba(var(--glow-rgb),0.4)]`}
    style={{ '--glow-rgb': glowRGB }}
  >
    {/* Dynamic Background Glow */}
    <div className={`absolute inset-0 bg-gradient-to-br ${glowClass.replace('bg-', 'from-')} to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-700`} />

    {/* Border Glow */}
    <div className={`absolute inset-0 rounded-3xl border-2 border-transparent ${glowClass.replace('bg-', 'group-hover:border-')}/40 transition-all duration-500`} />

    <h3 className="text-2xl font-bold mb-8 text-white relative z-10 flex items-center gap-3">
      <span className={`w-2 h-8 rounded-full ${glowClass}`} />
      {title}
    </h3>

    <div className="flex flex-wrap gap-3 relative z-10">
      {skills.map((skill, i) => (
        <div key={i} className="relative group/skill">
          <span className="relative z-10 px-4 py-2 text-sm font-medium font-mono text-white/60 bg-black/40 rounded-lg border border-white/5 group-hover/skill:border-white/20 group-hover/skill:text-white transition-all cursor-default block backdrop-blur-sm">
            {skill.name}
          </span>
        </div>
      ))}
    </div>
  </div>
);

function Skills({ skills = [] }) {
  // Glow Config Map based on Category Name
  const glowConfig = {
    'AI': { class: 'bg-purple-500', rgb: '168, 85, 247' },
    'Backend': { class: 'bg-blue-500', rgb: '59, 130, 246' },
    'Solutions': { class: 'bg-emerald-500', rgb: '16, 185, 129' },
    'Other': { class: 'bg-primary', rgb: '0, 234, 255' } // Cyan primary
  };

  // Group skills by category
  const categories = skills.reduce((acc, skill) => {
    const cat = skill.category || "Other";
    if (!acc[cat]) {
      const config = glowConfig[cat] || glowConfig['Other'];
      acc[cat] = {
        title: cat,
        glowClass: config.class,
        glowRGB: config.rgb,
        items: []
      };
    }
    acc[cat].items.push(skill);
    return acc;
  }, {});

  const categoryKeys = Object.keys(categories);

  return (
    <section id="skills" className="py-32 relative z-10 overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="mb-16 md:mb-24 text-center">
          <h2 className="text-4xl md:text-6xl font-sans font-bold mb-6 text-white">
            Technical <span className="text-text-muted">Proficiency</span>
          </h2>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
          {categoryKeys.map((key) => (
            <SkillCard
              key={key}
              title={key}
              skills={categories[key].items}
              glowClass={categories[key].glowClass}
              glowRGB={categories[key].glowRGB}
              className="lg:col-span-1 min-h-[300px]"
            />
          ))}
        </div>

        {/* Infinite Marquee */}
        <div className="w-full py-10 border-y border-glass-border bg-black/20 backdrop-blur-sm relative overflow-hidden">
          {/* Gradient Masks */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#050505] to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none" />

          <Marquee gradient={false} speed={50} pauseOnHover>
            {skills.map((skill, id) => {
              const img = skillsImage(skill.name);
              if (!img) return null;
              return (
                <div key={id} className="mx-12 flex flex-col items-center gap-4 group min-w-[100px]">
                  <div className="w-16 h-16 relative transition-transform duration-300 group-hover:scale-110">
                    <img
                      src={img}
                      alt={skill.name}
                      className="w-full h-full object-contain filter brightness-0 invert opacity-70 group-hover:opacity-100 transition-all duration-300"
                    />
                  </div>
                  <p className="text-sm font-mono text-text-muted opacity-0 group-hover:opacity-100 transition-opacity duration-300">{skill.name}</p>
                </div>
              );
            })}
          </Marquee>
        </div>
      </div>
    </section>
  );
}

export default Skills;

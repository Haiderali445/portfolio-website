import React from "react";
import { skillsData } from "../../utils/data/skills";
import { skillsImage } from "../../utils/skill-image";
import Marquee from "react-fast-marquee";

// Helper to categorize skills into the new 2026 buckets
const categories = {
  AI: ["AI Workflow Architecture", "Python", "TensorFlow", "PyTorch", "OpenAI", "LangChain"],
  Backend: ["Backend Systems Engineering", "Node JS", "Express", "Microservices", "Docker", "Kubernetes", "PostgreSQL"],
  Solutions: ["Cloud Solutions Architect", "AWS", "Google Cloud", "Git", "CI/CD Pipelines", "React", "Next JS"]
};

// Brand Color Map for Glow
const glowColors = {
  "AI Workflow Architecture": "bg-purple-500",
  "Backend Systems Engineering": "bg-blue-500",
  "Cloud Solutions Architect": "bg-emerald-500",
  // Map standard skills too for micro-glows inside cards
  "Python": "bg-yellow-400",
  "React": "bg-blue-400",
  "AWS": "bg-orange-500",
  "default": "bg-primary"
};

const SkillCard = ({ title, skills, glowColor, className }) => (
  <div className={`p-8 rounded-3xl glass-card border border-glass-border relative overflow-hidden group ${className}`}>
    {/* Dynamic Background Glow based on Category */}
    <div className={`absolute inset-0 bg-gradient-to-br ${glowColor} to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

    <h3 className="text-2xl font-bold mb-6 text-white relative z-10">{title}</h3>

    <div className="flex flex-wrap gap-3 relative z-10">
      {skills.map((skill, i) => {
        // Fallback if specific skill isn't in categories but is in skillsData
        return (
          <div key={i} className="relative group/skill">
            <span className="relative z-10 px-3 py-1.5 text-sm font-mono text-text-muted bg-black/40 rounded-md border border-white/5 hover:border-white/30 hover:text-white transition-all cursor-default block">
              {skill}
            </span>
          </div>
        );
      })}
    </div>
  </div>
);

function Skills() {
  // Filter skills based on the new categories
  const aiSkills = skillsData.filter(s => categories.AI.includes(s) || s.includes("AI"));
  const backendSkills = skillsData.filter(s => categories.Backend.includes(s) || s.includes("Backend") || s.includes("DB"));
  const solutionSkills = skillsData.filter(s => categories.Solutions.includes(s) || (!categories.AI.includes(s) && !categories.Backend.includes(s)));

  return (
    <section id="skills" className="py-32 relative z-10 overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="mb-16 md:mb-24 text-center">
          <h2 className="text-4xl md:text-6xl font-sans font-bold mb-6 text-white">
            Technical <span className="text-text-muted">Proficiency</span>
          </h2>
        </div>

        {/* Bento Grid Layout with Specific Glows */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
          <SkillCard
            title="AI Workflow Architecture"
            skills={aiSkills}
            glowColor="from-purple-500"
            className="lg:col-span-1 min-h-[300px]"
          />
          <SkillCard
            title="Backend Engineering"
            skills={backendSkills}
            glowColor="from-blue-500"
            className="lg:col-span-1 min-h-[300px]"
          />
          <SkillCard
            title="AI Solutions"
            skills={solutionSkills}
            glowColor="from-emerald-500"
            className="lg:col-span-1 min-h-[300px]"
          />
        </div>

        {/* Infinite Marquee with Mask and White Silhouette Filters */}
        <div className="w-full py-10 border-y border-glass-border bg-black/20 backdrop-blur-sm relative">
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

          <Marquee gradient={false} speed={50} pauseOnHover>
            {skillsData.map((skill, id) => {
              const img = skillsImage(skill);
              if (!img) return null;
              return (
                <div key={id} className="mx-12 flex flex-col items-center gap-4 group">
                  <div className="w-16 h-16 relative transition-transform duration-300 group-hover:scale-110">
                    <img
                      src={img}
                      alt={skill}
                      className="w-full h-full object-contain filter brightness-0 invert opacity-70 group-hover:opacity-100 transition-all duration-300"
                    />
                  </div>
                </div>
              )
            })}
          </Marquee>
        </div>
      </div>
    </section>
  );
}

export default Skills;

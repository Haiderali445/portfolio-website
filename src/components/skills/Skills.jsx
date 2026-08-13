import React from "react";
import Marquee from "react-fast-marquee";
import { skillsImage } from "../../utils/images/skill-image";

const getBestIcon = (skillName) => {
  if (!skillName) return null;

  let icon = skillsImage(skillName);
  if (icon) return icon;

  const segments = skillName
    .split(/[/&]/)
    .map((s) => s.trim())
    .filter(Boolean);

  for (const seg of segments) {
    icon = skillsImage(seg);
    if (icon) return icon;
  }

  for (const seg of segments) {
    for (const word of seg.split(/\s+/).filter((w) => w.length > 1)) {
      icon = skillsImage(word);
      if (icon) return icon;
    }
  }

  return null;
};

const SkillCard = ({
  title,
  skills = [],
  glowClass = "bg-blue-500",
  glowRGB = "59, 130, 246",
  className = "",
}) => {
  const skillList = Array.isArray(skills) ? skills : [];

  return (
    <div
      className={`p-8 rounded-3xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl relative overflow-hidden group transition-all duration-500 hover:scale-[1.02] ${className} hover:border-opacity-50 hover:shadow-[0_0_50px_-12px_rgba(var(--glow-rgb),0.4)] flex flex-col`}
      style={{ "--glow-rgb": glowRGB }}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${glowClass.replace(
          "bg-",
          "from-"
        )} to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-700`}
      />

      <div
        className={`absolute inset-0 rounded-3xl border-2 border-transparent ${glowClass.replace(
          "bg-",
          "group-hover:border-"
        )}/40 transition-all duration-500`}
      />

      <div
        className={`absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-${glowClass.replace(
          "bg-",
          ""
        )} to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500`}
      />

      <h3 className="text-2xl font-bold mb-8 text-white relative z-10 flex items-center gap-3">
        <span className={`w-2 h-8 rounded-full ${glowClass}`} />
        {title}
      </h3>

      <div className="flex flex-wrap gap-2 relative z-10 flex-grow content-start">
        {skillList.map((skill, i) => {
          if (!skill) return null;

          const icon = getBestIcon(skill.name);

          return (
            <span
              key={i}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium font-mono text-white/60 bg-black/40 rounded-lg border border-white/5 hover:border-white/20 hover:text-white transition-all cursor-default backdrop-blur-sm whitespace-nowrap"
            >
              {icon && (
                <img
                  src={icon}
                  alt={skill.name || ""}
                  className="w-4 h-4 object-contain filter brightness-0 invert opacity-70"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              )}

              {skill.name}
            </span>
          );
        })}
      </div>
    </div>
  );
};

const MarqueeFade = ({ fromColor = "from-black" }) => (
  <>
    <div
      className={`pointer-events-none absolute left-0 top-0 bottom-0 w-28 z-10 bg-gradient-to-r ${fromColor} to-transparent`}
    />
    <div
      className={`pointer-events-none absolute right-0 top-0 bottom-0 w-28 z-10 bg-gradient-to-l ${fromColor} to-transparent`}
    />
  </>
);

function Skills({ skills = [] }) {
  const skillList = Array.isArray(skills)
    ? skills.filter((skill) => skill && typeof skill === "object")
    : [];

  if (skillList.length === 0) return null;

  const glowConfig = {
    Languages: {
      class: "bg-indigo-600",
      rgb: "79, 70, 229",
    },
    Frameworks: {
      class: "bg-cyan-500",
      rgb: "6, 182, 212",
    },
    AI: {
      class: "bg-purple-500",
      rgb: "168, 85, 247",
    },
    Systems: {
      class: "bg-emerald-500",
      rgb: "16, 185, 129",
    },
    Solutions: {
      class: "bg-orange-500",
      rgb: "249, 115, 22",
    },
    Tools: {
      class: "bg-yellow-500",
      rgb: "234, 179, 8",
    },
    Other: {
      class: "bg-blue-500",
      rgb: "59, 130, 246",
    },
  };

  const categories = skillList.reduce((acc, skill) => {
    const cat = skill.category || "Other";
    const config = glowConfig[cat] || glowConfig.Other;

    if (!acc[cat]) {
      acc[cat] = {
        title: cat,
        glowClass: config.class,
        glowRGB: config.rgb,
        items: [],
      };
    }

    acc[cat].items.push(skill);

    return acc;
  }, {});

  const skillsWithIcons = skillList.filter((skill) =>
    getBestIcon(skill.name)
  );

  return (
    <section
      id="skills"
      className="py-20 relative z-10 overflow-hidden"
    >
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Technical{" "}
            <span className="text-white/40">Proficiency</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20 auto-rows-fr">
          {Object.entries(categories).map(([key, data]) => (
            <SkillCard
              key={key}
              title={data?.title || key}
              skills={Array.isArray(data?.items) ? data.items : []}
              glowClass={data?.glowClass || glowConfig.Other.class}
              glowRGB={data?.glowRGB || glowConfig.Other.rgb}
            />
          ))}
        </div>

        <div className="flex flex-col gap-0">
          <div className="relative w-full py-5 overflow-hidden border-t border-white/[0.06]">
            <MarqueeFade fromColor="from-black" />

            <Marquee
              gradient={false}
              speed={55}
              pauseOnHover
            >
              {skillsWithIcons.map((skill, id) => {
                const icon = getBestIcon(skill.name);

                if (!icon) return null;

                return (
                  <div
                    key={`${skill.name}-${id}`}
                    title={skill.name}
                    className="mx-2.5 w-[52px] h-[52px] rounded-2xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center hover:bg-white/[0.10] hover:border-white/[0.18] hover:scale-110 transition-all duration-300 group cursor-default"
                  >
                    <img
                      src={icon}
                      alt={skill.name}
                      className="w-7 h-7 object-contain filter brightness-0 invert opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                      onError={(e) => {
                        const tile = e.currentTarget.parentElement;
                        if (tile) {
                          tile.style.display = "none";
                        }
                      }}
                    />
                  </div>
                );
              })}
            </Marquee>
          </div>

          <div className="relative w-full py-6 border-y border-white/10 bg-black/20 backdrop-blur-md overflow-hidden">
            <MarqueeFade fromColor="from-[#0a0a0a]" />

            <Marquee
              gradient={false}
              speed={50}
              pauseOnHover
              direction="right"
            >
              {skillList.map((skill, id) => {
                const icon = getBestIcon(skill.name);

                return (
                  <div
                    key={`${skill.name}-${id}`}
                    className="mx-4 px-4 py-2 rounded-xl bg-white/5 border border-white/5 flex items-center gap-3 hover:bg-white/[0.08] hover:border-white/[0.12] transition-all duration-200"
                  >
                    {icon && (
                      <img
                        src={icon}
                        alt={skill.name}
                        className="w-6 h-6 object-contain filter brightness-0 invert opacity-80"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    )}

                    <span className="text-sm font-mono text-white/70">
                      {skill.name}
                    </span>
                  </div>
                );
              })}
            </Marquee>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Skills;
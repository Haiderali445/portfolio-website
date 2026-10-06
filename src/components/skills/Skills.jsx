import React from "react";
import Marquee from "react-fast-marquee";
import { useReducedMotion } from "framer-motion";
import { skillsImage } from "../../utils/images/skill-image";

const getBestIcon = (skillName) => {
  if (typeof skillName !== "string" || !skillName.trim()) return null;

  const normalizedName = skillName.trim();

  let icon = skillsImage(normalizedName);
  if (icon) return icon;

  const segments = normalizedName
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

const categoryGlowConfig = {
  Languages: { className: "bg-indigo-600", rgb: "79, 70, 229" },
  Frameworks: { className: "bg-cyan-500", rgb: "6, 182, 212" },
  AI: { className: "bg-purple-500", rgb: "168, 85, 247" },
  Systems: { className: "bg-emerald-500", rgb: "16, 185, 129" },
  Solutions: { className: "bg-orange-500", rgb: "249, 115, 22" },
  Tools: { className: "bg-yellow-500", rgb: "234, 179, 8" },
  Other: { className: "bg-blue-500", rgb: "59, 130, 246" },
};

const getCategoryGlow = (category) =>
  categoryGlowConfig[category] || categoryGlowConfig.Other;

const SkillCard = ({
  title,
  skills = [],
  glowClass = "bg-blue-500",
  glowRGB = "59, 130, 246",
}) => {
  const skillList = Array.isArray(skills) ? skills : [];

  return (
    <div
      className="group/card relative flex min-w-0 flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-surface-1/80 p-5 backdrop-blur-sm transition-[background-color,border-color,box-shadow] duration-200 hover:border-[rgba(var(--glow-rgb),0.42)] hover:bg-surface-2 hover:shadow-[0_0_22px_-14px_rgba(var(--glow-rgb),0.5)] sm:p-6"
      style={{ "--glow-rgb": glowRGB }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover/card:opacity-100"
        style={{
          background: `radial-gradient(ellipse at top left, rgba(${glowRGB}, 0.12), transparent 70%)`,
        }}
      />
      <h3 className="relative z-10 mb-5 flex items-center gap-3 text-lg font-semibold text-white sm:text-xl">
        <span className={`h-6 w-1.5 rounded-full ${glowClass}`} aria-hidden="true" />
        {title}
      </h3>

      <div className="relative z-10 flex flex-grow flex-wrap content-start gap-2">
        {skillList.map((skill, index) => {
          if (!skill) return null;

          const icon = getBestIcon(skill.name);

          return (
            <span
              key={`${skill.name || "skill"}-${index}`}
              className="group/pill relative isolate inline-flex min-h-8 items-center gap-2 whitespace-nowrap rounded-lg border border-white/[0.08] bg-black/30 px-2.5 py-1.5 font-mono text-xs font-medium text-white/70 transition-[border-color,color,box-shadow] duration-200 hover:border-[rgba(var(--glow-rgb),0.5)] hover:text-white hover:shadow-[0_0_14px_-10px_rgba(var(--glow-rgb),0.65)]"
            >
              {icon && (
                <img
                  src={icon}
                  alt=""
                  aria-hidden="true"
                  className="h-4 w-4 shrink-0 object-contain filter brightness-0 invert opacity-60 transition-[filter,opacity] duration-200 group-hover/pill:filter-none group-hover/pill:opacity-100"
                  onError={(e) => {
                    e.currentTarget.style.visibility = "hidden";
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

const SkillMarquee = ({ children, direction, speed, shouldReduceMotion }) => (
  shouldReduceMotion ? (
    <div className="flex flex-wrap items-center justify-center gap-3 px-4 py-2">
      {children}
    </div>
  ) : (
    <Marquee gradient={false} speed={speed} pauseOnHover direction={direction}>
      {children}
    </Marquee>
  )
);

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

const SkillsSkeleton = () => (
  <section id="skills" className="relative z-10 overflow-hidden bg-background py-20">
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.012] [background-image:linear-gradient(to_right,rgba(255,255,255,0.8)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.8)_1px,transparent_1px)] [background-size:32px_32px]" />
    <div className="container relative z-10 mx-auto max-w-7xl px-6">
      <div className="mb-10 text-center">
        <div className="mx-auto h-10 w-64 rounded-full skeleton-shimmer bg-white/[0.06]" />
      </div>

      <div className="mb-8 flex h-[68px] items-center gap-3 overflow-hidden border-y border-white/[0.06] px-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="h-11 w-11 shrink-0 rounded-xl skeleton-shimmer bg-white/[0.06]" />
        ))}
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="min-h-48 rounded-2xl border border-white/[0.08] bg-surface-1/80 p-5 sm:p-6">
            <div className="mb-5 h-6 w-40 rounded-lg skeleton-shimmer bg-white/[0.06]" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 6 }).map((__, itemIndex) => (
                <div key={itemIndex} className="h-8 w-24 rounded-lg skeleton-shimmer bg-white/[0.06]" />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex h-16 items-center gap-3 overflow-hidden border-y border-white/[0.06] px-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-9 w-28 shrink-0 rounded-lg skeleton-shimmer bg-white/[0.06]" />
        ))}
      </div>
    </div>
  </section>
);

function Skills({ skills = [], isLoading = false }) {
  const shouldReduceMotion = Boolean(useReducedMotion());
  const skillList = Array.isArray(skills)
    ? skills.filter((skill) => skill && typeof skill === "object")
    : [];

  if (isLoading) return <SkillsSkeleton />;
  if (skillList.length === 0) return null;

  const categories = skillList.reduce((result, skill) => {
    const category = skill.category || "Other";

    if (!result[category]) {
      result[category] = {
        title: category,
        ...getCategoryGlow(category),
        items: [],
      };
    }

    result[category].items.push(skill);
    return result;
  }, {});

  const skillsWithIcons = skillList.filter((skill) => getBestIcon(skill.name));

  return (
    <section id="skills" className="relative z-10 overflow-hidden bg-background py-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.012] [background-image:linear-gradient(to_right,rgba(255,255,255,0.8)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.8)_1px,transparent_1px)] [background-size:32px_32px]"
      />
      <div className="container relative z-10 mx-auto max-w-7xl px-6">
        <header className="mb-8 text-center sm:mb-10">
          <h2 className="mb-3 text-3xl font-bold text-white sm:text-4xl md:text-5xl">
            Technical <span className="text-white/40">Proficiency</span>
          </h2>
        </header>

        <div className="relative mb-8 overflow-hidden border-y border-white/[0.06] py-3">
          <MarqueeFade fromColor="from-background" />
          <SkillMarquee direction="left" speed={48} shouldReduceMotion={shouldReduceMotion}>
            {skillsWithIcons.map((skill, index) => {
              const icon = getBestIcon(skill.name);
              const categoryGlow = getCategoryGlow(skill.category);

              return (
                <div
                  key={`${skill.name}-${index}`}
                  title={skill.name}
                  className="group/item relative isolate mx-2 flex h-12 w-12 shrink-0 cursor-default items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.035] transition-[background-color,border-color,box-shadow] duration-200 hover:border-[rgba(var(--glow-rgb),0.45)] hover:bg-white/[0.07] hover:shadow-[0_0_18px_-12px_rgba(var(--glow-rgb),0.65)]"
                  style={{ "--glow-rgb": categoryGlow.rgb }}
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -inset-1 -z-10 rounded-xl opacity-0 blur-md transition-opacity duration-200 group-hover/item:opacity-30"
                    style={{ backgroundColor: `rgb(${categoryGlow.rgb})` }}
                  />
                  <img
                    src={icon}
                    alt=""
                    aria-hidden="true"
                    className="relative z-10 h-6 w-6 object-contain filter brightness-0 invert opacity-60 transition-[filter,opacity] duration-200 group-hover/item:filter-none group-hover/item:opacity-100"
                    onError={(event) => {
                      event.currentTarget.style.visibility = "hidden";
                    }}
                  />
                </div>
              );
            })}
          </SkillMarquee>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(categories).map(([key, category]) => (
            <SkillCard
              key={key}
              title={category.title || key}
              skills={category.items}
              glowClass={category.className}
              glowRGB={category.rgb}
            />
          ))}
        </div>

        <div className="relative overflow-hidden border-y border-white/[0.06] bg-surface-1/50 py-3 backdrop-blur-sm">
          <MarqueeFade fromColor="from-background" />
          <SkillMarquee direction="right" speed={44} shouldReduceMotion={shouldReduceMotion}>
            {skillList.map((skill, index) => {
              const icon = getBestIcon(skill.name);
              const categoryGlow = getCategoryGlow(skill.category);

              return (
                <div
                  key={`${skill.name || "skill"}-${index}`}
                  className="group/pill relative isolate mx-2 inline-flex min-h-10 shrink-0 items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.035] px-3 py-2 font-mono text-xs text-white/75 transition-[background-color,border-color,box-shadow,color] duration-200 hover:border-[rgba(var(--glow-rgb),0.45)] hover:bg-white/[0.07] hover:text-white hover:shadow-[0_0_18px_-12px_rgba(var(--glow-rgb),0.65)]"
                  style={{ "--glow-rgb": categoryGlow.rgb }}
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -inset-1 -z-10 rounded-lg opacity-0 blur-md transition-opacity duration-200 group-hover/pill:opacity-30"
                    style={{ backgroundColor: `rgb(${categoryGlow.rgb})` }}
                  />
                  {icon && (
                    <img
                      src={icon}
                      alt=""
                      aria-hidden="true"
                      className="relative z-10 h-4 w-4 shrink-0 object-contain filter brightness-0 invert opacity-60 transition-[filter,opacity] duration-200 group-hover/pill:filter-none group-hover/pill:opacity-100"
                      onError={(event) => {
                        event.currentTarget.style.visibility = "hidden";
                      }}
                    />
                  )}
                  <span className="relative z-10">{skill.name}</span>
                </div>
              );
            })}
          </SkillMarquee>
        </div>
      </div>
    </section>
  );
}

export default Skills;
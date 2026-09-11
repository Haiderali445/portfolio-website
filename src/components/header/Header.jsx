import React from "react";
import { Typewriter } from "react-simple-typewriter";
import { motion, useScroll, useTransform } from "framer-motion";
import SocialIcons from "../sidebar/socialcons";
import MagneticButton from "../helper/MagneticButton";

const Header = ({ personalData = {}, experience = [] }) => {
  const { scrollY } = useScroll();

  // Subtle physical movement only.
  // Content remains readable and never fades during scroll.
  const imageY = useTransform(scrollY, [0, 600], [0, 14]);
  const contentY = useTransform(scrollY, [0, 500], [0, -6]);

  const scrollToProjects = () => {
    document.getElementById("projects")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const scrollToServices = () => {
    document.getElementById("services")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const typewriterTitles = Array.isArray(personalData.typewriterTitles)
    ? personalData.typewriterTitles
    : [];

  // Dynamic fallback for the badge title overlaying the image
 // Prioritize profile designation over typewriter titles
const badgeTitle = 
  personalData.designation || 
  typewriterTitles[0] || 
  personalData.title || 
  personalData.location || 
  "Software Engineer";

  /*
   * Pick the first experience item according to sortOrder.
   */
  const topExperience = Array.isArray(experience)
    ? [...experience].sort((a, b) => {
        const aOrder = Number(a?.sortOrder ?? Number.MAX_SAFE_INTEGER);

        const bOrder = Number(b?.sortOrder ?? Number.MAX_SAFE_INTEGER);

        return aOrder - bOrder;
      })[0]
    : null;

  const normalizedCompanyUrl = (() => {
    if (!topExperience) return "";

    const rawUrl = topExperience.companyUrl ?? topExperience.company_url ?? "";

    return typeof rawUrl === "string" ? rawUrl.trim() : "";
  })();

  const topCompanyName = topExperience?.company || "";

  /*
   * Entrance animation.
   */
  const container = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.08,
      },
    },
  };

  const item = {
    hidden: {
      opacity: 0,
      y: 14,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <header
      id="home"
      className="
        relative
        flex
        min-h-[100svh]
        w-full
        items-center
        overflow-hidden
        bg-background
        pb-24
        pt-24
        sm:pb-28
        sm:pt-28
        lg:pb-20
        lg:pt-24
      "
    >
      {/* =========================================================
          BACKGROUND SYSTEM
          ========================================================= */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          overflow-hidden
        "
      >
        {/* Architectural grid */}
        <div
          className="
            absolute
            inset-0
            opacity-[0.035]
            [background-image:linear-gradient(to_right,rgba(255,255,255,0.8)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.8)_1px,transparent_1px)]
            [background-size:32px_32px]
          "
        />

        {/* Bottom depth fade */}
        <div
          className="
            absolute
            inset-x-0
            bottom-0
            h-32
            bg-gradient-to-t
            from-background
            to-transparent
          "
        />
      </div>

      {/* =========================================================
          MAIN CONTENT
          ========================================================= */}
      <div
        className="
          relative
          z-10
          mx-auto
          flex
          w-full
          max-w-7xl
          flex-col
          px-5
          sm:px-8
          md:px-10
          lg:px-12
          xl:px-16
        "
      >
        <div
          className="
            grid
            w-full
            grid-cols-1
            items-center
            gap-12
            sm:gap-14
            md:gap-16
            lg:grid-cols-[1.2fr_0.8fr]
            lg:gap-12
            xl:grid-cols-[1.22fr_0.78fr]
            xl:gap-16
          "
        >
          {/* =====================================================
              LEFT — INTRODUCTION
              ===================================================== */}
          <motion.div
            style={{ y: contentY }}
            variants={container}
            initial="hidden"
            animate="visible"
            className="
              min-w-0
              w-full
              max-w-3xl
              lg:self-center
            "
          >
            {/* ---------------------------------------------------
                Availability
                --------------------------------------------------- */}
            {personalData.availabilityStatus && (
              <motion.div variants={item} className="mb-6">
                <span
                  className="
                    inline-flex
                    items-center
                    gap-2.5
                    rounded-lg
                    border
                    border-white/[0.08]
                    bg-surface-2
                    px-3.5
                    py-1.5
                    font-mono
                    text-[11px]
                    font-semibold
                    uppercase
                    tracking-wider
                    text-white/55
                    shadow-card-resting
                  "
                >
                  <span
                    className="
                      relative
                      flex
                      h-2
                      w-2
                      shrink-0
                    "
                  >
                    <span
                      className="
                        absolute
                        inline-flex
                        h-full
                        w-full
                        animate-ping
                        rounded-full
                        bg-emerald-400
                        opacity-50
                      "
                    />

                    <span
                      className="
                        relative
                        inline-flex
                        h-2
                        w-2
                        rounded-full
                        bg-emerald-400
                      "
                    />
                  </span>

                  {personalData.availabilityStatus}
                </span>
              </motion.div>
            )}

            {/* ---------------------------------------------------
                Greeting + Name
                --------------------------------------------------- */}
            <motion.div variants={item} className="space-y-5">
              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >
                {/* UPDATED: accent color */}
                <span
                  className="
                    font-sans
                    text-lg
                    font-bold
                    tracking-tight
                    text-cyan-400
                    drop-shadow-[0_0_12px_rgba(34,211,238,0.15)]
                    sm:text-xl
                  "
                >
                  Hello, I'm
                </span>

                {/* UPDATED: accent line */}
                <span
                  aria-hidden="true"
                  className="
                    h-px
                    w-10
                    bg-gradient-to-r
                    from-cyan-400/70
                    to-cyan-400/10
                    sm:w-14
                  "
                />
              </div>

              <h1
                className="
                  m-0
                  max-w-full
                  break-words
                  font-sans
                  text-[clamp(3.25rem,7.2vw,6.5rem)]
                  font-extrabold
                  leading-[0.86]
                  tracking-[-0.055em]
                  text-gradient
                "
              >
                {personalData.name}
              </h1>
            </motion.div>

            {/* ---------------------------------------------------
                Current Position
                --------------------------------------------------- */}
            {topCompanyName && (
              <motion.div variants={item} className="mt-7">
                <div
                  className="
                    flex
                    flex-wrap
                    items-center
                    gap-x-2
                    gap-y-1
                    font-mono
                    text-sm
                    font-semibold
                    tracking-wide
                    sm:text-base
                  "
                >
                  <span className="text-white/45">Currently</span>

                  <span
                    aria-hidden="true"
                    className="
                      font-bold
                      text-cyan-400
                      drop-shadow-[0_0_10px_rgba(6,182,212,0.25)]
                    "
                  >
                    @
                  </span>

                  {normalizedCompanyUrl ? (
                    <a
                      href={normalizedCompanyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
                        truncate
                        text-white
                        transition-colors
                        duration-200
                        hover:text-cyan-400
                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-cyan-400/60
                        focus-visible:ring-offset-2
                        focus-visible:ring-offset-background
                      "
                    >
                      {topCompanyName}
                    </a>
                  ) : (
                    <span className="truncate text-white">
                      {topCompanyName}
                    </span>
                  )}
                </div>
              </motion.div>
            )}

            {/* ---------------------------------------------------
                Typewriter Role
                --------------------------------------------------- */}
            {typewriterTitles.length > 0 && (
              <motion.div
                variants={item}
                className="
                  mt-4
                  flex
                  min-h-[38px]
                  min-w-0
                  max-w-full
                  items-center
                  overflow-hidden
                  font-mono
                  text-base
                  font-bold
                  sm:mt-5
                  sm:text-xl
                  md:text-2xl
                "
              >
                <span
                  aria-hidden="true"
                  className="
                    mr-3
                    select-none
                    font-extrabold
                    text-cyan-400
                    drop-shadow-[0_0_12px_rgba(6,182,212,0.35)]
                    sm:mr-3.5
                  "
                >
                  &gt;
                </span>

                <span className="min-w-0 text-white/90">
                  <Typewriter
                    words={typewriterTitles}
                    loop
                    cursor
                    cursorStyle="|"
                    typeSpeed={65}
                    deleteSpeed={40}
                    delaySpeed={2200}
                  />
                </span>
              </motion.div>
            )}

            {/* ===================================================
                CTA SYSTEM
                =================================================== */}
            <motion.div
              variants={item}
              className="
                mt-9
                flex
                flex-wrap
                items-center
                gap-4
                pb-4
              "
            >
              {/* Primary CTA */}
              <MagneticButton onClick={scrollToServices}>
                <div
                  className="
                    inline-flex
                    min-h-11
                    items-center
                    justify-center
                    rounded-lg
                    bg-cyan-600
                    px-7
                    py-3.5
                    font-sans
                    text-sm
                    font-bold
                    tracking-wide
                    text-white
                    shadow-glow-azure
                    transition-all
                    duration-200
                    hover:bg-azure-500
                    hover:shadow-glow-azure
                    active:scale-[0.98]
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-azure-400/70
                    focus-visible:ring-offset-2
                    focus-visible:ring-offset-background
                  "
                >
                  Explore Services
                </div>
              </MagneticButton>

              {/* Secondary CTA */}
              <MagneticButton onClick={scrollToProjects}>
                <div
                  className="
                    inline-flex
                    min-h-11
                    items-center
                    justify-center
                    rounded-lg
                    border
                    border-white/[0.14]
                    bg-surface-2
                    px-7
                    py-3.5
                    font-sans
                    text-sm
                    font-bold
                    tracking-wide
                    text-white
                    transition-all
                    duration-200
                    hover:border-white/30
                    hover:bg-surface-1
                    active:scale-[0.98]
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-white/30
                    focus-visible:ring-offset-2
                    focus-visible:ring-offset-background
                  "
                >
                  View Work
                </div>
              </MagneticButton>

              {/* Social system */}
              <div
                className="
                  flex
                  min-h-11
                  items-center
                "
              >
                <SocialIcons personalData={personalData} />
              </div>
            </motion.div>
          </motion.div>

          {/* =====================================================
              RIGHT — PROFILE MEDIA
              ===================================================== */}
          <motion.div
            style={{ y: imageY }}
            initial={{
              opacity: 0,
              scale: 0.97,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: 0.8,
              delay: 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="
              relative
              mx-auto
              w-full
              max-w-[300px]
              sm:max-w-[330px]
              md:max-w-[350px]
              lg:mx-0
              lg:ml-auto
              lg:max-w-[370px]
              xl:max-w-[400px]
              lg:justify-self-end
            "
          >
            {/* Ambient image halo */}
            <div
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                -inset-7
                rounded-full
                bg-cyan-500/10
                opacity-40
                blur-3xl
              "
            />

            <div
              className="
                card-featured
                group
                relative
                overflow-hidden
                p-3
              "
            >
              <motion.img
                src={personalData.profile}
                alt={
                  personalData.name ? `${personalData.name} profile` : "Profile"
                }
                loading="eager"
                decoding="async"
                className="
                  relative
                  block
                  aspect-[4/5]
                  h-auto
                  w-full
                  rounded-xl
                  object-cover
                  grayscale
                  contrast-110
                  transition-all
                  duration-500
                  group-hover:scale-[1.015]
                  group-hover:grayscale-0
                "
              />

              {/* Dynamic Bottom Badge Overlay */}
              <div
                className="
                  absolute
                  bottom-6
                  left-6
                  z-20
                  flex
                  items-center
                  gap-2.5
                  rounded-lg
                  border
                  border-cyan-500/20
                  bg-black/80
                  px-3.5
                  py-1.5
                  shadow-lg
                  backdrop-blur-md
                  transition-all
                  duration-300
                  group-hover:border-cyan-400/40
                  group-hover:bg-black/90
                "
              >
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-500" />
                </span>
                <span className="font-mono text-xs font-semibold tracking-wide text-white/90">
                  {badgeTitle}
                </span>
              </div>

              {/* Image edge treatment */}
              <div
                aria-hidden="true"
                className="
                  pointer-events-none
                  absolute
                  inset-0
                  rounded-[inherit]
                  ring-1
                  ring-inset
                  ring-white/[0.06]
                "
              />

              {/* Soft image gradient */}
              <div
                aria-hidden="true"
                className="
                  pointer-events-none
                  absolute
                  inset-3
                  rounded-xl
                  bg-gradient-to-t
                  from-black/40
                  via-transparent
                  to-white/[0.03]
                  opacity-70
                "
              />
            </div>
          </motion.div>
        </div>
      </div>
    </header>
  );
};

export default Header;

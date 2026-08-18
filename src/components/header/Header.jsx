import React from "react";
import { Typewriter } from "react-simple-typewriter";
import { motion, useScroll, useTransform } from "framer-motion";
import SocialIcons from "../sidebar/socialcons";
import MagneticButton from "../helper/MagneticButton";

const Header = ({ personalData = {} }) => {
  const { scrollY } = useScroll();

  const imageY = useTransform(scrollY, [0, 600], [0, 30]);
  const contentY = useTransform(scrollY, [0, 500], [0, -18]);
  const contentOpacity = useTransform(scrollY, [0, 450], [1, 0.2]);

  const scrollToProjects = () => {
    const projects = document.getElementById("projects");

    if (projects) {
      projects.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const typewriterTitles = Array.isArray(personalData.typewriterTitles)
    ? personalData.typewriterTitles
    : [];

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
        pb-16
        pt-24
        sm:pb-20
        sm:pt-28
        lg:pb-12
        lg:pt-20
      "
    >
      {/* =========================================================
          BACKGROUND
      ========================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Soft primary glow */}
        <div
          className="
            absolute
            -left-40
            -top-40
            h-[480px]
            w-[480px]
            rounded-full
            bg-primary/[0.045]
            blur-[120px]
            sm:h-[560px]
            sm:w-[560px]
          "
        />

        {/* Very subtle secondary glow */}
        <div
          className="
            absolute
            -bottom-48
            -right-40
            h-[420px]
            w-[420px]
            rounded-full
            bg-primary/[0.025]
            blur-[120px]
            sm:h-[520px]
            sm:w-[520px]
          "
        />

        {/* Technical grid */}
        <div
          className="
            absolute
            inset-0
            opacity-[0.02]
            [background-image:linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)]
            [background-size:72px_72px]
          "
        />

        {/* Edge fades */}
        <div
          className="
            absolute
            inset-x-0
            bottom-0
            h-48
            bg-gradient-to-t
            from-background
            via-background/60
            to-transparent
          "
        />

        <div
          className="
            absolute
            inset-y-0
            left-0
            w-32
            bg-gradient-to-r
            from-background
            to-transparent
            opacity-60
          "
        />

        <div
          className="
            absolute
            inset-y-0
            right-0
            w-32
            bg-gradient-to-l
            from-background
            to-transparent
            opacity-60
          "
        />
      </div>

      {/* =========================================================
          MAIN CONTAINER
      ========================================================== */}

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
            lg:grid-cols-[1.08fr_0.92fr]
            lg:gap-10
            xl:grid-cols-[1fr_0.9fr]
            xl:gap-16
          "
        >
          {/* =======================================================
              LEFT — HERO CONTENT
          ======================================================== */}

          <motion.div
            style={{
              y: contentY,
              opacity: contentOpacity,
            }}
            className="
              min-w-0
              w-full
              max-w-2xl
            "
          >
            {/* Availability */}
            {personalData.availabilityStatus && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 12,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.55,
                  ease: "easeOut",
                }}
                className="
                  mb-7
                  inline-flex
                  max-w-full
                  items-center
                  gap-2.5
                  rounded-full
                  border
                  border-glass-border
                  bg-glass
                  px-3
                  py-1.5
                  backdrop-blur-md
                  sm:mb-8
                "
              >
                <span className="relative flex h-2 w-2 shrink-0">
                  <span
                    className="
                      absolute
                      inline-flex
                      h-full
                      w-full
                      animate-ping
                      rounded-full
                      bg-green-400
                      opacity-60
                    "
                  />

                  <span
                    className="
                      relative
                      inline-flex
                      h-2
                      w-2
                      rounded-full
                      bg-green-500
                      shadow-[0_0_10px_rgba(34,197,94,0.5)]
                    "
                  />
                </span>

                <span
                  className="
                    truncate
                    font-mono
                    text-[10px]
                    font-medium
                    uppercase
                    tracking-[0.12em]
                    text-green-400
                    sm:text-xs
                    sm:tracking-[0.14em]
                  "
                >
                  {personalData.availabilityStatus}
                </span>
              </motion.div>
            )}

            {/* =====================================================
                NAME
            ====================================================== */}

            <motion.div
              initial={{
                opacity: 0,
                y: 22,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.75,
                delay: 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div
                className="
                  mb-2
                  text-[clamp(1.75rem,3.2vw,2.8rem)]
                  font-normal
                  leading-none
                  tracking-[-0.035em]
                  text-text-muted
                "
              >
                Hello, I'm
              </div>

              <h1
                className="
                  m-0
                  max-w-full
                  break-words
                  font-sans
                  text-[clamp(2.9rem,5.8vw,5.4rem)]
                  font-bold
                  leading-[0.9]
                  tracking-[-0.045em]
                  text-white
                "
              >
                {personalData.name}
              </h1>
            </motion.div>

            {/* =====================================================
                TYPEWRITER
            ====================================================== */}

            {typewriterTitles.length > 0 && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 12,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.6,
                  delay: 0.3,
                }}
                className="
                  mt-6
                  flex
                  min-h-[30px]
                  min-w-0
                  max-w-full
                  items-center
                  gap-2
                  overflow-hidden
                  font-mono
                  text-base
                  font-semibold
                  text-text-muted
                  sm:mt-7
                  sm:text-lg
                  md:text-xl
                "
              >
                <span
                  className="
                    shrink-0
                    select-none
                    text-primary
                  "
                >
                  {">"}
                </span>

                <span className="min-w-0 truncate">
                  <Typewriter
                    words={typewriterTitles}
                    loop
                    cursor
                    cursorStyle="_"
                    typeSpeed={70}
                    deleteSpeed={45}
                    delaySpeed={2000}
                  />
                </span>
              </motion.div>
            )}

            {/* =====================================================
                ACTIONS
            ====================================================== */}

            <motion.div
              initial={{
                opacity: 0,
                y: 12,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.6,
                delay: 0.45,
              }}
              className="
                mt-8
                flex
                flex-col
                gap-5
                sm:flex-row
                sm:items-center
                sm:gap-6
              "
            >
              <MagneticButton onClick={scrollToProjects}>
                <div
                  className="
                    w-full
                    cursor-pointer
                    rounded-full
                    bg-white
                    px-7
                    py-3.5
                    text-center
                    text-sm
                    font-semibold
                    text-black
                    shadow-[0_0_24px_rgba(255,255,255,0.1)]
                    transition-all
                    duration-300
                    hover:bg-gray-200
                    hover:shadow-[0_0_32px_rgba(255,255,255,0.16)]
                    sm:w-auto
                    sm:px-8
                    sm:py-4
                  "
                >
                  View Work
                </div>
              </MagneticButton>

              <div
                className="
                  flex
                  min-h-[44px]
                  items-center
                "
              >
                <SocialIcons personalData={personalData} />
              </div>
            </motion.div>
          </motion.div>

          {/* =======================================================
              RIGHT — PROFILE IMAGE
          ======================================================== */}

         {/* =======================================================
    RIGHT — PROFILE IMAGE
======================================================== */}

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
    duration: 0.9,
    delay: 0.15,
    ease: [0.22, 1, 0.36, 1],
  }}
  className="
    relative
    mx-auto
    w-full
    max-w-[330px]
    sm:max-w-[370px]
    md:max-w-[410px]
    lg:mx-0
    lg:ml-auto
    lg:max-w-[430px]
    xl:max-w-[460px]
  "
>
  {/* Soft atmospheric glow */}
  <div
    className="
      pointer-events-none
      absolute
      inset-[8%]
      rounded-full
      bg-primary/[0.045]
      blur-[90px]
    "
  />

  {/* Image */}
  <div
    className="
      relative
      overflow-hidden
      rounded-[1.5rem]
      sm:rounded-[1.75rem]
    "
  >
    <motion.img
      src={personalData.profile}
      alt={personalData.name || "Profile"}
      className="
        relative
        block
        aspect-[4/5]
        h-auto
        w-full
        object-cover
        grayscale
      "
      whileHover={{
        scale: 1.025,
        filter: "grayscale(0%)",
      }}
      transition={{
        duration: 0.7,
        ease: "easeOut",
      }}
    />

    {/* Seamless atmospheric fade */}
    <div
      className="
        pointer-events-none
        absolute
        inset-0
        bg-gradient-to-t
        from-background/30
        via-transparent
        to-background/5
      "
    />

    {/* Very subtle edge — NOT a card border */}
    <div
      className="
        pointer-events-none
        absolute
        inset-0
        rounded-[1.5rem]
        ring-1
        ring-inset
        ring-white/[0.035]
        sm:rounded-[1.75rem]
      "
    />
  </div>
</motion.div>
        </div>

        {/* =========================================================
            BOTTOM SCROLL MARKER
        ========================================================== */}

        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.8,
            delay: 1,
          }}
          className="
            mt-12
            hidden
            items-center
            gap-3
            sm:flex
            lg:mt-10
          "
        >
          <span
            className="
              h-px
              w-8
              bg-white/10
            "
          />

          <span
            className="
              font-mono
              text-[9px]
              uppercase
              tracking-[0.18em]
              text-white/25
            "
          >
            Scroll
          </span>
        </motion.div>
      </div>
    </header>
  );
};

export default Header;
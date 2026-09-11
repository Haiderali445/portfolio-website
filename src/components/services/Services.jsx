import React from "react";
import {
  FaBrain,
  FaServer,
  FaDatabase,
  FaCode,
  FaPalette,
  FaShoppingCart,
  FaGlobe,
  FaArrowRight,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";

const resolveServiceMetadata = (service = {}) => {
  const name =
    typeof service.name === "string" ? service.name.toLowerCase() : "";

  const iconType =
    typeof service.icontype === "string" ? service.icontype.toLowerCase() : "";

  // AI / intelligent systems
  if (name.includes("llm") || name.includes("ai") || iconType.includes("ai")) {
    return {
      label: "AI & Automation",
      icon: FaBrain,
    };
  }

  // ERP / enterprise systems
  if (
    name.includes("erp") ||
    name.includes("enterprise") ||
    iconType.includes("erp")
  ) {
    return {
      label: "APIs & Systems",
      icon: FaServer,
    };
  }

  // Commerce
  if (
    name.includes("commerce") ||
    name.includes("store") ||
    name.includes("shop")
  ) {
    return {
      label: "Frontend & Web",
      icon: FaShoppingCart,
    };
  }

  // Management systems
  if (
    name.includes("management") ||
    name.includes("ims") ||
    name.includes("crm") ||
    name.includes("fms") ||
    name.includes("lms") ||
    name.includes("cms")
  ) {
    return {
      label: "System Design",
      icon: FaDatabase,
    };
  }

  // Web engineering
  if (
    name.includes("web") ||
    name.includes("spa") ||
    name.includes("development")
  ) {
    return {
      label: "Engineering",
      icon: FaCode,
    };
  }

  // UI / UX
  if (name.includes("ui") || name.includes("ux") || name.includes("design")) {
    return {
      label: "Product Design",
      icon: FaPalette,
    };
  }

  // Fallback
  return {
    label: "Capabilities",
    icon: FaGlobe,
  };
};

const Services = ({ services = [] }) => {
  const shouldReduceMotion = useReducedMotion();

  if (!services || services.length === 0) {
    return null;
  }

  return (
    <section
      id="services"
      className="relative z-10 overflow-hidden py-24 md:py-32"
    >
      {/* =========================================================
                Architectural Grid
                ========================================================= */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.025]"
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
                            linear-gradient(
                                to right,
                                rgba(255,255,255,0.8) 1px,
                                transparent 1px
                            ),
                            linear-gradient(
                                to bottom,
                                rgba(255,255,255,0.8) 1px,
                                transparent 1px
                            )
                        `,
            backgroundSize: "72px 72px",
            maskImage:
              "linear-gradient(to bottom, transparent, black 15%, black 80%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent, black 15%, black 80%, transparent)",
          }}
        />
      </div>

      <div className="container mx-auto max-w-7xl px-6">
        {/* =====================================================
                    Section Header
                    ===================================================== */}
        <div className="mb-16">
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={
              shouldReduceMotion
                ? undefined
                : {
                    duration: 0.5,
                    ease: [0.16, 1, 0.3, 1],
                  }
            }
          >
            <div className="mb-4 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-white/50">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
              SERVICES / CAPABILITIES
            </div>

            <h2 className="font-sans text-4xl font-extrabold leading-[1.08] tracking-tight text-white md:text-6xl">
              Engineering <br />
              <span className="text-text-muted">systems that scale.</span>
            </h2>
          </motion.div>
        </div>

        {/* =====================================================
                    Services Grid
                    ===================================================== */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => {
            const meta = resolveServiceMetadata(service);
            const IconComponent = meta.icon;

            const indexFormatted = String(index + 1).padStart(2, "0");

            return (
              <motion.div
                key={service.id || index}
                initial={
                  shouldReduceMotion
                    ? false
                    : {
                        opacity: 0,
                        y: 20,
                      }
                }
                whileInView={
                  shouldReduceMotion
                    ? undefined
                    : {
                        opacity: 1,
                        y: 0,
                      }
                }
                whileHover={
                  shouldReduceMotion
                    ? undefined
                    : {
                        y: -4,
                      }
                }
                viewport={{
                  once: true,
                  amount: 0.15,
                }}
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.4,
                  delay: shouldReduceMotion ? 0 : index * 0.04,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="h-full"
              >
                <Link
                  to={`/services/${service.id}`}
                  className="
                                        card-physical
                                        group
                                        flex
                                        h-full
                                        min-h-[350px]
                                        flex-col
                                        justify-between
                                        overflow-hidden
                                        border
                                        border-white/[0.08]
                                        bg-surface-1
                                        p-8
                                        transition-[background-color,border-color,box-shadow]
                                        duration-300

                                       hover:border-cyan-500/25
                                       hover:bg-surface-2
                                       hover:shadow-[0_4px_18px_rgba(0,122,255,0.07)]

                                        focus-visible:outline-none
                                        focus-visible:ring-2
                                        focus-visible:ring-cyan-400/70
                                        focus-visible:ring-offset-2
                                        focus-visible:ring-offset-surface-1
                                    "
                >
                  {/* =================================================
                                        Header
                                        ================================================= */}
                  <div className="mb-8 flex items-center justify-between">
                    <span
                      className="
                                                rounded-md
                                                border
                                                border-cyan-500/20
                                                bg-cyan-500/[0.08]
                                                px-2.5
                                                py-1
                                                font-mono
                                                text-[10px]
                                                uppercase
                                                tracking-wider
                                                text-cyan-400
                                            "
                    >
                      {meta.label}
                    </span>

                    <span
                      className="
                                                font-mono
                                                text-xs
                                                tracking-wider
                                                text-white/25
                                                transition-colors
                                                duration-300
                                                group-hover:text-white/50
                                            "
                    >
                      [{indexFormatted}]
                    </span>
                  </div>

                  {/* =================================================
                                        Icon
                                        ================================================= */}
                  <div
                    className="
                                            mb-7
                                            flex
                                            h-14
                                            w-14
                                            items-center
                                            justify-center
                                            rounded-xl
                                            border
                                            border-white/10
                                            bg-white/[0.035]
                                            text-white
                                            transition-all
                                            duration-300

                                            group-hover:border-cyan-500/30
                                            group-hover:bg-cyan-500/[0.08]

                                            md:group-hover:scale-105
                                        "
                  >
                    <IconComponent
                      className="
                                                h-6
                                                w-6
                                                text-white/80
                                                transition-colors
                                                duration-300
                                                group-hover:text-cyan-400
                                            "
                    />
                  </div>

                  {/* =================================================
                                        Content
                                        ================================================= */}
                  <div className="flex-1">
                    <h3
                      className="
                                                mb-3
                                                font-sans
                                                text-xl
                                                font-bold
                                                tracking-tight
                                                text-white
                                                transition-colors
                                                duration-300
                                                md:text-2xl
                                            "
                    >
                      {service.name}
                    </h3>

                    <p
                      className="
                                                max-w-[34rem]
                                                text-sm
                                                leading-relaxed
                                                text-text-muted
                                            "
                    >
                      {service.description}
                    </p>
                  </div>

                  {/* =================================================
                                        Footer
                                        ================================================= */}
                  <div
                    className="
                                            mt-8
                                            flex
                                            items-center
                                            justify-between
                                            border-t
                                            border-white/[0.07]
                                            pt-5
                                        "
                  >
                    <span
                      className="
                                                font-mono
                                                text-[10px]
                                                uppercase
                                                tracking-[0.14em]
                                                text-white/35
                                                transition-colors
                                                duration-300
                                                group-hover:text-white/70
                                            "
                    >
                      Explore Capabilities
                    </span>

                    <span
                      className="
                                                flex
                                                h-8
                                                w-8
                                                items-center
                                                justify-center
                                                rounded-full
                                                border
                                                border-white/10
                                                text-white/40
                                                transition-all
                                                duration-300

                                                group-hover:translate-x-1
                                                group-hover:border-cyan-400
                                                group-hover:bg-cyan-400
                                                group-hover:text-black
                                            "
                    >
                      <FaArrowRight size={11} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FaQuoteLeft } from "react-icons/fa";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";

const AUTOPLAY_DELAY = 6000;

const Testimonials = ({ testimonials = [] }) => {
  const testimonialList = Array.isArray(testimonials)
    ? testimonials.filter(Boolean)
    : [];
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isInteractionPaused, setIsInteractionPaused] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (isHovered || isInteractionPaused || shouldReduceMotion || testimonialList.length < 2) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setActiveIndex((index) => (index + 1) % testimonialList.length);
    }, AUTOPLAY_DELAY);

    return () => window.clearTimeout(timer);
  }, [activeIndex, isHovered, isInteractionPaused, shouldReduceMotion, testimonialList.length]);

  useEffect(() => {
    if (!isInteractionPaused) return undefined;

    const timer = window.setTimeout(() => setIsInteractionPaused(false), AUTOPLAY_DELAY);
    return () => window.clearTimeout(timer);
  }, [activeIndex, isInteractionPaused]);

  if (testimonialList.length === 0) return null;

  const goTo = (direction) => {
    setIsInteractionPaused(true);
    setActiveIndex((index) => (
      (index + direction + testimonialList.length) % testimonialList.length
    ));
  };

  const currentIndex = activeIndex % testimonialList.length;

  const getCardContent = (testimonial, isFront = false) => (
    <>
      <FaQuoteLeft
        aria-hidden="true"
        className="absolute right-6 top-6 text-4xl text-cyan-400/[0.12] sm:right-8 sm:top-8 sm:text-5xl"
      />
      <div className="relative flex h-full flex-col">
        <p className="mb-8 flex-1 text-base leading-7 text-white/85 sm:text-lg sm:leading-8">
          “{testimonial.testimonial || "No testimonial provided."}”
        </p>

        <div className="flex items-center gap-4 border-t border-white/[0.08] pt-5">
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-white/10 bg-surface-1">
            <span
              aria-hidden="true"
              className="absolute inset-0 flex items-center justify-center font-mono text-sm font-semibold text-cyan-400"
            >
              {(testimonial.name || "Client")
                .split(/\s+/)
                .slice(0, 2)
                .map((part) => part[0])
                .join("")
                .toUpperCase()}
            </span>
            {(testimonial.imageUrl || testimonial.image) && (
              <img
                src={testimonial.imageUrl || testimonial.image}
                alt={isFront ? `${testimonial.name || "Client"} portrait` : ""}
                aria-hidden={!isFront}
                loading="lazy"
                className="relative h-full w-full object-cover"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
            )}
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold text-white">
              {testimonial.name || "Client"}
            </h3>
            {(testimonial.title || testimonial.company) && (
              <p className="mt-1 text-sm text-slate-400">
                {testimonial.title}
                {testimonial.title && testimonial.company ? ", " : ""}
                {testimonial.company}
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );

  const activeTestimonial = testimonialList[currentIndex];

  return (
    <section
      id="testimonials"
      className="relative isolate overflow-hidden border-y border-white/[0.06] bg-background py-24 sm:py-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.012] [background-image:linear-gradient(to_right,rgba(255,255,255,0.8)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.8)_1px,transparent_1px)] [background-size:32px_32px]"
      />
      <div className="relative z-10 container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-12 text-center sm:mb-14">
          <h2 className="font-sans text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            Client <span className="text-slate-400">Feedback</span>
          </h2>
        </div>

        <div className="mx-auto max-w-3xl">
          <div
            className="relative h-[390px] sm:h-[360px]"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {testimonialList.length > 1 &&
              [2, 1].map((depth) => {
                const behindIndex = (currentIndex + depth) % testimonialList.length;
                const behindTestimonial = testimonialList[behindIndex];

                return (
                  <div
                    key={`stack-${depth}-${behindTestimonial.id ?? behindIndex}`}
                    aria-hidden="true"
                    className={`pointer-events-none absolute inset-x-0 top-0 h-full rounded-2xl border border-white/[0.08] bg-surface-2/70 ${
                      depth === 1
                        ? "translate-y-3 scale-[0.97] opacity-50"
                        : "translate-y-6 scale-[0.94] opacity-25"
                    }`}
                  />
                );
              })}

            <AnimatePresence mode="wait" initial={false}>
              <motion.article
                key={activeTestimonial.id ?? currentIndex}
                role="button"
                tabIndex={0}
                aria-label={`Testimonial by ${activeTestimonial.name || "Client"}. Activate to show the next testimonial.`}
                onClick={() => testimonialList.length > 1 && goTo(1)}
                onKeyDown={(event) => {
                  if (
                    testimonialList.length > 1 &&
                    (event.key === "Enter" || event.key === " ")
                  ) {
                    event.preventDefault();
                    goTo(1);
                  }
                }}
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: 28, rotateY: -4 }}
                animate={{ opacity: 1, x: 0, rotateY: 0 }}
                exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -28, rotateY: 4 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.32, ease: "easeOut" }}
                className="absolute inset-0 z-10 cursor-pointer rounded-2xl border border-white/[0.08] bg-surface-2/90 p-6 shadow-xl shadow-black/30 backdrop-blur-xl transition-colors hover:border-cyan-400/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:p-8"
              >
                {getCardContent(activeTestimonial, true)}
              </motion.article>
            </AnimatePresence>
          </div>

          <div className="mt-7 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => goTo(-1)}
              disabled={testimonialList.length < 2}
              aria-label="Previous testimonial"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-surface-2 text-slate-400 transition-colors hover:border-cyan-400/30 hover:text-cyan-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <FaArrowLeft aria-hidden="true" className="text-sm" />
            </button>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2" aria-label="Choose testimonial">
                {testimonialList.map((testimonial, index) => (
                  <button
                    key={testimonial.id ?? `${testimonial.name || "testimonial"}-${index}`}
                    type="button"
                    onClick={() => {
                      setIsInteractionPaused(true);
                      setActiveIndex(index);
                    }}
                    aria-label={`Show testimonial ${index + 1}`}
                    aria-current={currentIndex === index ? "step" : undefined}
                    className={`h-2 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                      activeIndex === index
                        ? "w-6 bg-cyan-400"
                        : "w-2 bg-white/25 hover:bg-white/50"
                    }`}
                  />
                ))}
              </div>
              <p
                className="font-mono text-xs tabular-nums text-slate-400"
                aria-live="polite"
                aria-atomic="true"
              >
                {String(currentIndex + 1).padStart(2, "0")} /{" "}
                {String(testimonialList.length).padStart(2, "0")}
              </p>
            </div>

            <button
              type="button"
              onClick={() => goTo(1)}
              disabled={testimonialList.length < 2}
              aria-label="Next testimonial"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-surface-2 text-slate-400 transition-colors hover:border-cyan-400/30 hover:text-cyan-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <FaArrowRight aria-hidden="true" className="text-sm" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

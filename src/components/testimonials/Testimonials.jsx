import React from "react";
import { FaQuoteLeft } from "react-icons/fa";

const Testimonials = ({ testimonials = [] }) => {
  const testimonialList = Array.isArray(testimonials) ? testimonials : [];

  if (testimonialList.length === 0) return null;

  const displayData = [
    ...testimonialList,
    ...testimonialList,
    ...testimonialList,
  ];

  return (
    <section
      id="testimonials"
      className="py-32 relative z-10 overflow-hidden bg-black/40 backdrop-blur-sm border-y border-white/5"
    >
      <div className="container mx-auto px-6 max-w-7xl mb-16 text-center">
        <h2 className="text-4xl md:text-5xl font-sans font-bold mb-4 text-white">
          Client <span className="text-text-muted">Feedback</span>
        </h2>
      </div>

      <div className="group relative w-full flex overflow-hidden mask-linear-fade">
        <div className="absolute top-0 bottom-0 left-0 w-20 z-10 bg-gradient-to-r from-background to-transparent" />

        <div className="absolute top-0 bottom-0 right-0 w-20 z-10 bg-gradient-to-l from-background to-transparent" />

        <div className="flex animate-shimmer gap-8 whitespace-nowrap hover:[animation-play-state:paused] w-max">
          {displayData.map((test, i) => {
            if (!test) return null;

            return (
              <div
                key={`${test.name || "testimonial"}-${i}`}
                className="w-[350px] md:w-[450px] whitespace-normal flex-shrink-0 p-8 rounded-3xl glass-card border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors duration-300 relative"
              >
                <FaQuoteLeft className="absolute top-8 left-8 text-6xl text-white/5 -z-0" />

                <div className="relative z-10">
                  <p className="text-lg md:text-xl font-light italic text-white/90 mb-8 leading-relaxed">
                    "{test.testimonial || ""}"
                  </p>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10">
                      <img
                        src={test.imageUrl || test.image || ""}
                        alt={test.name || "Client"}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>

                    <div>
                      <h4 className="font-bold text-white text-base">
                        {test.name || "Client"}
                      </h4>

                      <p className="text-sm text-text-muted font-mono">
                        {test.title || ""}
                        {test.title && test.company ? ", " : ""}
                        {test.company || ""}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }

          100% {
            transform: translateX(-33.33%);
          }
        }

        .animate-shimmer {
          animation: scroll 40s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default Testimonials;
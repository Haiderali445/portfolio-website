import React from 'react';
import { testimonialData } from '../../utils/data/testem-data';
import { FaHeart, FaStar, FaQuoteLeft } from 'react-icons/fa';

const Testimonials = () => {
  // Duplicate data to ensure seamless loop if not enough items
  const displayData = [...testimonialData, ...testimonialData, ...testimonialData];

  return (
    <section id="testimonials" className="py-32 relative z-10 overflow-hidden bg-black/40 backdrop-blur-sm border-y border-white/5">
      <div className="container mx-auto px-6 max-w-7xl mb-16 text-center">
        <h2 className="text-4xl md:text-5xl font-sans font-bold mb-4 text-white">
          Client <span className="text-text-muted">Feedback</span>
        </h2>
      </div>

      {/* Infinite Horizontal Scroll Container */}
      <div className="group relative w-full flex overflow-hidden mask-linear-fade">
        {/* Mask effect on edges (optional gradient overlay) */}
        <div className="absolute top-0 bottom-0 left-0 w-20 z-10 bg-gradient-to-r from-background to-transparent" />
        <div className="absolute top-0 bottom-0 right-0 w-20 z-10 bg-gradient-to-l from-background to-transparent" />

        <div className="flex animate-shimmer gap-8 whitespace-nowrap hover:[animation-play-state:paused] w-max">
          {displayData.map((test, i) => (
            <div
              key={i}
              className="w-[350px] md:w-[450px] whitespace-normal flex-shrink-0 p-8 rounded-3xl glass-card border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors duration-300 relative"
            >
              <FaQuoteLeft className="absolute top-8 left-8 text-6xl text-white/5 -z-0" />

              <div className="relative z-10">
                <p className="text-lg md:text-xl font-light italic text-white/90 mb-8 leading-relaxed">
                  "{test.testimonial}"
                </p>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10">
                    <img src={test.image} alt={test.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base">{test.name}</h4>
                    <p className="text-sm text-text-muted font-mono">{test.title}, {test.company}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Second duplicate track for seamlessness (logic handled by CSS normally, but React map here is 3x data) */}
        {/* To make it truly infinite without gaps, usually you map the track twice in high-speed, 
                    but here we used a long array and 'animate-shimmer' (defined in tailwind) 
                    Wait, 'animate-shimmer' in my config was 'background position'. 
                    I need a 'marquee' animation.
                */}
      </div>

      <style jsx>{`
                @keyframes scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-33.33%); } /* Move 1/3 since we tripled data */
                }
                .animate-shimmer {
                    animation: scroll 40s linear infinite;
                }
            `}</style>
    </section>
  );
};

export default Testimonials;

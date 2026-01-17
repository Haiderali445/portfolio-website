import React from "react";
import { Typewriter } from "react-simple-typewriter";
import { motion, useScroll, useTransform } from "framer-motion";
import SocialIcons from "../sidebar/socialcons";
import MagneticButton from "../helper/MagneticButton";
import imgghibli from '../../Assets/images/imgghibli.png';

const Header = ({ personalData = {} }) => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <header id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-background/80 z-10" />
      </div>

      <div className="container mx-auto px-6 max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-20">

        {/* === LEFT SECTION === */}
        <motion.div
          style={{ y, opacity }}
          className="flex flex-col items-start"
        >
          {/* System Status Indicator */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-8 border border-glass-border rounded-full bg-glass backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-xs font-mono text-green-400 tracking-wide uppercase">System Status: Active & Available</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-sans font-bold leading-tight tracking-tight mb-6 text-white group cursor-default">
            <span className="block text-text-muted text-4xl md:text-5xl font-normal mb-2 transition-colors duration-300 group-hover:text-primary/80">Hello, I'm</span>
            {personalData.name}
          </h1>

          <div className="text-xl md:text-2xl font-bold font-mono text-text-muted mb-10 h-8 flex items-center gap-2">
            <span className="text-primary">{">"}</span>
            <Typewriter
              words={personalData.titles || [
                "AI ARCHITECT",
                "SOLUTION ENGINEER",
                "AI INTEGRATION ENGINEER",
                "SOFTWARE ARCHITECT",
                "SYSTEM DESIGN SPECIALIST"
              ]}
              loop
              cursor
              cursorStyle="_"
              typeSpeed={70}
              deleteSpeed={50}
              delaySpeed={2000}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-6 items-center">
            <MagneticButton onClick={() => document.getElementById('projects').scrollIntoView({ behavior: 'smooth' })}>
              <div className="px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                View Work
              </div>
            </MagneticButton>

            <SocialIcons personalData={personalData} />
          </div>
        </motion.div>

        {/* === RIGHT SECTION === */}
        <div className="relative flex justify-center lg:justify-end h-[50vh] lg:h-auto">
          <div className="relative w-[300px] md:w-[400px] lg:w-[500px] aspect-square">
            <div className="absolute top-0 right-0 w-3/4 h-3/4 bg-gradient-to-tr from-primary/10 to-purple-500/10 rounded-full blur-[80px] -z-10 animate-pulse" />

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="relative z-10 rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-20 opacity-40" />
              <img
                src={imgghibli}
                alt="Haider Ali"
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700 ease-out grayscale hover:grayscale-0"
              />
            </motion.div>
          </div>
        </div>

      </div>
    </header>
  );
};

export default Header;

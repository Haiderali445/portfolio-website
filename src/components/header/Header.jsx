import React from "react";
import "./Header.css";
import { Typewriter } from "react-simple-typewriter";
import { motion } from "framer-motion";
import img1 from "../../Assets/images/imgghibli.png";
import SocialIcons from "../sidebar/socialcons";

const Header = () => {
  return (
    <header className="header">
      <div className="header__container container">
        <div className="hero-grid">
          {/* === LEFT SECTION === */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="hero-left"
          >
            <h1 className="intro-line">
              <span className="intro-normal">Hello ! , I’m </span>
              <span
                className="intro-name"
                style={{ color: "var(--color-primary)" }}
              >
                Haider
              </span>
            </h1>

            <motion.h3
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="typed-role"
            >
              <Typewriter
                words={[
                  "Software Engineer",
                  "Full Stack Developer",
                  "MERN Stack Developer",
                  "Backend expert",
                  "UI/UX Designer",
                  "System developer",
                ]}
                loop
                cursor
                cursorStyle="|"
                typeSpeed={70}
                deleteSpeed={50}
                delaySpeed={1200}
              />
            </motion.h3>

            <motion.a
              href="#contact"
              className="btn talk-btn"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
            >
              ✉️ Let’s Talk
            </motion.a>

            <SocialIcons />
          </motion.div>

          {/* === RIGHT SECTION === */}
          <motion.div
            className="hero-right"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
          >
            <motion.div 
              className="hero-img-wrapper"
              style={{ y: 0 }}
              whileInView={{ y: [-20, 20, -20] }}
              transition={{ 
                duration: 6, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            >
              <div className="bubble-tile" />
              <img src={img1} alt="Haider" className="hero-img" />
            </motion.div>
          </motion.div>

          {/* === SCROLL INDICATOR BALL === */}
          <motion.div
            className="scroll-ball"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            onClick={() => {
              const contactSection = document.getElementById("contact");
              contactSection?.scrollIntoView({ behavior: "smooth" });
            }}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;

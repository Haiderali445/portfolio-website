import "../nav/Nav.css";
import { useState } from "react";

// 🎯 Enhanced Icons (Modern + Meaningful)
import { HiHomeModern } from "react-icons/hi2";                      // Home
import { FaUserAstronaut } from "react-icons/fa";                   // About
import { FiGrid } from "react-icons/fi";                            // Projects
import { TbBrain } from "react-icons/tb";                           // Skills
import { MdDesignServices } from "react-icons/md";                  // Services
import { HiChatBubbleOvalLeftEllipsis } from "react-icons/hi2";     // Testimonials
import { IoMdSend } from "react-icons/io";                          // Contact

const Nav = () => {
  const [activeNav, setActiveNav] = useState("#");

  return (
    <nav>
      <a
        href="#about"
        className={activeNav === "#about" ? "active" : ""}
        onClick={() => setActiveNav("#about")}
      >
        <FaUserAstronaut />
      </a>
      {/* About */}

      <a
        href="#projects"
        className={activeNav === "#projects" ? "active" : ""}
        onClick={() => setActiveNav("#projects")}
      >
        <FiGrid />
      </a>
      {/* Projects */}

      <a
        href="#skills"
        className={activeNav === "#skills" ? "active" : ""}
        onClick={() => setActiveNav("#skills")}
      >
        <TbBrain />
      </a>
      {/* Skills */}

      <a
        href="#"
        className={activeNav === "#" ? "active" : ""}
        onClick={() => setActiveNav("#")}
      >
        <HiHomeModern />
      </a>
      {/* Home */}

      <a
        href="#services"
        className={activeNav === "#services" ? "active" : ""}
        onClick={() => setActiveNav("#services")}
      >
        <MdDesignServices />
      </a>
      {/* Services */}

      <a
        href="#testimonials"
        className={activeNav === "#testimonials" ? "active" : ""}
        onClick={() => setActiveNav("#testimonials")}
      >
        <HiChatBubbleOvalLeftEllipsis />
      </a>
      {/* Testimonials */}

      <a
        href="#contact"
        className={activeNav === "#contact" ? "active" : ""}
        onClick={() => setActiveNav("#contact")}
      >
        <IoMdSend />
      </a>
      {/* Contact */}
    </nav>
  );
};

export default Nav;

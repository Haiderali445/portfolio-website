import React, { useState } from "react";
import { HiHomeModern } from "react-icons/hi2";
import { FaUserAstronaut } from "react-icons/fa";
import { FiGrid } from "react-icons/fi";
import { TbBrain } from "react-icons/tb";
import { MdDesignServices } from "react-icons/md";
import { HiChatBubbleOvalLeftEllipsis } from "react-icons/hi2";
import { IoMdSend } from "react-icons/io";
import { FaLightbulb, FaBriefcase } from "react-icons/fa";

const Nav = () => {
  const [activeNav, setActiveNav] = useState("#");

  const navItems = [
    { id: "#", icon: HiHomeModern, label: "Home" },
    { id: "#about", icon: FaUserAstronaut, label: "About" },
    { id: "#skills", icon: TbBrain, label: "Skills" },
    { id: "#experience", icon: FaBriefcase, label: "Experience" }, // New Section
    { id: "#solutions", icon: FaLightbulb, label: "Solutions" },
    { id: "#projects", icon: FiGrid, label: "Projects" },
    { id: "#services", icon: MdDesignServices, label: "Services" },
    { id: "#testimonials", icon: HiChatBubbleOvalLeftEllipsis, label: "Testimonials" },
    { id: "#contact", icon: IoMdSend, label: "Contact" },
  ];

  return (
    <div className="fixed bottom-4 sm:bottom-8 left-0 right-0 z-50 px-4 sm:px-6 pointer-events-none">
      <div className="max-w-7xl mx-auto flex justify-center pointer-events-auto">
        <nav className="flex gap-1 sm:gap-2 p-2 px-3 sm:px-4 bg-black/20 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={item.id}
              onClick={() => setActiveNav(item.id)}
              className={`p-2 sm:p-3 rounded-full text-base sm:text-lg transition-all duration-300 relative group
                ${activeNav === item.id
                  ? "bg-primary text-black scale-110"
                  : "text-white/60 hover:text-white hover:bg-white/10"
                }`}
              aria-label={item.label}
            >
              <item.icon />

              {/* Tooltip */}
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-black text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap border border-white/10 hidden sm:block">
                {item.label}
              </span>
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Nav;

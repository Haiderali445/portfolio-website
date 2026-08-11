import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { HiHomeModern } from "react-icons/hi2";
import { FaUserAstronaut, FaLightbulb, FaBriefcase, FaGraduationCap } from "react-icons/fa";
import { FiGrid } from "react-icons/fi";
import { TbBrain } from "react-icons/tb";
import { MdDesignServices } from "react-icons/md";
import { HiChatBubbleOvalLeftEllipsis } from "react-icons/hi2";
import { IoMdSend } from "react-icons/io";

const Nav = () => {
  const [activeNav, setActiveNav] = useState("#");
  const location = useLocation();
  const navigate = useNavigate();

  // Reordered: Home is placed right in the middle
  const navItems = [
    { id: "#about", icon: FaUserAstronaut, label: "About", sectionId: "about" },
    { id: "#skills", icon: TbBrain, label: "Skills", sectionId: "skills" },
    { id: "#experience", icon: FaBriefcase, label: "Experience", sectionId: "experience" },
    { id: "#education", icon: FaGraduationCap, label: "Education", sectionId: "education" },
    { id: "#solutions", icon: FaLightbulb, label: "Solutions", sectionId: "solutions" },
    { id: "#", icon: HiHomeModern, label: "Home", sectionId: "home" }, // Middle Position
    { id: "#projects", icon: FiGrid, label: "Projects", sectionId: "projects" },
    { id: "#services", icon: MdDesignServices, label: "Services", sectionId: "services" },
    { id: "#testimonials", icon: HiChatBubbleOvalLeftEllipsis, label: "Testimonials", sectionId: "testimonials" },
    { id: "#contact", icon: IoMdSend, label: "Contact", sectionId: "contact" },
  ];

  const handleNavClick = (e, item) => {
    e.preventDefault();
    setActiveNav(item.id);

    if (location.pathname !== "/") {
      navigate("/" + (item.id === "#" ? "" : item.id));
    } else {
      if (item.id === "#") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        const targetElement = document.querySelector(item.id);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  };

  // Scrollspy: Automatically highlight nav items as the user scrolls
  useEffect(() => {
    if (location.pathname !== "/") {
      setActiveNav("");
      return;
    }

    const sections = navItems.map((item) => item.sectionId);
    const handleScroll = () => {
      if (window.scrollY < 200) {
        setActiveNav("#");
        return;
      }

      const scrollPosition = window.scrollY + window.innerHeight / 3;

      for (let i = sections.length - 1; i >= 0; i--) {
        const sectionId = sections[i];
        if (sectionId === "home") continue;

        const element = document.getElementById(sectionId);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveNav(`#${sectionId}`);
            return;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [location.pathname]);

  return (
    <div className="fixed bottom-4 sm:bottom-8 left-0 right-0 z-50 px-4 sm:px-6 pointer-events-none">
      <div className="max-w-7xl mx-auto flex justify-center pointer-events-auto">
        <nav className="flex gap-1 sm:gap-2 p-2 px-3 sm:px-4 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl">
          {navItems.map((item) => {
            const isHome = item.id === "#";
            const isActive = activeNav === item.id;

            return (
              <a
                key={item.id}
                href={location.pathname === "/" ? item.id : `/${item.id}`}
                onClick={(e) => handleNavClick(e, item)}
                className={`p-2 sm:p-3 rounded-full text-base sm:text-lg transition-all duration-300 relative group
                  ${isHome ? "mx-1 sm:mx-2" : ""}
                  ${isActive
                    ? isHome
                      ? "bg-cyan-400 text-black scale-125 shadow-[0_0_20px_rgba(0,234,255,0.6)]"
                      : "bg-primary text-black scale-110 shadow-[0_0_15px_rgba(0,234,255,0.4)]"
                    : isHome
                      ? "bg-white/10 text-cyan-400 hover:bg-white/20 hover:text-white"
                      : "text-white/60 hover:text-white hover:bg-white/10"
                  }`}
                aria-label={item.label}
              >
                <item.icon />

                {/* Tooltip */}
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/90 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap border border-white/10 hidden sm:block">
                  {item.label}
                </span>
              </a>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Nav;

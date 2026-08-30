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

  // Desktop Items (All 10)
  const desktopNavItems = [
    { id: "#about", icon: FaUserAstronaut, label: "About", sectionId: "about" },
    { id: "#skills", icon: TbBrain, label: "Skills", sectionId: "skills" },
    { id: "#experience", icon: FaBriefcase, label: "Experience", sectionId: "experience" },
    { id: "#education", icon: FaGraduationCap, label: "Education", sectionId: "education" },
    { id: "#solutions", icon: FaLightbulb, label: "Solutions", sectionId: "solutions" },
    { id: "#", icon: HiHomeModern, label: "Home", sectionId: "home" }, // Center
    { id: "#projects", icon: FiGrid, label: "Projects", sectionId: "projects" },
    { id: "#services", icon: MdDesignServices, label: "Services", sectionId: "services" },
    { id: "#testimonials", icon: HiChatBubbleOvalLeftEllipsis, label: "Testimonials", sectionId: "testimonials" },
    { id: "#contact", icon: IoMdSend, label: "Contact", sectionId: "contact" },
  ];

  // Mobile Items (Balanced 7 items: 3 left, 1 center Home, 3 right)
  const mobileLeftItems = [
    { id: "#about", icon: FaUserAstronaut, label: "About", sectionId: "about" },
    { id: "#skills", icon: TbBrain, label: "Skills", sectionId: "skills" },
    { id: "#experience", icon: FaBriefcase, label: "Experience", sectionId: "experience" },
  ];

  const homeItem = { id: "#", icon: HiHomeModern, label: "Home", sectionId: "home" };

  const mobileRightItems = [
    { id: "#projects", icon: FiGrid, label: "Projects", sectionId: "projects" },
    { id: "#services", icon: MdDesignServices, label: "Services", sectionId: "services" },
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

  useEffect(() => {
    if (location.pathname !== "/") {
      setActiveNav("");
      return;
    }

    const sections = desktopNavItems.map((item) => item.sectionId);
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;

      ticking = true;
      requestAnimationFrame(() => {
        if (window.scrollY < 200) {
          setActiveNav("#");
          ticking = false;
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
              ticking = false;
              return;
            }
          }
        }

        ticking = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [location.pathname]);

  const renderButton = (item) => {
    const isHome = item.id === "#";
    const isActive = activeNav === item.id;

    return (
      <a
        key={item.id}
        href={location.pathname === "/" ? item.id : `/${item.id}`}
        onClick={(e) => handleNavClick(e, item)}
        className={`p-2 sm:p-3 rounded-full text-sm sm:text-lg transition-all duration-300 relative group flex items-center justify-center
          ${isHome ? "mx-1 sm:mx-2" : ""}
          ${isActive
            ? isHome
              ? "bg-cyan-400 text-black scale-110 shadow-[0_0_20px_rgba(0,234,255,0.6)]"
              : "bg-primary text-black scale-105 shadow-[0_0_15px_rgba(0,234,255,0.4)]"
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
  };

  return (
    <div className="fixed bottom-4 sm:bottom-8 left-0 right-0 z-50 px-3 pointer-events-none">
      <div className="max-w-7xl mx-auto flex justify-center pointer-events-auto">
        <nav className="flex gap-1 sm:gap-2 p-2 px-2.5 sm:px-4 bg-black/50 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl items-center">
          
          {/* MOBILE VIEW (7 balanced items: About, Skills, Experience | Home | Projects, Services, Contact) */}
          <div className="flex sm:hidden items-center gap-1">
            {mobileLeftItems.map(renderButton)}
            {renderButton(homeItem)}
            {mobileRightItems.map(renderButton)}
          </div>

          {/* DESKTOP VIEW (Renders all 10 items) */}
          <div className="hidden sm:flex items-center gap-2">
            {desktopNavItems.map(renderButton)}
          </div>

        </nav>
      </div>
    </div>
  );
};

export default Nav;
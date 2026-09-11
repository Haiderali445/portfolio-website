import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { HiHomeModern } from "react-icons/hi2";
import { FaUserAstronaut, FaBriefcase, FaGraduationCap } from "react-icons/fa";
import { FiGrid } from "react-icons/fi";
import { TbBrain } from "react-icons/tb";
import { MdDesignServices } from "react-icons/md";
import { HiChatBubbleOvalLeftEllipsis } from "react-icons/hi2";
import { IoMdSend } from "react-icons/io";

const Nav = () => {
  const [activeNav, setActiveNav] = useState("#");
  const location = useLocation();
  const navigate = useNavigate();

  // Desktop Left Cluster (4 Items)
  const desktopLeftItems = [
    { id: "#about", icon: FaUserAstronaut, label: "About", sectionId: "about" },
    { id: "#skills", icon: TbBrain, label: "Skills", sectionId: "skills" },
    { id: "#experience", icon: FaBriefcase, label: "Experience", sectionId: "experience" },
    { id: "#education", icon: FaGraduationCap, label: "Education", sectionId: "education" },
  ];

  // Center Item
  const homeItem = { id: "#", icon: HiHomeModern, label: "Home", sectionId: "home" };

  // Desktop Right Cluster (4 Items)
  const desktopRightItems = [
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

    const allSections = [...desktopLeftItems, homeItem, ...desktopRightItems].map(
      (item) => item.sectionId
    );
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

        for (let i = allSections.length - 1; i >= 0; i--) {
          const sectionId = allSections[i];
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
        className={`relative group flex items-center justify-center p-2.5 rounded-full text-sm transition-all duration-300 border ${
          isHome ? "mx-0.5" : ""
        } ${
          isActive
            ? "bg-cyan-600 text-white border-cyan-400 shadow-glow-cyan font-bold"
            : "bg-transparent text-white/45 border-transparent hover:text-white hover:bg-white/[0.08] hover:border-white/10"
        }`}
        aria-label={item.label}
      >
        <item.icon className="text-base shrink-0 transition-transform duration-200 group-hover:scale-105" />

        {/* Desktop Inline Name Expand on Hover */}
        <span className="hidden sm:inline-block max-w-0 overflow-hidden whitespace-nowrap font-mono text-[10px] uppercase tracking-wider transition-all duration-300 ease-out group-hover:max-w-[85px] group-hover:ml-1.5 text-white/90">
          {item.label}
        </span>

        {/* Mobile Floating Tooltip */}
        <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-surface-1 text-white font-mono text-[10px] uppercase tracking-wider rounded-md opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap border border-white/15 shadow-2xl sm:hidden">
          {item.label}
        </span>
      </a>
    );
  };

  return (
    <div className="fixed bottom-4 sm:bottom-6 left-0 right-0 z-50 px-3 pointer-events-none">
      <div className="max-w-7xl mx-auto flex justify-center pointer-events-auto">
        <nav className="relative overflow-hidden flex items-center gap-1 p-1.5 bg-surface-1/90 backdrop-blur-2xl border border-white/10 rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.85)]">
          
          {/* Top Chrome Edge Specular Line */}
          <div 
            aria-hidden="true" 
            className="pointer-events-none absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent" 
          />

          {/* MOBILE VIEW (7 items: 3 left | Home | 3 right) */}
          <div className="flex sm:hidden items-center gap-0.5 relative z-10">
            {mobileLeftItems.map(renderButton)}
            <div className="h-4 w-[1px] bg-white/15 mx-0.5" />
            {renderButton(homeItem)}
            <div className="h-4 w-[1px] bg-white/15 mx-0.5" />
            {mobileRightItems.map(renderButton)}
          </div>

          {/* DESKTOP VIEW (9 items: 4 left | Home | 4 right) */}
          <div className="hidden sm:flex items-center gap-1 relative z-10">
            {desktopLeftItems.map(renderButton)}
            <div className="h-4 w-[1px] bg-white/15 mx-1" />
            {renderButton(homeItem)}
            <div className="h-4 w-[1px] bg-white/15 mx-1" />
            {desktopRightItems.map(renderButton)}
          </div>

        </nav>
      </div>
    </div>
  );
};

export default Nav;

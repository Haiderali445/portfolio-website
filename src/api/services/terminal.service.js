// src/api/terminal.service.js
import { TERMINAL_DEFAULT_CONFIG } from "../../utils/data/terminalData";

export const TerminalService = {
  getConfig() {
    return TERMINAL_DEFAULT_CONFIG;
  },

  processCommand(action, target, portfolioData, isAuthenticated) {
    const personal = portfolioData?.personal || {};
    const site = portfolioData?.site || {};
    const experience = portfolioData?.experience || [];
    const education = portfolioData?.education || [];
    const skills = portfolioData?.skills || [];
    const projects = portfolioData?.projects || [];
    
    const TERMINAL_USER = personal.terminalUser || TERMINAL_DEFAULT_CONFIG.defaultUser;

    switch (action) {
      case "help":
        return {
          type: "output",
          text: `Available system commands:
[Public]
- goto [section]   : Scroll to section (e.g., 'goto about', 'goto projects')
- resume / cv      : Open professional resume in a new tab
- socials / links  : Display direct professional channels
- github / repos   : Summarize live projects
- whoami           : Display active developer profile summary
- skills           : List live technical skill sets
- login            : Authenticate manually as '${TERMINAL_USER}'
- cls / clear      : Clear terminal screen logs
- exit             : Drop root session or close terminal

[Protected - Prompts for Password]
- health / check   : Audit DOM and state
- siteconfig       : Show live environment metrics
- matrix           : Enter the matrix stream
- sudo hire        : Execute recruitment authorization
- coffee           : Fuel the backend architecture
- logout           : Revoke root session access`,
        };

      case "login":
        if (isAuthenticated) {
          return { type: "success", text: `Already authenticated as ${TERMINAL_USER}.` };
        }
        return { type: "promptPassword", text: `Enter password for ${TERMINAL_USER} (or type 'cancel'):` };

      case "logout":
        return { type: "logoutSuccess", text: "Successfully logged out. Root session revoked." };

      case "exit":
        return { type: "exitSession", isAuthenticated };

      case "health":
      case "check":
      case "status": {
        const expectedSections = Object.keys(TERMINAL_DEFAULT_CONFIG.sectionMap);
        let auditResults = "System Health Audit Report (Root Privileges Active):\n";
        let missingCount = 0;

        expectedSections.forEach((sec) => {
          const found =
            document.getElementById(sec) ||
            document.querySelector(`.${sec}`) ||
            document.querySelector(`[data-section="${sec}"]`) ||
            document.querySelector(sec);

          if (found) {
            auditResults += `  [OK] Section '${sec}' is rendered.\n`;
          } else {
            auditResults += `  [MISSING] Section '${sec}' could not be detected in DOM.\n`;
            missingCount++;
          }
        });

        auditResults += `\nData State Check:\n`;
        auditResults += `  - Personal Profile: ${personal?.name ? "Loaded" : "Missing"}\n`;
        auditResults += `  - Site Config: ${site?.devStack ? "Loaded" : "Missing"}\n`;
        auditResults += `  - Projects Count: ${projects.length}\n`;
        auditResults += `  - Experience Records: ${experience.length}\n`;

        return {
          type: missingCount === 0 ? "success" : "error",
          text: auditResults + `\nAudit Status: ${missingCount === 0 ? "All systems nominal. 100% operational." : `${missingCount} section(s) missing/unmapped.`}`,
        };
      }

      case "goto":
        if (!target) {
          return { type: "error", text: "Error: Missing section name. Try 'goto about', 'goto top', or 'goto bottom'" };
        }
        if (target === "top") {
          window.scrollTo({ top: 0, behavior: "smooth" });
          return { type: "success", text: "Successfully scrolled to top of page." };
        }
        if (target === "bottom" || target === "footer") {
          window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
          return { type: "success", text: "Successfully scrolled to footer / bottom." };
        } else {
          const sectionKey = TERMINAL_DEFAULT_CONFIG.sectionMap[target] || target;
          const element = document.getElementById(sectionKey) || document.querySelector(`.${sectionKey}`) || document.querySelector(`[data-section="${sectionKey}"]`);
          
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
            return { type: "success", text: `Successfully navigated to section: #${sectionKey}` };
          }
          return { type: "error", text: `Error: Section '${target}' not found.` };
        }

      case "top":
        window.scrollTo({ top: 0, behavior: "smooth" });
        return { type: "success", text: "Successfully scrolled to top of page." };

      case "bottom":
      case "footer":
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
        return { type: "success", text: "Successfully scrolled to footer / bottom." };

      case "resume":
      case "cv":
        window.open(personal.resumeUrl || "https://drive.google.com/file/d/1EDfqFGihcKsSksiUIbRPZj8Mw1Bndxc4/view?usp=drive_link", "_blank");
        return { type: "success", text: "Opening professional resume in a new tab..." };

      case "socials":
      case "links":
        return {
          type: "output",
          text: `Professional Networks:
- LinkedIn: ${personal.linkedIn || "N/A"}
- GitHub: ${personal.github || "N/A"}
- Instagram: ${personal.instagram || "N/A"}
- Email: ${personal.email || "N/A"}`,
        };

      case "github":
      case "repos":
      case "projects": {
        const projList = projects.length > 0 
          ? projects.map(p => `- ${p.title || p.name}${p.description ? `: ${p.description}` : ""}`).join("\n") 
          : "No projects loaded.";
        return { type: "output", text: `Live Repositories & Projects:\n${projList}` };
      }

      case "experience": {
        const expList = experience.length > 0 
          ? experience.map(exp => `- ${exp.role || exp.title} at ${exp.company} (${exp.period || exp.duration})`).join("\n")
          : "No experience records available.";
        return { type: "output", text: `Career & Experience:\n${expList}` };
      }

      case "education": {
        const eduList = education.length > 0
          ? education.map(edu => `- ${edu.degree || edu.title} at ${edu.institution || edu.school} (${edu.year || edu.duration || ""})`).join("\n")
          : "No education records available.";
        return { type: "output", text: `Academic Background:\n${eduList}` };
      }

      case "whoami":
        return {
          type: "output",
          text: `${personal.name || "User"} — ${personal.designation || "Developer"}\nAuth Session: ${isAuthenticated ? `${TERMINAL_USER} (root)` : "Guest"}\nLocation: ${personal.address || "N/A"}`,
        };

      case "siteconfig": {
        const stackStr = site.devStack 
          ? Object.entries(site.devStack).map(([k, v]) => `  - ${k}: ${v}`).join("\n")
          : "  - N/A";
        return {
          type: "output",
          text: `Environment Configuration:
- Availability: ${site.availabilityStatus || "N/A"} (${site.availabilityLabel || "N/A"})
- Tagline: ${site.footerTagline || "N/A"}
- Dev Stack:
${stackStr}`,
        };
      }

      case "skills": {
        const skillList = skills.length > 0 
          ? skills.map(s => s.name || s).join(", ") 
          : (personal.interests ? personal.interests.join(", ") : "No skills loaded.");
        return { type: "output", text: `Active Skills / Stack:\n${skillList}` };
      }

      case "contact":
        return {
          type: "output",
          text: `Direct Contact Channels:\n- Email: ${personal.email}\n- Phone: ${personal.phone}\n- Address: ${personal.address}\n- Intro: ${site.contactSectionIntro || "N/A"}`,
        };

      case "matrix":
        return { type: "success", text: "Wake up, Neo... The matrix has you. Follow the white rabbit." };

      case "sudo":
        if (!target || target === "hire" || target === "su") {
          return {
            type: "success",
            text: `ACCESS GRANTED: Root privileges acquired. ${personal.name || "Candidate"} successfully authorized for high-impact enterprise engineering roles!`,
          };
        }
        return { type: "error", text: `Permission denied for sudo '${target}'. Try 'sudo hire'.` };

      case "coffee":
        return { type: "success", text: "☕ High-octane chai infused successfully. Compiling distributed event-driven workflows at 100% efficiency!" };

      case "refresh":
        setTimeout(() => window.location.reload(), 800);
        return { type: "success", text: "Refreshing system instance..." };

      default:
        return { type: "error", text: `Command not recognized: '${action}'. Type 'help' for available options.` };
    }
  },
};
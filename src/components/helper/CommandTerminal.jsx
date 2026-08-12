import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, X, ChevronRight, CornerDownLeft } from "lucide-react";

export default function CommandTerminal({ portfolioData }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [awaitingPassword, setAwaitingPassword] = useState(false);
  const [pendingCommand, setPendingCommand] = useState(null);

  const [logs, setLogs] = useState([
    { type: "system", text: "System Terminal v6.3.0 initialized (Robust Sudo Routing Active)." },
    { type: "system", text: "Type 'help' for available commands. Protected commands will prompt for password." },
  ]);
  const inputRef = useRef(null);
  const logsEndRef = useRef(null);

  // Extract live data from portfolio service state
  const personal = portfolioData?.personal || {};
  const site = portfolioData?.site || {};
  const experience = portfolioData?.experience || [];
  const education = portfolioData?.education || [];
  const skills = portfolioData?.skills || [];
  const projects = portfolioData?.projects || [];

  // Dynamically pull terminal credentials from your service state
  const TERMINAL_USER = personal.terminalUser;
  const TERMINAL_PASS = personal.terminalPass;

  // Focus input when terminal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Auto-scroll logs to bottom
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // Keyboard shortcut (Ctrl + `) to toggle terminal & Command History (Up/Down)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === "`") {
        setIsOpen((prev) => !prev);
      }
      if (!isOpen) return;

      if (e.key === "ArrowUp") {
        e.preventDefault();
        if (history.length > 0 && historyIndex < history.length - 1) {
          const nextIndex = historyIndex + 1;
          setHistoryIndex(nextIndex);
          setInput(history[history.length - 1 - nextIndex] || "");
        }
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (historyIndex > 0) {
          const nextIndex = historyIndex - 1;
          setHistoryIndex(nextIndex);
          setInput(history[history.length - 1 - nextIndex] || "");
        } else if (historyIndex === 0) {
          setHistoryIndex(-1);
          setInput("");
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, history, historyIndex]);

  const handleCommand = (e) => {
    e.preventDefault();
    const rawInput = input.trim();
    if (!rawInput) return;

    // Handle password-only authentication flow
    if (awaitingPassword) {
      const passwordInput = rawInput;

      // Allow canceling the password prompt
      if (passwordInput.toLowerCase() === "cancel" || passwordInput.toLowerCase() === "exit") {
        setAwaitingPassword(false);
        setPendingCommand(null);
        setLogs((prev) => [
          ...prev,
          { type: "input", text: `$ ${passwordInput}` },
          { type: "system", text: "Authentication cancelled." },
        ]);
        setInput("");
        return;
      }

      // Mask password in logs
      setLogs((prev) => [
        ...prev,
        { type: "input", text: `$ ${"*".repeat(passwordInput.length)}` },
      ]);

      if (passwordInput === TERMINAL_PASS) {
        setIsAuthenticated(true);
        setAwaitingPassword(false);
        setLogs((prev) => [
          ...prev,
          { type: "success", text: `Authenticated as ${TERMINAL_USER}. Root privileges granted.` },
        ]);

        if (pendingCommand) {
          const cmdToRun = pendingCommand;
          setPendingCommand(null);
          executeCommandAction(cmdToRun);
        }
      } else {
        setAwaitingPassword(false);
        setPendingCommand(null);
        setLogs((prev) => [
          ...prev,
          { type: "error", text: "Authentication failed: Incorrect password." },
        ]);
      }
      setInput("");
      return;
    }

    // Normal command processing
    setHistory((prev) => [...prev, rawInput]);
    setHistoryIndex(-1);
    setInput("");
    processCommand(rawInput);
  };

  const processCommand = (rawCmd) => {
    const cmd = rawCmd.toLowerCase();
    const args = cmd.split(" ");
    const action = args[0];

    // Define protected commands requiring root auth
    const protectedCommands = ["health", "check", "status", "matrix", "sudo", "coffee", "siteconfig"];

    if (protectedCommands.includes(action) && !isAuthenticated) {
      setPendingCommand(rawCmd);
      setAwaitingPassword(true);
      setLogs((prev) => [
        ...prev,
        { type: "input", text: `$ ${rawCmd}` },
        { type: "system", text: `[AUTH REQUIRED] Enter password for '${TERMINAL_USER}' (or type 'cancel'):` },
      ]);
      return;
    }

    executeCommandAction(rawCmd);
  };

  const executeCommandAction = (rawCmd) => {
    const cmd = rawCmd.toLowerCase();
    const newLogs = [...logs, { type: "input", text: `$ ${rawCmd}` }];
    const args = cmd.split(" ");
    const action = args[0];
    const target = args[1];

    switch (action) {
      case "help":
        newLogs.push({
          type: "output",
          text: `Available system commands:
[Public]
- goto [section]   : Scroll to section (e.g., 'goto about', 'goto projects', 'goto contact')
- goto top         : Scroll to the very top of the page
- goto bottom      : Scroll to the footer / bottom of the page
- resume / cv      : Open professional resume in a new tab
- socials / links  : Display direct professional channels & networks
- github / repos   : Summarize live projects & repository records
- experience       : Show live career history & work background
- education        : Show live university & academic credentials
- whoami           : Display active developer profile summary
- skills           : List live technical skill sets
- contact          : Show direct communication channels
- login            : Authenticate manually as '${TERMINAL_USER}'
- refresh          : Reload application state
- cls / clear      : Clear terminal screen logs
- exit             : Drop root session if active, else close terminal

[Protected - Prompts for Password]
- health / check   : Audit DOM and state to verify component rendering
- siteconfig       : Show live environment metrics & dev stack
- matrix           : Enter the matrix stream easter egg
- sudo hire        : Execute system recruitment authorization
- coffee           : Fuel the backend architecture craft
- logout           : Revoke root session access`,
        });
        break;

      case "login":
        if (isAuthenticated) {
          newLogs.push({ type: "success", text: `Already authenticated as ${TERMINAL_USER}.` });
        } else {
          setAwaitingPassword(true);
          newLogs.push({ type: "system", text: `Enter password for ${TERMINAL_USER} (or type 'cancel'):` });
        }
        break;

      case "logout":
        setIsAuthenticated(false);
        newLogs.push({ type: "success", text: "Successfully logged out. Root session revoked." });
        break;

      case "exit":
        if (isAuthenticated) {
          setIsAuthenticated(false);
          newLogs.push({ type: "success", text: "Root session revoked. Switched to guest mode." });
        } else {
          setIsOpen(false);
        }
        break;

      case "health":
      case "check":
      case "status":
        const expectedSections = [
          "header",
          "about",
          "skills",
          "experience",
          "education",
          "solutions",
          "projects",
          "services",
          "testimonials",
          "contact",
        ];

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

        newLogs.push({
          type: missingCount === 0 ? "success" : "error",
          text: auditResults + `\nAudit Status: ${missingCount === 0 ? "All systems nominal. 100% operational." : `${missingCount} section(s) missing/unmapped.`}`,
        });
        break;

      case "goto":
        if (!target) {
          newLogs.push({ type: "error", text: "Error: Missing section name. Try 'goto about', 'goto top', or 'goto bottom'" });
        } else if (target === "top") {
          window.scrollTo({ top: 0, behavior: "smooth" });
          newLogs.push({ type: "success", text: "Successfully scrolled to top of page." });
        } else if (target === "bottom" || target === "footer") {
          window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
          newLogs.push({ type: "success", text: "Successfully scrolled to footer / bottom." });
        } else {
          const sectionMap = {
            about: "about",
            skills: "skills",
            experience: "experience",
            education: "education",
            solutions: "solutions",
            projects: "projects",
            services: "services",
            testimonials: "testimonials",
            contact: "contact",
          };
          const sectionKey = sectionMap[target] || target;
          const element = document.getElementById(sectionKey) || document.querySelector(`.${sectionKey}`) || document.querySelector(`[data-section="${sectionKey}"]`);
          
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
            newLogs.push({ type: "success", text: `Successfully navigated to section: #${sectionKey}` });
          } else {
            newLogs.push({ type: "error", text: `Error: Section '${target}' not found.` });
          }
        }
        break;

      case "top":
        window.scrollTo({ top: 0, behavior: "smooth" });
        newLogs.push({ type: "success", text: "Successfully scrolled to top of page." });
        break;

      case "bottom":
      case "footer":
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
        newLogs.push({ type: "success", text: "Successfully scrolled to footer / bottom." });
        break;

      case "resume":
      case "cv":
        window.open("https://drive.google.com/file/d/1EDfqFGihcKsSksiUIbRPZj8Mw1Bndxc4/view?usp=drive_link", "_blank");
        newLogs.push({ type: "success", text: "Opening professional resume in a new tab..." });
        break;

      case "socials":
      case "links":
        newLogs.push({
          type: "output",
          text: `Professional Networks:
- LinkedIn: ${personal.linkedIn || "N/A"}
- GitHub: ${personal.github || "N/A"}
- Instagram: ${personal.instagram || "N/A"}
- Email: ${personal.email || "N/A"}`,
        });
        break;

      case "github":
      case "repos":
      case "projects":
        const projList = projects.length > 0 
          ? projects.map(p => `- ${p.title || p.name}${p.description ? `: ${p.description}` : ""}`).join("\n") 
          : "No projects loaded.";
        newLogs.push({
          type: "output",
          text: `Live Repositories & Projects:\n${projList}`,
        });
        break;

      case "experience":
        const expList = experience.length > 0 
          ? experience.map(exp => `- ${exp.role || exp.title} at ${exp.company} (${exp.period || exp.duration})`).join("\n")
          : "No experience records available.";
        newLogs.push({
          type: "output",
          text: `Career & Experience:\n${expList}`,
        });
        break;

      case "education":
        const eduList = education.length > 0
          ? education.map(edu => `- ${edu.degree || edu.title} at ${edu.institution || edu.school} (${edu.year || edu.duration || ""})`).join("\n")
          : "No education records available.";
        newLogs.push({
          type: "output",
          text: `Academic Background:\n${eduList}`,
        });
        break;

      case "whoami":
        newLogs.push({
          type: "output",
          text: `${personal.name || "User"} — ${personal.designation || "Developer"}\nAuth Session: ${isAuthenticated ? `${TERMINAL_USER} (root)` : "Guest"}\nLocation: ${personal.address || "N/A"}`,
        });
        break;

      case "siteconfig":
        const stackStr = site.devStack 
          ? Object.entries(site.devStack).map(([k, v]) => `  - ${k}: ${v}`).join("\n")
          : "  - N/A";
        newLogs.push({
          type: "output",
          text: `Environment Configuration:
- Availability: ${site.availabilityStatus || "N/A"} (${site.availabilityLabel || "N/A"})
- Tagline: ${site.footerTagline || "N/A"}
- Dev Stack:
${stackStr}`,
        });
        break;

      case "skills":
        const skillList = skills.length > 0 
          ? skills.map(s => s.name || s).join(", ") 
          : (personal.interests ? personal.interests.join(", ") : "No skills loaded.");
        newLogs.push({
          type: "output",
          text: `Active Skills / Stack:\n${skillList}`,
        });
        break;

      case "contact":
        newLogs.push({
          type: "output",
          text: `Direct Contact Channels:\n- Email: ${personal.email}\n- Phone: ${personal.phone}\n- Address: ${personal.address}\n- Intro: ${site.contactSectionIntro || "N/A"}`,
        });
        break;

      case "matrix":
        newLogs.push({
          type: "success",
          text: "Wake up, Neo... The matrix has you. Follow the white rabbit.",
        });
        break;

      case "sudo":
        if (!target || target === "hire" || target === "su") {
          newLogs.push({
            type: "success",
            text: `ACCESS GRANTED: Root privileges acquired. ${personal.name || "Candidate"} successfully authorized for high-impact enterprise engineering roles!`,
          });
        } else {
          newLogs.push({ type: "error", text: `Permission denied for sudo '${target}'. Try 'sudo hire'.` });
        }
        break;

      case "coffee":
        newLogs.push({
          type: "success",
          text: "☕ High-octane chai infused successfully. Compiling distributed event-driven workflows at 100% efficiency!",
        });
        break;

      case "refresh":
        newLogs.push({ type: "success", text: "Refreshing system instance..." });
        setTimeout(() => window.location.reload(), 800);
        break;

      case "cls":
      case "clear":
        setLogs([]);
        setInput("");
        return;

      default:
        newLogs.push({ type: "error", text: `Command not recognized: '${action}'. Type 'help' for available options.` });
        break;
    }

    setLogs(newLogs);
  };

  return (
    <>
      {/* Floating Top-Right Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 z-50 flex items-center gap-2 px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-cyan-400 font-mono text-xs backdrop-blur-md shadow-lg hover:bg-white/10 transition-all cursor-pointer"
        title="Toggle Terminal (Ctrl + `)"
      >
        <Terminal size={14} />
        <span>~/terminal</span>
      </button>

      {/* Terminal Window Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 right-4 left-4 md:left-auto md:w-[560px] z-50 rounded-2xl bg-[#09090b]/95 border border-cyan-500/30 backdrop-blur-2xl shadow-2xl overflow-hidden font-mono text-sm"
          >
            {/* Window Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-white/[0.03] border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80 cursor-pointer" onClick={() => setIsOpen(false)} />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <span className="text-xs text-gray-400 ml-2">
                  {isAuthenticated ? `${TERMINAL_USER} (root)` : "guest@portfolio"}
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Terminal Logs Output - Fully Scrollable */}
            <div className="p-4 h-64 overflow-y-auto overflow-x-auto flex flex-col gap-2 text-xs scrollbar-thin scrollbar-thumb-white/10">
              {logs.map((log, index) => (
                <div
                  key={index}
                  className={`whitespace-pre-wrap leading-relaxed ${
                    log.type === "error"
                      ? "text-red-400"
                      : log.type === "success"
                      ? "text-green-400"
                      : log.type === "input"
                      ? "text-cyan-300 font-semibold"
                      : "text-gray-300"
                  }`}
                >
                  {log.text}
                </div>
              ))}
              <div ref={logsEndRef} />
            </div>

            {/* Terminal Input Form */}
            <form
              onSubmit={handleCommand}
              className="flex items-center px-4 py-3 bg-black/40 border-t border-white/10 gap-2"
            >
              <ChevronRight size={14} className="text-cyan-400 shrink-0" />
              <input
                ref={inputRef}
                type={awaitingPassword ? "password" : "text"}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  awaitingPassword
                    ? "Enter password (or type 'cancel')..."
                    : "type 'health', 'login', 'help'..."
                }
                className="w-full bg-transparent text-white focus:outline-none font-mono text-xs placeholder:text-gray-600"
              />
              <button type="submit" className="text-gray-500 hover:text-cyan-400 transition-colors cursor-pointer">
                <CornerDownLeft size={14} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, X, ChevronRight, CornerDownLeft, ShieldCheck, Sparkles } from "lucide-react";
import { terminalService } from "../../api/services/terminal.service";

export default function CommandTerminal({ portfolioData }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [awaitingPassword, setAwaitingPassword] = useState(false);
  const [pendingCommand, setPendingCommand] = useState(null);

  // Mapped correctly to your centralized PortfolioService structure:
  const profile = portfolioData?.personal || portfolioData?.profile || {};
  const contacts = portfolioData?.contacts || profile;
  const config = portfolioData?.terminalConfig || {};
  const sectionMap = config.sectionMap || {};

  const TERMINAL_USER = profile.terminalUser || profile.terminaluser || config.defaultUser || "root";
  const TERMINAL_PASS = profile.terminalPass || profile.terminalpass || config.defaultPass || "";

  const [logs, setLogs] = useState([
    { type: "system", text: `System Terminal v${config.version || "6.3.1"} initialized (DB-Driven Active).` },
    { type: "system", text: "Type 'help' for available commands. Protected commands require root authentication." },
  ]);
  
  const inputRef = useRef(null);
  const logsEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // Global Key Listener for Ctrl+` and Arrow History Navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === "`") {
        e.preventDefault();
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

    if (awaitingPassword) {
      const passwordInput = rawInput;

      if (passwordInput.toLowerCase() === "cancel" || passwordInput.toLowerCase() === "exit") {
        setAwaitingPassword(false);
        setPendingCommand(null);
        setLogs((prev) => [
          ...prev,
          { type: "input", text: `$ ${passwordInput}` },
          { type: "system", text: "Authentication sequence aborted." },
        ]);
        setInput("");
        return;
      }

      setLogs((prev) => [
        ...prev,
        { type: "input", text: `$ ${"*".repeat(passwordInput.length)}` },
      ]);

      if (passwordInput === TERMINAL_PASS) {
        setIsAuthenticated(true);
        setAwaitingPassword(false);
        setLogs((prev) => [
          ...prev,
          { type: "success", text: `Authenticated successfully as root (${TERMINAL_USER}).` },
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

    setHistory((prev) => [...prev, rawInput]);
    setHistoryIndex(-1);
    setInput("");
    processCommand(rawInput);
  };

  const processCommand = (rawCmd) => {
    const cmd = rawCmd.toLowerCase();
    const args = cmd.split(" ");
    const action = args[0];

    if (action === "login") {
      if (isAuthenticated) {
        setLogs((prev) => [
          ...prev,
          { type: "input", text: `$ ${rawCmd}` },
          { type: "system", text: `Already logged in as root (${TERMINAL_USER}).` },
        ]);
      } else {
        setPendingCommand(null);
        setAwaitingPassword(true);
        setLogs((prev) => [
          ...prev,
          { type: "input", text: `$ ${rawCmd}` },
          { type: "system", text: `Enter password for root user '${TERMINAL_USER}' (or type 'cancel'):` },
        ]);
      }
      return;
    }

    const protectedCommands = config.protectedCommands || ["health", "siteconfig"];
    if (protectedCommands.includes(action) && !isAuthenticated) {
      setPendingCommand(rawCmd);
      setAwaitingPassword(true);
      setLogs((prev) => [
        ...prev,
        { type: "input", text: `$ ${rawCmd}` },
        { type: "system", text: `[AUTH REQUIRED] Enter password for root user '${TERMINAL_USER}' (or type 'cancel'):` },
      ]);
      return;
    }

    executeCommandAction(rawCmd);
  };

  const executeCommandAction = (rawCmd) => {
    const cmd = rawCmd.toLowerCase();
    const args = cmd.split(" ");
    const action = args[0];
    const target = args[1];

    if (action === "cls" || action === "clear") {
      setLogs([]);
      return;
    }

    if (action === "logout") {
      setIsAuthenticated(false);
      setLogs((prev) => [
        ...prev,
        { type: "input", text: `$ ${rawCmd}` },
        { type: "success", text: "Successfully logged out. Root session revoked." },
      ]);
      return;
    }

    if (action === "refresh" || action === "reload") {
      setLogs((prev) => [
        ...prev,
        { type: "input", text: `$ ${rawCmd}` },
        { type: "success", text: "Refreshing application state & reloading..." },
      ]);
      setTimeout(() => window.location.reload(), 500);
      return;
    }

    const newLogs = [...logs, { type: "input", text: `$ ${rawCmd}` }];

    if (action === "goto" && target) {
      const sectionKey = sectionMap[target] || target;
      const element = document.getElementById(sectionKey);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        newLogs.push({ type: "success", text: `Scrolling to section '${target}'...` });
      } else {
        newLogs.push({ type: "error", text: `Section '${target}' not found in database view map.` });
      }
      setLogs(newLogs);
      return;
    }

    if (action === "resume" || action === "cv") {
      const resumeUrl = profile.resumeUrl || profile.resumeurl || profile.resume;
      if (resumeUrl) {
        window.open(resumeUrl, "_blank");
        newLogs.push({ type: "success", text: "Opening professional resume in a new tab..." });
      } else {
        newLogs.push({ type: "error", text: "Resume URL not found in profile record. Add 'resumeUrl' to your profile table." });
      }
      setLogs(newLogs);
      return;
    }

    if (action === "github" || action === "repos" || action === "repo") {
      const githubUrl = contacts.github || profile.github;
      if (githubUrl) {
        window.open(githubUrl, "_blank");
        newLogs.push({ type: "success", text: `Redirecting to GitHub: ${githubUrl}` });
      } else {
        newLogs.push({ type: "error", text: "GitHub URL not configured in database profile." });
      }
      setLogs(newLogs);
      return;
    }

    if (action === "socials" || action === "links") {
      newLogs.push({
        type: "system",
        text: `Professional Networks (From DB Profile):\n - LinkedIn: ${contacts.linkedIn || profile.linkedIn || 'N/A'}\n - GitHub: ${contacts.github || profile.github || 'N/A'}\n - Instagram: ${contacts.instagram || profile.instagram || 'N/A'}\n - Email: ${contacts.email || profile.email || 'N/A'}`,
      });
      setLogs(newLogs);
      return;
    }

    let result = null;
    try {
      if (terminalService && typeof terminalService.processCommand === "function") {
        result = terminalService.processCommand(action, target, portfolioData, isAuthenticated);
      }
    } catch (err) {
      result = null;
    }

    if (!result) {
      newLogs.push({
        type: "error",
        text: `command not found: ${action}. Type 'help' for available commands.`,
      });
    } else {
      newLogs.push({ type: result.type || "system", text: result.text });
    }

    setLogs(newLogs);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 z-50 flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-black/70 border border-cyan-500/20 text-cyan-400 font-mono text-xs backdrop-blur-xl shadow-lg shadow-cyan-500/5 hover:bg-cyan-500/15 hover:border-cyan-500/40 transition-all cursor-pointer group"
        title="Toggle Terminal (Ctrl + `)"
      >
        <Terminal size={14} className="group-hover:rotate-12 transition-transform duration-300" />
        <span className="tracking-wide">~/terminal</span>
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.96 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed top-16 right-4 left-4 md:left-auto md:w-[600px] z-50 rounded-2xl bg-[#0c0d12]/95 border border-cyan-500/30 backdrop-blur-2xl shadow-2xl shadow-cyan-500/10 overflow-hidden font-mono text-sm"
          >
            <div className="flex items-center justify-between px-4 py-3 bg-white/[0.02] border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/85 hover:bg-red-600 cursor-pointer transition-colors" onClick={() => setIsOpen(false)} title="Close" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/85 hover:bg-yellow-600 transition-colors" title="Minimize" />
                  <div className="w-3 h-3 rounded-full bg-green-500/85 hover:bg-green-600 transition-colors" title="Expand" />
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Sparkles size={12} className="text-cyan-400" />
                  <span className="font-semibold text-gray-300">
                    {isAuthenticated ? `${TERMINAL_USER} (root)` : `${profile.name?.toLowerCase().replace(/\s+/g, '') || 'guest'}@portfolio`}
                  </span>
                  {isAuthenticated && <ShieldCheck size={12} className="text-green-400 ml-0.5" />}
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors cursor-pointer p-1 rounded-lg hover:bg-white/5"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-4 h-72 overflow-y-auto overflow-x-auto flex flex-col gap-2 text-xs scrollbar-thin scrollbar-thumb-cyan-500/20 scrollbar-track-transparent">
              {logs.map((log, index) => (
                <div
                  key={index}
                  className={`whitespace-pre-wrap leading-relaxed ${
                    log.type === "error"
                      ? "text-red-400 font-medium"
                      : log.type === "success"
                      ? "text-green-400 font-medium"
                      : log.type === "input"
                      ? "text-cyan-300 font-semibold flex items-center gap-1.5"
                      : "text-gray-300"
                  }`}
                >
                  {log.text}
                </div>
              ))}
              <div ref={logsEndRef} />
            </div>

            <form
              onSubmit={handleCommand}
              className="flex items-center px-4 py-3 bg-black/60 border-t border-white/10 gap-2.5"
            >
              <ChevronRight size={14} className="text-cyan-400 shrink-0 animate-pulse" />
              <input
                ref={inputRef}
                type={awaitingPassword ? "password" : "text"}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  awaitingPassword
                    ? "Enter root password (or type 'cancel')..."
                    : "Type 'help', 'goto about', 'resume', 'repos'..."
                }
                className="w-full bg-transparent text-white focus:outline-none font-mono text-xs placeholder:text-gray-600 tracking-wide"
              />
              <button type="submit" className="text-gray-500 hover:text-cyan-400 transition-colors cursor-pointer p-1 rounded-md hover:bg-white/5">
                <CornerDownLeft size={14} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
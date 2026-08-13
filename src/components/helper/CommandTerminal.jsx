// src/components/helper/CommandTerminal.jsx
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, X, ChevronRight, CornerDownLeft } from "lucide-react";
import { TerminalService } from "../../api/services/terminal.service";

export default function CommandTerminal({ portfolioData }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [awaitingPassword, setAwaitingPassword] = useState(false);
  const [pendingCommand, setPendingCommand] = useState(null);

  const config = TerminalService.getConfig();
  const personal = portfolioData?.personal || {};
  const TERMINAL_USER = personal.terminalUser || config.defaultUser;
  const TERMINAL_PASS = personal.terminalPass || config.defaultPass;

  const [logs, setLogs] = useState([
    { type: "system", text: `System Terminal v${config.version} initialized (Robust Sudo Routing Active).` },
    { type: "system", text: "Type 'help' for available commands. Protected commands will prompt for password." },
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

    if (awaitingPassword) {
      const passwordInput = rawInput;

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

    setHistory((prev) => [...prev, rawInput]);
    setHistoryIndex(-1);
    setInput("");
    processCommand(rawInput);
  };

  const processCommand = (rawCmd) => {
    const cmd = rawCmd.toLowerCase();
    const args = cmd.split(" ");
    const action = args[0];

    if (config.protectedCommands.includes(action) && !isAuthenticated) {
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
    const args = cmd.split(" ");
    const action = args[0];
    const target = args[1];

    if (action === "cls" || action === "clear") {
      setLogs([]);
      return;
    }

    const result = TerminalService.processCommand(action, target, portfolioData, isAuthenticated);
    const newLogs = [...logs, { type: "input", text: `$ ${rawCmd}` }];

    if (result.type === "promptPassword") {
      setAwaitingPassword(true);
      newLogs.push({ type: "system", text: result.text });
    } else if (result.type === "logoutSuccess") {
      setIsAuthenticated(false);
      newLogs.push({ type: "success", text: result.text });
    } else if (result.type === "exitSession") {
      if (result.isAuthenticated) {
        setIsAuthenticated(false);
        newLogs.push({ type: "success", text: "Root session revoked. Switched to guest mode." });
      } else {
        setIsOpen(false);
      }
      return;
    } else {
      newLogs.push({ type: result.type, text: result.text });
    }

    setLogs(newLogs);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 z-50 flex items-center gap-2 px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-cyan-400 font-mono text-xs backdrop-blur-md shadow-lg hover:bg-white/10 transition-all cursor-pointer"
        title="Toggle Terminal (Ctrl + `)"
      >
        <Terminal size={14} />
        <span>~/terminal</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 right-4 left-4 md:left-auto md:w-[560px] z-50 rounded-2xl bg-[#09090b]/95 border border-cyan-500/30 backdrop-blur-2xl shadow-2xl overflow-hidden font-mono text-sm"
          >
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
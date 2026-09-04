import React, { useState, useRef, useEffect } from "react";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import {
  FaPlay,
  FaTerminal,
  FaCircleNotch,
  FaRotateLeft,
  FaTrashCan,
  FaCode,
  FaChevronDown,
  FaBookOpen,
  FaTriangleExclamation,
  FaXmark
} from "react-icons/fa6";

// ==========================================
// Sandboxed Execution Iframe Content
// ==========================================
const iframeSandboxContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <style>
    body {
      background-color: #181818;
      color: #cccccc;
      font-family: 'Fira Code', 'Cascadia Code', Consolas, monospace;
      font-size: 12px;
      margin: 0;
      padding: 12px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      height: 100vh;
      box-sizing: border-box;
    }
    .log { margin-bottom: 4px; white-space: pre-wrap; word-break: break-all; }
    .log.error { color: #f85149; }
    .log.result { color: #3fb950; font-weight: bold; }
    .log.info { color: #d2a8ff; }
  </style>
</head>
<body>
  <script>
    const originalConsole = { ...console };
    window.console = {
      log: (...args) => sendToParent('log', args.map(formatArg).join(' ')),
      error: (...args) => sendToParent('error', 'Error: ' + args.map(formatArg).join(' ')),
      warn: (...args) => sendToParent('info', 'Warning: ' + args.map(formatArg).join(' ')),
      window: undefined, document: undefined, parent: undefined, top: undefined, localStorage: undefined, sessionStorage: undefined, indexedDB: undefined, alert: undefined, prompt: undefined, confirm: undefined,
    };

    function formatArg(arg) {
      if (typeof arg === 'object') {
        try { return JSON.stringify(arg, null, 2); } catch (e) { return '[Circular Object]'; }
      }
      return String(arg);
    }

    function sendToParent(type, payload) {
      window.parent.postMessage({ type, payload }, '*');
    }

    window.addEventListener('message', (event) => {
      const { code, context } = event.data;
      if (!code) return;
      const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
      try {
        const sandbox = new AsyncFunction('developerData', 'console', code);
        sandbox(context, window.console)
          .then((result) => {
            if (result !== undefined) sendToParent('result', '=> ' + formatArg(result));
            sendToParent('status', 'complete');
          })
          .catch((err) => {
            sendToParent('error', 'Runtime Error: ' + err.message);
            sendToParent('status', 'error');
          });
      } catch (err) {
        sendToParent('error', 'Syntax Error: ' + err.message);
        sendToParent('status', 'syntax_error');
      }
    });
    window.parent.postMessage({ type: 'ready' }, '*');
  </script>
</body>
</html>
`;

const DEFAULT_CODE = `// Edit JS. 'developerData' is accessible safely.
console.log("Console Initialized.");

const formatBio = (data) => {
  const tech = data.interests ? data.interests.slice(0, 2).join(', ') : 'Tech';
  return \`\${data.name} is a \${data.role} specializing in \${tech}.\`;
};

console.log("Bio Generated:");
return formatBio(developerData);`;

const PRESETS = [
  {
    label: "Filter Tech Interests",
    code: `// Filter interests/skills containing specific keywords
const techList = developerData.interests || [];
const filtered = techList.filter(item => item.length > 3);
console.log("Filtered Interests (>3 chars):", filtered);
return filtered;`
  },
  {
    label: "Extract Profile Info",
    code: `// Quick overview payload generator
const summary = {
  name: developerData.name,
  role: developerData.role,
  totalInterests: developerData.interests?.length || 0
};
console.log("Summary Object:");
return summary;`
  }
];

const PAIR_MAP = {
  '{': '}',
  '[': ']',
  '(': ')',
  '"': '"',
  "'": "'",
  '`': '`'
};

const CodePlayground = ({ developerData }) => {
  const [jsCode, setJsCode] = useState(DEFAULT_CODE);
  const [consoleLogs, setConsoleLogs] = useState([{ type: 'info', message: 'Sandbox initialized. Ready to execute.' }]);
  const [executionStatus, setExecutionStatus] = useState('idle');
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [isPresetDropdownOpen, setIsPresetDropdownOpen] = useState(false);
  const [syntaxError, setSyntaxError] = useState(null);
  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });
  const [isConsolePopupOpen, setIsConsolePopupOpen] = useState(false);
  
  const iframeRef = useRef(null);
  const consoleContainerRef = useRef(null);

  // Live syntax lint checker
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!jsCode.trim()) {
        setSyntaxError(null);
        return;
      }
      try {
        // eslint-disable-next-line no-new-func
        new Function('developerData', 'console', jsCode);
        setSyntaxError(null);
      } catch (err) {
        setSyntaxError(err.message);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [jsCode]);

  // Console auto-scroll
  useEffect(() => {
    if (consoleContainerRef.current) {
      consoleContainerRef.current.scrollTop = consoleContainerRef.current.scrollHeight;
    }
  }, [consoleLogs]);

  // Handle incoming iframe messages
  useEffect(() => {
    const handleIframeMessage = (event) => {
      if (event.source !== iframeRef.current?.contentWindow) return;
      const { type, payload } = event.data;
      if (type === 'ready') {
        setExecutionStatus('idle');
      } else if (type === 'log' || type === 'error' || type === 'result' || type === 'info') {
        setConsoleLogs((prev) => [...prev, { type, message: payload }]);
      } else if (type === 'status') {
        setExecutionStatus(payload);
      }
    };
    window.addEventListener('message', handleIframeMessage);
    return () => window.removeEventListener('message', handleIframeMessage);
  }, []);

  // Shortcut key handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        e.stopPropagation();
        handleRunCode();
        return;
      }
      if (e.key === 'Escape' && isConsolePopupOpen) {
        setIsConsolePopupOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [jsCode, executionStatus, isConsolePopupOpen]);

  // Handle Auto-closing Brackets & Quotes
  const handleEditorKeyDown = (e) => {
    const target = e.target;
    const { selectionStart, selectionEnd, value } = target;
    const char = e.key;

    setTimeout(updateCursorPosition, 10);

    if (PAIR_MAP[char]) {
      if (selectionStart !== selectionEnd) {
        e.preventDefault();
        const selectedText = value.substring(selectionStart, selectionEnd);
        const closingChar = PAIR_MAP[char];
        const updated = value.substring(0, selectionStart) + char + selectedText + closingChar + value.substring(selectionEnd);
        setJsCode(updated);
        setTimeout(() => {
          target.setSelectionRange(selectionStart + 1, selectionEnd + 1);
        }, 0);
        return;
      }

      e.preventDefault();
      const closingChar = PAIR_MAP[char];
      const updated = value.substring(0, selectionStart) + char + closingChar + value.substring(selectionEnd);
      setJsCode(updated);
      setTimeout(() => {
        target.setSelectionRange(selectionStart + 1, selectionStart + 1);
      }, 0);
    }
  };

  const updateCursorPosition = () => {
    const textarea = document.getElementById("code-editor-textarea");
    if (!textarea) return;
    const text = textarea.value;
    const index = textarea.selectionStart;
    const lines = text.substring(0, index).split("\n");
    setCursorPos({
      line: lines.length,
      col: lines[lines.length - 1].length + 1
    });
  };

  const handleRunCode = () => {
    if (!iframeRef.current || executionStatus === 'running') return;
    setConsoleLogs([]);
    setExecutionStatus('running');
    setIsConsolePopupOpen(true);
    iframeRef.current.contentWindow.postMessage({
      code: jsCode,
      context: developerData
    }, '*');
  };

  const handleResetCode = () => setJsCode(DEFAULT_CODE);
  const handleClearConsole = () => setConsoleLogs([]);

  const renderLogLine = (log, index) => {
    let dotColor = "bg-[#8b949e]";
    if (log.type === 'error') dotColor = "bg-[#f85149]";
    if (log.type === 'result') dotColor = "bg-[#3fb950]";

    return (
      <div key={index} className="flex items-start gap-3 group/log font-mono text-xs leading-5 hover:bg-[#202020] px-3 py-1">
        <div className="w-6 shrink-0 flex justify-end items-center h-full pt-0.5">
          <span className={`inline-block w-2 h-2 rounded-full ${dotColor} opacity-75 group-hover/log:opacity-100`}></span>
        </div>
        <pre className={`whitespace-pre-wrap flex-grow ${log.type === 'error' ? 'text-[#f85149]' : log.type === 'result' ? 'text-[#3fb950]' : 'text-[#79c0ff]'}`}>
          {log.message}
        </pre>
      </div>
    );
  };

  return (
    <div className="relative flex flex-col rounded-xl overflow-hidden border border-[#333333] shadow-2xl bg-[#181818]">
      
      {/* VS Code Dark Modern Top Bar */}
      <div className="flex items-center justify-between bg-[#202020] px-4 py-2.5 border-b border-[#333333]">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 mr-2">
            <span className="w-3 h-3 rounded-full bg-[#FF5F56] inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-[#FFBD2E] inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-[#27C93F] inline-block"></span>
          </div>
          <div className="flex items-center gap-2 bg-[#181818] px-3.5 py-1 rounded-t border-t-2 border-[#007acc] text-xs font-mono text-[#cccccc]">
            <FaCode size={12} className="text-[#519aba]" />
            <span>main.js</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsConsolePopupOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#2d2d2d] hover:bg-[#383838] text-[10px] font-mono text-[#cccccc] transition-colors"
          >
            <FaTerminal size={10} className="text-[#4ec9b0]" />
            <span>Output</span>
          </button>

          <button
            type="button"
            onClick={() => setIsInspectorOpen(!isInspectorOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#2d2d2d] hover:bg-[#383838] text-[10px] font-mono text-[#cccccc] transition-colors"
          >
            <FaBookOpen size={10} className="text-[#4ec9b0]" />
            <span>{isInspectorOpen ? 'Hide Data' : 'Inspect Data'}</span>
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setIsPresetDropdownOpen(!isPresetDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#2d2d2d] hover:bg-[#383838] text-[10px] font-mono text-[#cccccc] transition-colors"
            >
              <span>Snippets</span>
              <FaChevronDown size={8} />
            </button>
            {isPresetDropdownOpen && (
              <div className="absolute right-0 mt-1 w-48 bg-[#252526] border border-[#454545] rounded shadow-xl z-20 py-1">
                {PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setJsCode(preset.code);
                      setIsPresetDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-[11px] font-mono text-[#cccccc] hover:bg-[#37373d] transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleResetCode}
            className="p-1.5 rounded text-[#858585] hover:text-[#cccccc] hover:bg-[#2d2d2d] transition-colors"
            title="Reset to default code"
          >
            <FaRotateLeft size={11} />
          </button>
        </div>
      </div>

      {/* Inspector Drawer */}
      {isInspectorOpen && (
        <div className="bg-[#141414] border-b border-[#333333] p-3 text-xs font-mono max-h-48 overflow-y-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase tracking-wider text-[#858585]">// Available Context: developerData</span>
            <span className="text-[10px] text-[#3fb950]">Read-Only</span>
          </div>
          <pre className="text-[#79c0ff] bg-[#101010] p-2.5 rounded border border-[#222222]">
            {JSON.stringify(developerData, null, 2)}
          </pre>
        </div>
      )}

      {/* Editor Section */}
      <div className="bg-[#181818] p-3 md:p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#858585]">
            Edit JS &bull; Hit Run (Ctrl + Enter)
          </span>
          <button
            type="button"
            onClick={handleRunCode}
            disabled={executionStatus === 'running'}
            className={`flex items-center gap-1.5 rounded bg-[#0e639c]/30 border border-[#007acc]/50 px-3.5 py-1.5 font-mono text-[10px] uppercase text-[#3794ff] transition-all hover:bg-[#0e639c]/50 shadow-sm ${
              executionStatus === 'running' ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <FaPlay size={9} />
            <span>{executionStatus === 'running' ? 'Running...' : 'Run Code'}</span>
          </button>
        </div>
        
        <div className="rounded bg-[#121212] text-xs focus-within:ring-1 focus-within:ring-[#007acc] border border-[#333333] overflow-hidden relative">
          <Editor
            value={jsCode}
            onValueChange={(code) => setJsCode(code)}
            highlight={(code) => highlight(code, languages.javascript, 'javascript')}
            padding={16}
            textareaId="code-editor-textarea"
            textareaClassName="focus:outline-none"
            preClassName="font-mono text-xs text-[#d4d4d4]"
            onKeyDown={handleEditorKeyDown}
            onClick={updateCursorPosition}
            onKeyUp={updateCursorPosition}
            style={{
              fontFamily: '"Fira Code", "Cascadia Code", Consolas, monospace',
              fontSize: 13,
              backgroundColor: '#121212',
              minHeight: '14rem',
              color: '#d4d4d4'
            }}
          />
          <div className="absolute bottom-1 right-3 pointer-events-none font-mono text-[10px] text-[#666]">
            Ln {cursorPos.line}, Col {cursorPos.col}
          </div>
        </div>

        {syntaxError && (
          <div className="mt-2 flex items-center gap-2 bg-[#5a1d1d]/40 border border-[#f85149]/40 px-3 py-1.5 rounded text-[11px] font-mono text-[#f85149]">
            <FaTriangleExclamation size={12} className="shrink-0 text-[#f85149]" />
            <span className="truncate">Syntax Warning: {syntaxError}</span>
          </div>
        )}
      </div>

      {/* Secure Sandboxed Iframe (removed allow-same-origin) */}
      <iframe
        ref={iframeRef}
        sandbox="allow-scripts"
        srcDoc={iframeSandboxContent}
        style={{ display: 'none' }}
        title="js-sandbox"
      />

      {/* ========================================== */}
      {/* FLOATING POPUP TERMINAL OVERLAY            */}
      {/* ========================================== */}
      {isConsolePopupOpen && (
        <div className="absolute inset-x-3 bottom-3 z-50 flex flex-col rounded-lg bg-[#1f1f1f] border border-[#454545] shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-3 transition-all max-h-[50vh]">
          
          <div className="flex items-center justify-between bg-[#2d2d2d] px-3.5 py-2 rounded-t-lg border-b border-[#383838]">
            <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-[#cccccc]">
              <FaTerminal size={11} className="text-[#4ec9b0]" />
              <span>Execution Terminal Output</span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                {executionStatus === 'running' && <FaCircleNotch className="animate-spin text-[#858585]" size={10}/>}
                <span className={`inline-block w-2 h-2 rounded-full ${
                    executionStatus === 'running' ? 'bg-[#cca700] animate-pulse' : 
                    executionStatus === 'complete' ? 'bg-[#3fb950]' : 
                    executionStatus === 'error' || executionStatus === 'syntax_error' ? 'bg-[#f85149]' : 'bg-[#858585]'
                }`}></span>
                <span className="text-[10px] capitalize text-[#aaa]">{executionStatus}</span>
              </div>

              <button
                type="button"
                onClick={handleClearConsole}
                className="p-1 hover:text-white text-[#858585] transition-colors"
                title="Clear Logs"
              >
                <FaTrashCan size={11} />
              </button>

              <button
                type="button"
                onClick={() => setIsConsolePopupOpen(false)}
                className="p-1 hover:text-white text-[#858585] transition-colors ml-1"
                title="Close Popup (Esc)"
              >
                <FaXmark size={13} />
              </button>
            </div>
          </div>

          <div 
            ref={consoleContainerRef} 
            className="overflow-y-auto p-3 bg-[#121212] font-mono text-xs flex flex-col min-h-[5rem] max-h-[35vh]"
          >
            {consoleLogs.length === 0 ? (
              <div className="text-center text-[#666] py-4">No output recorded yet.</div>
            ) : (
              consoleLogs.map(renderLogLine)
            )}
          </div>
          
        </div>
      )}
      
    </div>
  );
};

export default CodePlayground;
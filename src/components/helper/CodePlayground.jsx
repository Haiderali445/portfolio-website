import React, { useState, useRef, useEffect } from "react";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import {
  FaPlay,
  FaTerminal,
  FaCircleNotch
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
      background-color: #1e1e1e;
      color: #d4d4d4;
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
    .log.error { color: #f47067; }
    .log.result { color: #4ec9b0; font-weight: bold; }
    .log.info { color: #6a9955; }
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

const CodePlayground = ({ developerData }) => {
  const [jsCode, setJsCode] = useState(
`// Edit JS. 'developerData' is accessible safely.
console.log("Console Initialized.");

const formatBio = (data) => {
  const tech = data.interests.slice(0, 2).join(', ');
  return \`\${data.name} is a \${data.role} specializing in \${tech}.\`;
};

console.log("Bio Generated:");
return formatBio(developerData);`
  );

  const [consoleLogs, setConsoleLogs] = useState([{ type: 'info', message: 'Sandbox initialized.' }]);
  const [executionStatus, setExecutionStatus] = useState('idle');
  const iframeRef = useRef(null);

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

  const handleRunCode = () => {
    if (!iframeRef.current || executionStatus === 'running') return;
    setConsoleLogs([]);
    setExecutionStatus('running');
    iframeRef.current.contentWindow.postMessage({
      code: jsCode,
      context: developerData
    }, '*');
  };

  const renderLogLine = (log, index) => {
    let dotColor = "bg-[#858585]";
    if (log.type === 'error') dotColor = "bg-[#F47067]";
    if (log.type === 'result') dotColor = "bg-[#4EC9B0]";

    return (
      <div key={index} className="flex items-start gap-3 group/log font-mono text-xs leading-5 hover:bg-[#2a2d2e]">
        <div className="w-10 shrink-0 flex justify-end items-center h-full pt-0.5">
          <span className={`inline-block w-2 h-2 rounded-full ${dotColor} opacity-75 group-hover/log:opacity-100`}></span>
        </div>
        <pre className={`whitespace-pre-wrap flex-grow ${log.type === 'error' ? 'text-[#F47067]' : log.type === 'result' ? 'text-[#4EC9B0]' : 'text-[#4ec9b0]'}`}>
          {log.message}
        </pre>
      </div>
    );
  };

  return (
    <div className="flex flex-col">
      <div className="border-b border-[#2d2d2d] bg-[#1e1e1e] p-3 md:p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#858585]">
            // Edit & Run JavaScript (Read-Only access to `developerData`)
          </span>
          <button
            type="button"
            onClick={handleRunCode}
            disabled={executionStatus === 'running'}
            className={`flex items-center gap-1.5 rounded bg-primary/25 border border-primary/40 px-3 py-1.5 font-mono text-[10px] uppercase text-primary transition-all hover:bg-primary/35 ${executionStatus === 'running' ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <FaPlay size={9} />
            <span>{executionStatus === 'running' ? 'Running...' : 'Run Code'}</span>
          </button>
        </div>
        
        <div className="rounded bg-[#121212] text-xs focus-within:ring-1 focus-within:ring-primary/50 border border-[#333] overflow-hidden">
          <Editor
            value={jsCode}
            onValueChange={(code) => setJsCode(code)}
            highlight={(code) => highlight(code, languages.javascript, 'javascript')}
            padding={16}
            textareaClassName="focus:outline-none"
            preClassName="font-mono text-xs text-white/90"
            style={{
              fontFamily: '"Fira Code", "Cascadia Code", Consolas, monospace',
              fontSize: 13,
              backgroundColor: '#121212',
              minHeight: '9rem',
              color: '#D4D4D4'
            }}
          />
        </div>
      </div>

      <div className="bg-[#141414] p-3 md:p-4 h-40 flex flex-col">
        <div className="mb-2 flex items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-wider text-[#858585]">
          <div className="flex items-center gap-2">
            <FaTerminal size={10} className="text-[#4ec9b0]" />
            <span>Console Output</span>
          </div>
          
          <div className="flex items-center gap-1.5">
            {executionStatus === 'running' && <FaCircleNotch className="animate-spin text-[#858585]" size={10}/>}
            <span className={`inline-block w-2 h-2 rounded-full ${
                executionStatus === 'running' ? 'bg-[#FFBD2E] animate-pulse' : 
                executionStatus === 'complete' ? 'bg-[#27C93F]' : 
                executionStatus === 'error' || executionStatus === 'syntax_error' ? 'bg-[#FF5F56]' : 'bg-[#858585]'
            }`}></span>
            <span className="text-[9px] capitalize">{executionStatus}</span>
          </div>
        </div>
        
        <iframe
          ref={iframeRef}
          sandbox="allow-scripts allow-same-origin"
          srcDoc={iframeSandboxContent}
          style={{ display: 'none' }}
          title="js-sandbox"
        />

        <div className="flex-grow overflow-y-auto rounded bg-[#0d0d0d] py-3 border border-[#222]">
          {consoleLogs.map(renderLogLine)}
        </div>
      </div>
    </div>
  );
};

export default CodePlayground;
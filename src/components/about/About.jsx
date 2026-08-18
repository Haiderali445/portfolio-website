import React, { useMemo, useState } from "react";
import "../../styles/prism-vsc-dark-plus.css"; 
import CodePlayground from "../helper/CodePlayground";

import {
  FaCircle,
  FaCopy,
  FaCheck,
  FaChevronDown,
  FaChevronUp,
  FaEnvelope,
  FaPhone,
  FaCode,
  FaTerminal
} from "react-icons/fa6";

// ==========================================
// Main Component
// ==========================================
const About = ({ personalData }) => {
  const [copied, setCopied] = useState("");
  const [jsonExpanded, setJsonExpanded] = useState(true);
  const [activeFocus, setActiveFocus] = useState(0);
  const [editorMode, setEditorMode] = useState("json");

  const focusItems = personalData.aboutFocus || [];

  const developerData = useMemo(
    () => ({
      name: personalData.name || "Developer",
      role: personalData.designation || "Engineer",
      email: personalData.email || "mail@ex.com",
      status: personalData.availabilityLabel || "Open",
      interests: personalData.interests || ["Coding", "Architecture"]
    }),
    [personalData]
  );

  const jsonString = JSON.stringify(developerData, null, 2);
  const jsonLines = jsonString.split("\n");

  const handleCopy = async (value, type) => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(type);
      setTimeout(() => setCopied(""), 2000);
    } catch {
      setCopied("");
    }
  };

  const highlightJsonLine = (line) => {
    const tokenRegex = /("(?:\\.|[^"\\])*")(?=\s*:)|("(?:\\.|[^"\\])*")|\b(true|false|null)\b|-?\d+(?:\.\d+)?|[{}[\],:]/g;
    const parts = [];
    let lastIndex = 0;
    let match;
    while ((match = tokenRegex.exec(line)) !== null) {
      if (match.index > lastIndex) {
        parts.push(<span key={`text-${match.index}`} style={{ color: "#d4d4d4" }}>{line.slice(lastIndex, match.index)}</span>);
      }
      const token = match[0];
      const isKey = Boolean(match[1]);
      const isString = Boolean(match[2]);
      const isBoolean = Boolean(match[3]);
      const isNumber = !isKey && !isString && !isBoolean && /^-?\d/.test(token);
      const isPunctuation = !isKey && !isString && !isBoolean && !isNumber;
      let color = "#d4d4d4";
      if (isKey) color = "#9cdcfe";
      else if (isString) color = "#ce9178";
      else if (isBoolean) color = "#569cd6";
      else if (isNumber) color = "#b5cea8";
      else if (isPunctuation) color = "#d4d4d4";
      parts.push(<span key={`token-${match.index}`} style={{ color }}>{token}</span>);
      lastIndex = tokenRegex.lastIndex;
    }
    if (lastIndex < line.length) {
      parts.push(<span key={`end-${lastIndex}`} style={{ color: "#d4d4d4" }}>{line.slice(lastIndex)}</span>);
    }
    return parts;
  };

  const activeFocusItem = focusItems[activeFocus];

  return (
    <section id="about" className="relative z-10 py-24">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.35em] text-[#00ffff]/80">
            {personalData.aboutEyebrow || "Engineering Profile"}
          </p>
          <h2 className="font-sans text-4xl font-bold tracking-tight text-white md:text-6xl">
            About <span className="text-[#858585]">Me</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-2">
          {/* PROFILE CARD */}
          <div className="group relative flex h-full">
            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-r from-[#00ffff]/10 to-transparent opacity-20 blur-xl transition-all duration-700 group-hover:opacity-40" />
            <div className="relative flex w-full flex-col items-center justify-between rounded-[2rem] border border-white/[0.08] bg-[#121212]/80 p-6 text-center backdrop-blur-xl transition-all duration-500 hover:border-[#00ffff]/30 hover:shadow-2xl hover:shadow-[#00ffff]/5 md:p-8">
              <div className="flex flex-col items-center">
                <div className="relative mb-4 flex justify-center">
                  <div className="h-32 w-32 shrink-0 aspect-square overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl transition-transform duration-500 group-hover:scale-[1.02] md:h-40 md:w-40 relative">
                    <div className="absolute inset-0 animate-pulse bg-white/10" id="image-skeleton" />
                    <div className="absolute inset-0 z-10 rounded-2xl bg-gradient-to-tr from-[#00ffff]/10 to-transparent mix-blend-overlay pointer-events-none" />
                    <img
                      src={personalData.profile || personalData.heroImage || personalData.heroimage || ""}
                      alt={personalData.name}
                      loading="lazy"
                      decoding="async"
                      onLoad={(e) => {
                        const skeleton = e.currentTarget.previousElementSibling?.previousElementSibling;
                        if (skeleton) skeleton.style.display = 'none';
                      }}
                      className="relative z-20 h-full w-full object-cover object-center grayscale transition-all duration-500 group-hover:grayscale-0"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="mb-1.5 text-xl font-bold tracking-tight text-white md:text-2xl">
                    {personalData.name}
                  </h3>
                  <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#00ffff]">
                    {personalData.designation}
                  </p>
                  {personalData.availabilityLabel && (
                    <div className="mt-3 flex justify-center">
                      <div className="inline-flex items-center gap-2 rounded-full border border-[#00ffff]/20 bg-[#00ffff]/[0.06] px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-white/70">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00ffff] opacity-40" />
                          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#00ffff]" />
                        </span>
                        {personalData.availabilityLabel}
                      </div>
                    </div>
                  )}
                </div>

                <div
                  className="max-w-md text-justify text-xs leading-relaxed text-[#858585] md:text-sm"
                  dangerouslySetInnerHTML={{
                    __html: personalData.description
                  }}
                />
              </div>

              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {personalData.email && (
                  <button
                    type="button"
                    onClick={() => handleCopy(personalData.email, "email")}
                    className="group flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-3.5 py-2 font-mono text-[10px] uppercase tracking-wider text-white/60 transition-all duration-300 hover:border-[#00ffff]/40 hover:bg-[#00ffff]/[0.08] hover:text-white"
                  >
                    {copied === "email" ? (
                      <>
                        <FaCheck className="text-[#00ffff]" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <FaEnvelope className="text-[#858585] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:text-[#00ffff]" />
                        <span>Copy Email</span>
                      </>
                    )}
                  </button>
                )}

                {personalData.phone && (
                  <button
                    type="button"
                    onClick={() => handleCopy(personalData.phone, "phone")}
                    className="group flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-3.5 py-2 font-mono text-[10px] uppercase tracking-wider text-white/60 transition-all duration-300 hover:border-[#00ffff]/40 hover:bg-[#00ffff]/[0.08] hover:text-white"
                  >
                    {copied === "phone" ? (
                      <>
                        <FaCheck className="text-[#00ffff]" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <FaPhone className="text-[#858585] transition-transform duration-300 group-hover:-rotate-12 group-hover:text-[#00ffff]" />
                        <span>Copy Contact</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Mini IDE / Code Playground */}
          <div className="flex h-full flex-col gap-6">
            <div className="overflow-hidden rounded-2xl border border-[#2d2d2d] bg-[#121212] shadow-2xl shadow-black/40">
              <div className="flex items-center justify-between border-b border-[#2d2d2d] bg-[#181818] px-4 py-3">
                <div className="flex items-center gap-2">
                  <FaCircle className="text-[9px] text-[#ff5f56]" />
                  <FaCircle className="text-[9px] text-[#ffbd2e]" />
                  <FaCircle className="text-[9px] text-[#27c93f]" />
                  
                  <div className="ml-4 flex items-center gap-1 rounded-lg bg-[#1e1e1e] p-0.5 border border-[#2d2d2d]">
                    <button
                      type="button"
                      onClick={() => setEditorMode("json")}
                      className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 font-mono text-[10px] transition-all ${
                        editorMode === "json"
                          ? "bg-[#252526] text-[#00ffff] shadow-sm"
                          : "text-[#858585] hover:text-[#d4d4d4]"
                      }`}
                    >
                      <FaCode size={10} />
                      <span>{personalData.developerFileName || "developer.json"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditorMode("ide")}
                      className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 font-mono text-[10px] transition-all ${
                        editorMode === "ide"
                          ? "bg-[#252526] text-[#00ffff] shadow-sm"
                          : "text-[#858585] hover:text-[#d4d4d4]"
                      }`}
                    >
                      <FaTerminal size={10} />
                      <span>playground.js</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {editorMode === "json" && (
                    <button
                      type="button"
                      onClick={() => handleCopy(JSON.stringify(developerData, null, 2), "json")}
                      className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-mono text-[10px] text-[#858585] transition-all duration-200 hover:bg-[#2a2d2e] hover:text-[#d4d4d4]"
                      aria-label="Copy developer profile JSON"
                    >
                      {copied === "json" ? (
                        <>
                          <FaCheck className="text-[#00ffff]" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <FaCopy />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setJsonExpanded((value) => !value)}
                    className="rounded-lg p-1.5 text-[#858585] transition-all duration-200 hover:bg-[#2a2d2e] hover:text-[#d4d4d4]"
                    aria-label={jsonExpanded ? "Collapse developer profile" : "Expand developer profile"}
                  >
                    {jsonExpanded ? <FaChevronUp /> : <FaChevronDown />}
                  </button>
                </div>
              </div>

              <div
                className={`grid transition-all duration-500 ${
                  jsonExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="min-h-0 overflow-hidden bg-[#161616]">
                  {editorMode === "json" ? (
                    <div className="overflow-x-auto px-3 py-5 md:px-4 md:py-6">
                      <pre className="font-mono text-[11px] leading-6 md:text-xs">
                        {jsonLines.map((line, index) => (
                          <div
                            key={index}
                            className="group/line flex min-w-max rounded-sm transition-colors duration-150 hover:bg-[#252526]"
                          >
                            <span className="mr-5 inline-block w-6 select-none text-right text-[#6e7681]">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                            <code>{highlightJsonLine(line)}</code>
                          </div>
                        ))}
                      </pre>
                    </div>
                  ) : (
                    <CodePlayground developerData={developerData} />
                  )}
                </div>
              </div>
            </div>

            {/* ENGINEERING PERSPECTIVE */}
            {focusItems.length > 0 && (
              <div className="rounded-2xl border border-white/[0.08] bg-[#121212]/80 p-5 backdrop-blur-xl md:p-6">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.25em] text-[#00ffff]/80">
                      {personalData.aboutFocusLabel || "Engineering Perspective"}
                    </p>
                    <h3 className="text-lg font-semibold tracking-tight text-white">
                      {activeFocusItem?.title}
                    </h3>
                  </div>
                  <span className="font-mono text-[10px] text-white/30">
                    {String(activeFocus + 1).padStart(2, "0")} / {String(focusItems.length).padStart(2, "0")}
                  </span>
                </div>
                <div className="mb-5 flex flex-wrap gap-2">
                  {focusItems.map((item, index) => (
                    <button
                      key={item.id || index}
                      type="button"
                      onClick={() => setActiveFocus(index)}
                      className={`rounded-xl border px-3 py-2 font-mono text-[10px] uppercase tracking-wider transition-all duration-300 ${
                        activeFocus === index
                          ? "border-[#00ffff]/40 bg-[#00ffff]/[0.1] text-[#00ffff] shadow-sm shadow-[#00ffff]/10"
                          : "border-white/10 bg-white/[0.02] text-white/40 hover:border-white/20 hover:text-white/70"
                      }`}
                    >
                      {item.label || item.title}
                    </button>
                  ))}
                </div>
                <p className="text-sm leading-7 text-[#858585]">
                  {activeFocusItem?.description}
                </p>
              </div>
            )}

            {/* SUPPORT */}
            {personalData.chaiBoxTitle && (
              <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-white/[0.08] bg-[#121212]/80 p-5 text-center backdrop-blur-xl sm:flex-row sm:text-left">
                <div>
                  <h3 className="mb-1 text-sm font-semibold text-white">
                    {personalData.chaiBoxTitle}
                  </h3>
                  <p className="max-w-md text-xs leading-relaxed text-[#858585]">
                    {personalData.chaiBoxDescription}
                  </p>
                </div>
                {personalData.phone && (
                  <button
                    type="button"
                    onClick={() => handleCopy(personalData.phone, "easypaisa")}
                    className={`flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2.5 font-mono text-[10px] uppercase tracking-wider transition-all duration-300 ${
                      copied === "easypaisa"
                        ? "border-[#00ffff]/40 bg-[#00ffff]/[0.1] text-[#00ffff]"
                        : "border-white/10 bg-white/[0.03] text-white/60 hover:border-[#00ffff]/30 hover:bg-[#00ffff]/[0.08] hover:text-white"
                    }`}
                  >
                    {copied === "easypaisa" ? (
                      <>
                        <FaCheck />
                        <span>Number Copied</span>
                      </>
                    ) : (
                      <>
                        <span>☕</span>
                        <span>Support</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
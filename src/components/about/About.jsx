import React, { useMemo, useState } from "react";
import {
  FaCircle,
  FaCopy,
  FaCheck,
  FaChevronDown,
  FaChevronUp,
  FaEnvelope,
  FaPhone
} from "react-icons/fa6";

const About = ({ personalData }) => {
  const [copied, setCopied] = useState("");
  const [jsonExpanded, setJsonExpanded] = useState(true);
  const [activeFocus, setActiveFocus] = useState(0);

  const focusItems = personalData.aboutFocus || [];

  const developerData = useMemo(
    () => ({
      name: personalData.name,
      role: personalData.designation,
      email: personalData.email,
      status: personalData.availabilityLabel,
      interests: personalData.interests || []
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

  const activeFocusItem = focusItems[activeFocus];

  const highlightJsonLine = (line) => {
    const tokenRegex =
      /("(?:\\.|[^"\\])*")(?=\s*:)|("(?:\\.|[^"\\])*")|\b(true|false|null)\b|-?\d+(?:\.\d+)?|[{}[\],:]/g;

    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = tokenRegex.exec(line)) !== null) {
      if (match.index > lastIndex) {
        parts.push(
          <span key={`text-${match.index}`}>
            {line.slice(lastIndex, match.index)}
          </span>
        );
      }

      const token = match[0];
      const isKey = Boolean(match[1]);
      const isString = Boolean(match[2]);
      const isBoolean = Boolean(match[3]);
      const isNumber = !isKey && !isString && !isBoolean && /^-?\d/.test(token);
      const isPunctuation = !isKey && !isString && !isBoolean && !isNumber;

      let className = "text-[#d4d4d4]";

      if (isKey) {
        className = "text-[#9cdcfe]";
      } else if (isString) {
        className = "text-[#ce9178]";
      } else if (isBoolean) {
        className = "text-[#569cd6]";
      } else if (isNumber) {
        className = "text-[#b5cea8]";
      } else if (isPunctuation) {
        className = "text-[#d4d4d4]";
      }

      parts.push(
        <span key={`token-${match.index}`} className={className}>
          {token}
        </span>
      );

      lastIndex = tokenRegex.lastIndex;
    }

    if (lastIndex < line.length) {
      parts.push(
        <span key={`end-${lastIndex}`}>
          {line.slice(lastIndex)}
        </span>
      );
    }

    return parts;
  };

  return (
    <section id="about" className="relative z-10 py-24">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.35em] text-primary/80">
            {personalData.aboutEyebrow || "Engineering Profile"}
          </p>

          <h2 className="font-sans text-4xl font-bold tracking-tight text-white md:text-6xl">
            About <span className="text-text-muted">Me</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-2">
          {/* PROFILE */}
          <div className="group relative flex h-full">
            <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-r from-primary/20 to-purple-500/20 opacity-25 blur-2xl transition-all duration-700 group-hover:opacity-50 group-hover:blur-3xl" />

            <div className="relative flex w-full flex-col items-center justify-center rounded-[2.5rem] border border-white/[0.08] bg-white/[0.03] p-8 text-center backdrop-blur-xl transition-all duration-500 hover:border-white/[0.14] hover:shadow-2xl hover:shadow-primary/10 md:p-12">
              {/* Profile Image */}
              <div className="relative mb-6">
                <div className="h-32 w-32 overflow-hidden rounded-full border border-white/10 bg-white/5 shadow-2xl transition-transform duration-500 group-hover:scale-[1.03] md:h-40 md:w-40">
                  <div className="absolute inset-0 z-10 rounded-full bg-gradient-to-tr from-primary/10 to-purple-500/10 mix-blend-overlay" />

                  <img
                    src={personalData.profile}
                    alt={personalData.name}
                    className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
                  />
                </div>
              </div>

              {/* Identity */}
              <div className="mb-6">
                <h3 className="mb-2 text-2xl font-bold tracking-tight text-white">
                  {personalData.name}
                </h3>

                <p className="font-mono text-xs uppercase tracking-[0.16em] text-primary md:text-sm">
                  {personalData.designation}
                </p>

                {/* Professional Status */}
                {personalData.availabilityLabel && (
                  <div className="mt-4 flex justify-center">
                    <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/[0.06] px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-white/60">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-30" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
                      </span>

                      {personalData.availabilityLabel}
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div
                className="max-w-lg text-justify text-sm leading-7 text-text-muted md:text-base"
                dangerouslySetInnerHTML={{
                  __html: personalData.description
                }}
              />

              {/* Contact Actions */}
              <div className="mt-8 flex flex-wrap justify-center gap-2">
                {personalData.email && (
                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(personalData.email, "email")
                    }
                    className="group flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-white/50 transition-all duration-300 hover:border-primary/25 hover:bg-primary/[0.07] hover:text-white"
                  >
                    {copied === "email" ? (
                      <>
                        <FaCheck className="text-primary" />
                        Copied
                      </>
                    ) : (
                      <>
                        <FaEnvelope className="transition-transform duration-300 group-hover:-translate-y-0.5" />
                        Copy Email
                      </>
                    )}
                  </button>
                )}

                {personalData.phone && (
                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(personalData.phone, "phone")
                    }
                    className="group flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-white/50 transition-all duration-300 hover:border-primary/25 hover:bg-primary/[0.07] hover:text-white"
                  >
                    {copied === "phone" ? (
                      <>
                        <FaCheck className="text-primary" />
                        Copied
                      </>
                    ) : (
                      <>
                        <FaPhone className="transition-transform duration-300 group-hover:-rotate-12" />
                        Copy Contact
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex h-full flex-col gap-6">
            {/* DEVELOPER JSON */}
            <div className="group overflow-hidden rounded-2xl border border-[#2d2d2d] bg-[#1e1e1e] shadow-2xl shadow-black/30">
              {/* Editor Header */}
              <div className="flex items-center justify-between border-b border-[#2d2d2d] bg-[#181818] px-4 py-3">
                <div className="flex items-center gap-2">
                  <FaCircle className="text-[9px] text-[#ff5f56]" />
                  <FaCircle className="text-[9px] text-[#ffbd2e]" />
                  <FaCircle className="text-[9px] text-[#27c93f]" />
                </div>

                <div className="flex items-center gap-2">
                  <span className="hidden font-mono text-[10px] text-[#858585] sm:block">
                    {personalData.developerFileName || "developer.json"}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(
                        JSON.stringify(developerData, null, 2),
                        "json"
                      )
                    }
                    className="flex items-center gap-1.5 rounded-md px-2 py-1 font-mono text-[10px] text-[#858585] transition-all duration-200 hover:bg-[#2a2d2e] hover:text-[#d4d4d4]"
                    aria-label="Copy developer profile JSON"
                  >
                    {copied === "json" ? (
                      <>
                        <FaCheck className="text-[#4ec9b0]" />
                        Copied
                      </>
                    ) : (
                      <>
                        <FaCopy />
                        Copy
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setJsonExpanded((value) => !value)
                    }
                    className="rounded-md p-1.5 text-[#858585] transition-all duration-200 hover:bg-[#2a2d2e] hover:text-[#d4d4d4]"
                    aria-label={
                      jsonExpanded
                        ? "Collapse developer profile"
                        : "Expand developer profile"
                    }
                  >
                    {jsonExpanded ? (
                      <FaChevronUp />
                    ) : (
                      <FaChevronDown />
                    )}
                  </button>
                </div>
              </div>

              {/* Editor */}
              <div
                className={`grid transition-all duration-500 ${
                  jsonExpanded
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="min-h-0 overflow-hidden">
                  <div className="overflow-x-auto px-3 py-5 md:px-4 md:py-6">
                    <pre className="font-mono text-[11px] leading-6 md:text-xs">
                      {jsonLines.map((line, index) => (
                        <div
                          key={index}
                          className="group/line flex min-w-max rounded-sm transition-colors duration-150 hover:bg-[#2a2d2e]"
                        >
                          <span className="mr-5 inline-block w-6 select-none text-right text-[#4d4d4d]">
                            {String(index + 1).padStart(2, "0")}
                          </span>

                          <code className="whitespace-pre">
                            {highlightJsonLine(line)}
                          </code>
                        </div>
                      ))}
                    </pre>
                  </div>
                </div>
              </div>
            </div>

            {/* ENGINEERING PERSPECTIVE */}
            {focusItems.length > 0 && (
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 backdrop-blur-xl md:p-6">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.25em] text-primary/70">
                      {personalData.aboutFocusLabel ||
                        "Engineering Perspective"}
                    </p>

                    <h3 className="text-lg font-semibold tracking-tight text-white">
                      {activeFocusItem?.title}
                    </h3>
                  </div>

                  <span className="font-mono text-[10px] text-white/20">
                    {String(activeFocus + 1).padStart(2, "0")} /{" "}
                    {String(focusItems.length).padStart(2, "0")}
                  </span>
                </div>

                <div className="mb-5 flex flex-wrap gap-2">
                  {focusItems.map((item, index) => (
                    <button
                      key={item.id || index}
                      type="button"
                      onClick={() => setActiveFocus(index)}
                      className={`rounded-lg border px-3 py-2 font-mono text-[10px] uppercase tracking-wider transition-all duration-300 ${
                        activeFocus === index
                          ? "border-primary/30 bg-primary/[0.08] text-primary shadow-sm shadow-primary/10"
                          : "border-white/10 bg-white/[0.02] text-white/35 hover:border-white/20 hover:text-white/70"
                      }`}
                    >
                      {item.label || item.title}
                    </button>
                  ))}
                </div>

                <p className="text-sm leading-7 text-text-muted">
                  {activeFocusItem?.description}
                </p>
              </div>
            )}

            {/* SUPPORT */}
            {personalData.chaiBoxTitle && (
              <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 text-center backdrop-blur-xl sm:flex-row sm:text-left">
                <div>
                  <h3 className="mb-1 text-sm font-semibold text-white">
                    {personalData.chaiBoxTitle}
                  </h3>

                  <p className="max-w-md text-xs leading-relaxed text-text-muted">
                    {personalData.chaiBoxDescription}
                  </p>
                </div>

                {personalData.phone && (
                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(personalData.phone, "easypaisa")
                    }
                    className={`flex shrink-0 items-center gap-2 rounded-lg border px-4 py-2.5 font-mono text-[10px] uppercase tracking-wider transition-all duration-300 ${
                      copied === "easypaisa"
                        ? "border-primary/40 bg-primary/[0.08] text-primary"
                        : "border-white/10 bg-white/[0.04] text-white/50 hover:border-primary/25 hover:bg-primary/[0.07] hover:text-white"
                    }`}
                  >
                    {copied === "easypaisa" ? (
                      <>
                        <FaCheck />
                        Number Copied
                      </>
                    ) : (
                      <>
                        <span>☕</span>
                        Support
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
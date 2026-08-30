
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Sparkles,
  Send,
  X,
  RotateCcw,
  User,
  Bot,
  ChevronRight,
  Copy,
  Check,
  Code2,
  Zap
} from 'lucide-react';
import { useAIChat } from '../../hooks/useAIChat';

const QUICK_PROMPTS = [
  {
    emoji: '🚀',
    label: 'Projects',
    desc: 'Best portfolio work and system design approach',
    prompt:
      "Tell me about Haider's strongest portfolio projects and how he approaches system design.",
  },

  {
    emoji: '💼',
    label: 'Career',
    desc: 'Professional journey and engineering leadership',
    prompt:
      "Summarize Haider's professional journey and the kind of engineering work he leads.",
  },
  {
    emoji: '📬',
    label: 'Hire',
    desc: 'Reach out for consulting or full-stack projects',
    prompt:
      "How can I reach Haider for architecture, product, or full-stack consulting opportunities?",
  },
  {
    emoji: '✉️',
    label: 'Draft Email',
    desc: 'Get a polished outreach email written for you',
    prompt:
      'Draft a polished email to Haider about a collaboration, hiring opportunity, or project inquiry.',
  },
];

const DYNAMIC_PHRASES = [
  'Ask about architecture',
  'Review projects',
  'Explore the stack',
  'Draft a message',
  'Talk performance',
  'Discuss consulting',
];

/**
 * Format markdown, links, code blocks, and strip raw HTML safely into styled React elements.
 */
function FormattedMessageContent({ text }) {
  if (!text) return null;

  const sanitizedText = text
    .replace(/---not-break---/g, '\n\n')
    .replace(/<\/?(b|strong)>/gi, '**')
    .replace(/<\/?(i|em)>/gi, '*')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/?p>/gi, '\n');

  const parts = sanitizedText.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-1.5 leading-relaxed break-words text-[12px]">
      {parts.map((part, index) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          const lines = part.slice(3, -3).trim().split('\n');
          const firstLine = lines[0].trim();
          const hasLang = /^[a-zA-Z0-9_-]+$/.test(firstLine);
          const lang = hasLang ? firstLine : '';
          const code = (hasLang ? lines.slice(1) : lines).join('\n');

          return (
            <div
              key={index}
              className="my-1.5 overflow-hidden rounded-md border border-white/10 bg-[#06070a]"
            >
              {lang && (
                <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.02] px-2 py-0.5 text-[9px] text-cyan-400 font-mono">
                  <span>{lang}</span>
                  <Code2 size={10} className="opacity-60" />
                </div>
              )}

              <pre className="p-2 overflow-x-auto text-[10px] font-mono text-cyan-200/90 leading-tight">
                <code>{code}</code>
              </pre>
            </div>
          );
        }

        const lines = part.split('\n');

        return (
          <React.Fragment key={index}>
            {lines.map((line, lIdx) => {
              if (!line.trim()) {
                return <div key={lIdx} className="h-1" />;
              }

              const headingMatch = line.match(/^(#{1,4})\s+(.+)$/);

              if (headingMatch) {
                return (
                  <h4
                    key={lIdx}
                    className="font-bold text-cyan-300 text-xs mt-2 mb-0.5"
                  >
                    {headingMatch[2]}
                  </h4>
                );
              }

              const isBullet = /^[•\-\*]\s+/.test(line.trim());
              const cleanLine = isBullet
                ? line.trim().replace(/^[•\-\*]\s+/, '')
                : line;

              const segments = cleanLine
                .split(
                  /(\[.*?\]\(https?:\/\/.*?\)|\*\*.*?\*\*|`.*?`)/
                )
                .map((segment, sIdx) => {
                  const linkMatch = segment.match(
                    /^\[(.*?)\]\((https?:\/\/.*?)\)$/
                  );

                  if (linkMatch) {
                    return (
                      <a
                        key={sIdx}
                        href={linkMatch[2]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 font-medium transition-colors"
                      >
                        {linkMatch[1]}
                      </a>
                    );
                  }

                  if (
                    segment.startsWith('**') &&
                    segment.endsWith('**') &&
                    segment.length >= 4
                  ) {
                    return (
                      <strong
                        key={sIdx}
                        className="font-semibold text-cyan-300"
                      >
                        {segment.slice(2, -2)}
                      </strong>
                    );
                  }

                  if (
                    segment.startsWith('`') &&
                    segment.endsWith('`') &&
                    segment.length >= 2
                  ) {
                    return (
                      <code
                        key={sIdx}
                        className="rounded bg-white/5 px-1 py-0.5 font-mono text-[10px] text-cyan-300 border border-white/10"
                      >
                        {segment.slice(1, -1)}
                      </code>
                    );
                  }

                  return segment;
                });

              if (isBullet) {
                return (
                  <div
                    key={lIdx}
                    className="flex items-start gap-1.5 pl-0.5 text-gray-200"
                  >
                    <span className="text-cyan-400 mt-1 text-[9px] leading-none">
                      •
                    </span>
                    <span className="flex-1">{segments}</span>
                  </div>
                );
              }

              return (
                <p key={lIdx} className="text-gray-200">
                  {segments}
                </p>
              );
            })}
          </React.Fragment>
        );
      })}
    </div>
  );
}

/**
 * Pure presentation layer for the AI Chat Drawer & Floating Trigger.
 */
export default function AIChatWidget() {
  const {
    messages,
    loading,
    error,
    isOpen,
    hasUnread,
    usage,
    sendMessage,
    toggleOpen,
    closeChat,
    clearChat,
  } = useAIChat();

  const [input, setInput] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [viewportHeight, setViewportHeight] = useState('100dvh');
  const [dynamicPhraseIndex, setDynamicPhraseIndex] = useState(0);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setDynamicPhraseIndex(
        (prev) => (prev + 1) % DYNAMIC_PHRASES.length
      );
    }, 2600);

    return () => clearInterval(interval);
  }, []);

  // Dynamic visualViewport tracker for mobile software keyboards
  useEffect(() => {
    if (!isOpen) return;

    const handleViewportChange = () => {
      if (window.visualViewport) {
        setViewportHeight(`${window.visualViewport.height}px`);
      } else {
        setViewportHeight(`${window.innerHeight}px`);
      }

      messagesEndRef.current?.scrollIntoView({
        behavior: 'smooth',
      });
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener(
        'resize',
        handleViewportChange
      );

      window.visualViewport.addEventListener(
        'scroll',
        handleViewportChange
      );

      handleViewportChange();
    } else {
      window.addEventListener('resize', handleViewportChange);
    }

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener(
          'resize',
          handleViewportChange
        );

        window.visualViewport.removeEventListener(
          'scroll',
          handleViewportChange
        );
      } else {
        window.removeEventListener(
          'resize',
          handleViewportChange
        );
      }
    };
  }, [isOpen]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({
        behavior: 'smooth',
      });
    }
  }, [messages, loading, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !usage?.isLimitReached) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, usage?.isLimitReached]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const content = input.trim();

    if (!content || loading || usage?.isLimitReached) return;

    sendMessage(content);
    setInput('');
  };

  // Enter → send
  // Shift + Enter → newline
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!loading && input.trim() && !usage?.isLimitReached) {
        handleSubmit(e);
      }
    }
  };

  const handleQuickPrompt = (prompt) => {
    if (loading || usage?.isLimitReached) return;

    sendMessage(prompt);
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);

    setCopiedId(id);

    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleInputFocus = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior: 'smooth',
      });
    }, 150);
  };

  return (
    <>
      {/* ─── FLOATING TRIGGER BUTTON & SUBTLE INVITATION BANNER ─────────────────── */}
      <div className="fixed bottom-24 right-4 sm:bottom-6 sm:right-6 z-[999] flex items-center justify-end font-sans">
        <AnimatePresence>
          {!isOpen && !bannerDismissed && (
            <motion.div
              initial={{
                opacity: 0,
                x: 12,
                scale: 0.94,
              }}
              animate={{
                opacity: 1,
                x: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                x: 8,
                scale: 0.94,
              }}
              transition={{
                delay: 0.8,
                duration: 0.25,
              }}
              className="mr-2 sm:mr-2.5 flex items-center gap-1.5 sm:gap-2 rounded-full border border-white/10 bg-[#0c0e16]/95 py-1 sm:py-1.5 pl-2.5 sm:pl-3 pr-1.5 sm:pr-2 shadow-lg shadow-black/60 backdrop-blur-md cursor-pointer group hover:border-cyan-500/30 transition-all max-w-[calc(100vw-85px)] shrink-0"
              onClick={toggleOpen}
            >
              <Sparkles
                size={12}
                className="text-cyan-400 opacity-80 shrink-0"
              />

              <span className="text-[11px] sm:text-[11.5px] font-medium text-gray-300 group-hover:text-white whitespace-nowrap">
                {DYNAMIC_PHRASES[dynamicPhraseIndex]}
              </span>

              <button
                type="button"
                aria-label="Dismiss banner"
                onClick={(e) => {
                  e.stopPropagation();
                  setBannerDismissed(true);
                }}
                className="ml-0.5 rounded-full p-0.5 text-gray-500 hover:bg-white/10 hover:text-gray-300 shrink-0"
              >
                <X size={11} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Brain Icon Trigger */}
        <motion.button
          type="button"
          onClick={toggleOpen}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className={`relative flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl border shadow-lg transition-all duration-200 ${
            isOpen
              ? 'border-cyan-500/40 bg-[#0f1422] text-cyan-300 shadow-cyan-950/40'
              : 'border-white/10 bg-[#0b0d14] text-cyan-400 shadow-black/70 hover:border-cyan-500/30 hover:bg-[#0f131f]'
          }`}
          aria-label={
            isOpen ? 'Close AI chat' : 'Open AI chat'
          }
        >
          <div className="relative flex items-center justify-center">
            {isOpen ? (
              <X
                size={18}
                className="transition-transform duration-150 rotate-90"
              />
            ) : (
              <Brain
                size={19}
                className="transition-transform duration-200 text-cyan-400"
              />
            )}
          </div>

          {hasUnread && !isOpen && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-60" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-cyan-500 border border-[#0b0d14]" />
            </span>
          )}
        </motion.button>
      </div>

      {/* ─── CHAT DRAWER / POP-UP WIDGET ─────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeChat}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998] md:hidden"
            />

            <motion.aside
              initial={{
                opacity: 0,
                y: 30,
                scale: 0.98,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: 30,
                scale: 0.98,
              }}
              transition={{
                type: 'spring',
                damping: 28,
                stiffness: 340,
              }}
              style={{
                height: viewportHeight,
                maxHeight: viewportHeight,
              }}
              className="fixed inset-x-0 bottom-0 top-auto z-[9999] flex flex-col w-full h-[85dvh] max-h-[90dvh] rounded-t-2xl border-t border-x border-white/15 bg-[#090b12] shadow-2xl md:inset-auto md:bottom-20 md:right-6 md:w-[380px] md:!h-[500px] md:!max-h-[calc(100vh-6.5rem)] md:rounded-2xl md:border md:border-white/10 md:bg-[#0a0c13]/98 md:shadow-black/90 md:backdrop-blur-xl overflow-hidden font-sans"
              aria-label="AI Assistant Interface"
            >
              {/* Header */}
              <div className="flex flex-col border-b border-white/10 bg-[#0c0e17]/95 px-4 pt-2.5 pb-0 md:pt-2 backdrop-blur-md shrink-0">
                <div className="mx-auto mb-2 h-1 w-10 rounded-full bg-white/20 md:hidden" />

                <div className="flex items-center justify-between pb-2.5 md:pb-2">
                  <div className="flex items-center gap-2.5 md:gap-2">
                    <div className="relative flex h-8 w-8 md:h-6 md:w-6 items-center justify-center rounded-lg md:rounded-md border border-white/10 bg-[#0e121d] text-cyan-400">
                      <Brain
                        size={16}
                        className="md:w-3.5 md:h-3.5"
                      />

                      <span
                        className={`absolute -bottom-0.5 -right-0.5 h-2 w-2 md:h-1.5 md:w-1.5 rounded-full ${
                          usage?.isLimitReached
                            ? 'bg-red-400'
                            : usage?.isWarning
                            ? 'bg-amber-400 animate-pulse'
                            : 'bg-emerald-400'
                        }`}
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-xs md:text-[11.5px] font-semibold tracking-wide text-white">
                          Ego Copilot
                        </h3>

                        {usage?.isLimitReached ? (
                          <span className="rounded bg-red-500/10 px-1.5 py-0.5 text-[9px] font-mono text-red-400 border border-red-500/20">
                            Limit Reached
                          </span>
                        ) : usage?.isWarning ? (
                          <span
                            className="rounded bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-mono text-amber-300 border border-amber-500/20 animate-pulse"
                            title={`${usage.currentTokens}/${usage.maxTokens} tokens`}
                          >
                            ⚡ ~{usage.percentage}%
                          </span>
                        ) : (
                          <span className="rounded bg-white/5 px-1.5 py-0.5 text-[9px] font-mono text-cyan-400 border border-white/10">
                            Live
                          </span>
                        )}
                      </div>

                      <p className="text-[10px] md:text-[9px] text-gray-400 leading-none">
                        Architecture & Portfolio AI
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-0.5">
                    <button
                      type="button"
                      onClick={clearChat}
                      title="Reset conversation"
                      className="rounded-lg p-2 md:p-1.5 text-gray-500 transition-colors hover:bg-white/8 hover:text-gray-300"
                    >
                      <RotateCcw
                        size={14}
                        className="md:w-3 md:h-3"
                      />
                    </button>

                    <button
                      type="button"
                      onClick={closeChat}
                      title="Close"
                      className="rounded-lg p-2 md:p-1.5 text-gray-500 transition-colors hover:bg-white/8 hover:text-gray-300"
                    >
                      <X
                        size={16}
                        className="md:w-3.5 md:h-3.5"
                      />
                    </button>
                  </div>
                </div>

                {/* Exactly 5 quick prompts — horizontally scrollable */}
                <div
                  className="flex w-full min-w-0 items-center gap-1 pb-2 overflow-x-auto overflow-y-hidden scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none]"
                  style={{
                    WebkitOverflowScrolling: 'touch',
                  }}
                >
                  <Zap
                    size={9}
                    className="text-cyan-500/50 shrink-0 mr-0.5"
                  />

                  {QUICK_PROMPTS.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() =>
                        handleQuickPrompt(item.prompt)
                      }
                      title={item.desc}
                      disabled={
                        loading || usage?.isLimitReached
                      }
                      className="flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md border border-white/[0.08] bg-white/[0.02] px-2 py-1 text-[10px] font-medium text-gray-400 hover:border-cyan-500/30 hover:bg-cyan-500/[0.07] hover:text-white transition-all disabled:opacity-35 disabled:cursor-not-allowed"
                    >
                      <span className="text-[11px] leading-none shrink-0">
                        {item.emoji}
                      </span>

                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Messages */}
              <div
                className="flex-1 overflow-y-auto px-4 py-3 md:px-3 md:py-2.5 space-y-3 md:space-y-2 overscroll-contain scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
                style={{
                  overscrollBehavior: 'contain',
                  touchAction: 'pan-y',
                }}
                onWheel={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
              >
                {messages.map((msg) => {
                  const isUser = msg.role === 'user';

                  return (
                    <motion.div
                      key={msg.id}
                      initial={{
                        opacity: 0,
                        y: 4,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        duration: 0.15,
                      }}
                      className={`flex items-end gap-2 md:gap-1.5 group ${
                        isUser
                          ? 'justify-end'
                          : 'justify-start'
                      }`}
                    >
                      {!isUser && (
                        <div className="flex h-6 w-6 md:h-5 md:w-5 shrink-0 items-center justify-center rounded-md md:rounded border border-white/10 bg-[#0e121d] text-cyan-400">
                          <Bot
                            size={13}
                            className="md:w-2.5 md:h-2.5"
                          />
                        </div>
                      )}

                      <div
                        className={`flex min-w-0 max-w-[85%] md:max-w-[88%] flex-col ${
                          isUser
                            ? 'items-end'
                            : 'items-start'
                        }`}
                      >
                        <div
                          className={`relative rounded-2xl px-3.5 py-2.5 md:px-2.5 md:py-1.5 shadow-sm ${
                            isUser
                              ? 'bg-[#0891b2] text-white rounded-br-sm'
                              : 'bg-[#131722] text-gray-100 rounded-bl-sm'
                          }`}
                        >
                          <FormattedMessageContent
                            text={msg.content}
                          />
                        </div>

                        {!isUser && msg.content && (
                          <button
                            type="button"
                            onClick={() =>
                              handleCopy(msg.id, msg.content)
                            }
                            className="mt-1 flex items-center gap-1 rounded px-1 py-0.5 text-[9px] text-gray-500 opacity-0 transition-all group-hover:opacity-100 hover:bg-white/5 hover:text-cyan-300"
                            title="Copy text"
                          >
                            {copiedId === msg.id ? (
                              <>
                                <Check
                                  size={10}
                                  className="text-emerald-400"
                                />
                                <span>Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy size={10} />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>

                      {isUser && (
                        <div className="flex h-6 w-6 md:h-5 md:w-5 shrink-0 items-center justify-center rounded-md md:rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                          <User
                            size={13}
                            className="md:w-2.5 md:h-2.5"
                          />
                        </div>
                      )}
                    </motion.div>
                  );
                })}

                {/* Clean loading dots */}
                {loading && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 3,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    className="flex items-end gap-2 md:gap-1.5"
                  >
                    <div className="flex h-6 w-6 md:h-5 md:w-5 shrink-0 items-center justify-center rounded-md md:rounded border border-white/10 bg-[#0e121d] text-cyan-400">
                      <Bot
                        size={13}
                        className="md:w-2.5 md:h-2.5"
                      />
                    </div>

                    <div className="rounded-2xl rounded-bl-sm bg-[#131722] px-3.5 py-2.5 md:px-2.5 md:py-1.5 flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:-0.3s]" />
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:-0.15s]" />
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-bounce" />
                    </div>
                  </motion.div>
                )}

                {/* Token Limit */}
                {usage?.isLimitReached && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 6,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    className="rounded-xl md:rounded-lg border border-amber-500/30 bg-amber-950/20 p-3 md:p-2.5 text-xs md:text-[11px] text-amber-200 space-y-1.5"
                  >
                    <div className="flex items-center justify-between font-semibold text-amber-300">
                      <span>
                        ⚡ Session Capacity Reached
                      </span>

                      <button
                        type="button"
                        onClick={clearChat}
                        className="rounded bg-amber-500/20 px-2.5 py-1 md:px-2 md:py-0.5 text-xs md:text-[10px] text-amber-200 hover:bg-amber-500/30 transition-colors"
                      >
                        Reset Session
                      </button>
                    </div>

                    <p className="text-[11px] md:text-[10px] text-amber-200/80 leading-normal">
                      To conserve API bandwidth, further
                      queries are paused. Explore Haider's
                      portfolio sections directly or click reset
                      to start fresh!
                    </p>
                  </motion.div>
                )}

                {/* Quick inquiries */}
                {messages.length <= 2 &&
                  !loading &&
                  !usage?.isLimitReached && (
                    <div className="pt-1 md:pt-0.5">
                      <p className="text-[10.5px] md:text-[9.5px] font-medium text-gray-400 mb-1.5 md:mb-1 px-0.5">
                        Quick inquiries:
                      </p>

                      <div className="flex flex-col gap-1.5 md:gap-0.5">
                        {QUICK_PROMPTS.map((item, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() =>
                              handleQuickPrompt(item.prompt)
                            }
                            className="flex items-center justify-between text-left rounded-lg md:rounded border border-white/5 bg-white/[0.02] px-3 py-2 md:px-2 md:py-1 text-xs md:text-[11px] text-gray-300 hover:border-cyan-500/30 hover:bg-white/[0.05] hover:text-white transition-all group"
                          >
                            <span>{item.label}</span>

                            <ChevronRight
                              size={13}
                              className="md:w-2.5 md:h-2.5 text-cyan-400 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                <div ref={messagesEndRef} />
              </div>

              {/* Error */}
              {error && (
                <div className="border-t border-red-500/20 bg-red-950/30 px-3 py-1.5 md:px-2.5 md:py-1 text-xs md:text-[10px] text-red-300 flex items-center justify-between shrink-0">
                  <span>{error}</span>

                  <button
                    type="button"
                    onClick={() =>
                      handleQuickPrompt(
                        input || 'Retry request'
                      )
                    }
                    className="underline hover:text-white font-medium"
                  >
                    Retry
                  </button>
                </div>
              )}

              {/* Input */}
              <form
                onSubmit={handleSubmit}
                className="border-t border-white/10 bg-[#07080d] p-3 pb-[max(0.85rem,env(safe-area-inset-bottom))] md:p-2 md:pb-2 flex items-center gap-2 md:gap-1.5 shrink-0"
              >
                <textarea
                  ref={inputRef}
                  value={input}
                  onFocus={handleInputFocus}
                  onChange={(e) =>
                    setInput(e.target.value)
                  }
                  onKeyDown={handleKeyDown}
                  rows={1}
                  placeholder={
                    usage?.isLimitReached
                      ? 'Session limit reached (click Reset)...'
                      : 'Ask about .NET, architecture, projects...'
                  }
                  disabled={
                    loading || usage?.isLimitReached
                  }
                  className="flex-1 rounded-xl md:rounded-md border border-white/10 bg-white/[0.03] px-3.5 py-2.5 md:px-2.5 md:py-1.5 text-sm md:text-xs text-white placeholder-gray-500 outline-none focus:border-cyan-500/40 focus:bg-white/[0.05] transition-all disabled:opacity-50 disabled:cursor-not-allowed resize-none"
                />

                <button
                  type="submit"
                  disabled={
                    loading ||
                    !input.trim() ||
                    usage?.isLimitReached
                  }
                  className="flex h-10 w-10 md:h-7 md:w-7 items-center justify-center rounded-xl md:rounded-md bg-cyan-600 text-white shadow-sm transition-all hover:bg-cyan-500 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
                  aria-label="Send query"
                >
                  <Send
                    size={15}
                    className="md:w-3 md:h-3"
                  />
                </button>
              </form>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

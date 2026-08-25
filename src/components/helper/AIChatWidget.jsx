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
  Code2
} from 'lucide-react';
import { useAIChat } from '../../hooks/useAIChat';

const QUICK_PROMPTS = [
  { label: '🚀 Top Projects', prompt: 'Tell me about Haider\'s top featured projects and his architectural approach.' },
  { label: '🛠️ .NET & Tech Stack', prompt: 'What are Haider\'s core competencies across .NET, React, and backend architecture?' },
  { label: '💼 Career Background', prompt: 'What is Haider\'s professional work history and engineering experience?' },
  { label: '📬 Contact & Hire', prompt: 'How can I get in touch with Haider regarding architecture or full-stack roles?' },
];

/**
 * Format markdown, links, code blocks, and strip raw HTML safely into styled React elements.
 */
function FormattedMessageContent({ text }) {
  if (!text) return null;

  // 1. Clean up custom markers like ---not-break--- and normalize raw HTML tags
  const sanitizedText = text
    .replace(/---not-break---/g, '\n\n')
    .replace(/<\/?(b|strong)>/gi, '**')
    .replace(/<\/?(i|em)>/gi, '*')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/?p>/gi, '\n');

  // 2. Split by fenced code blocks (```lang ... ```)
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
            <div key={index} className="my-1.5 overflow-hidden rounded-md border border-white/10 bg-[#06070a]">
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

        // Split regular text into lines
        const lines = part.split('\n');
        return (
          <React.Fragment key={index}>
            {lines.map((line, lIdx) => {
              if (!line.trim()) return <div key={lIdx} className="h-1" />;

              // Handle Markdown Headings (e.g., ### 🛠️ Title)
              const headingMatch = line.match(/^(#{1,4})\s+(.+)$/);
              if (headingMatch) {
                return (
                  <h4 key={lIdx} className="font-bold text-cyan-300 text-xs mt-2 mb-0.5">
                    {headingMatch[2]}
                  </h4>
                );
              }

              const isBullet = /^[•\-\*]\s+/.test(line.trim());
              const cleanLine = isBullet ? line.trim().replace(/^[•\-\*]\s+/, '') : line;

              // Parse links [label](url), bold **text**, and inline code `code`
              const segments = cleanLine.split(/(\[.*?\]\(https?:\/\/.*?\)|\*\*.*?\*\*|`.*?`)/g).map((segment, sIdx) => {
                // Link match: [Label](url)
                const linkMatch = segment.match(/^\[(.*?)\]\((https?:\/\/.*?)\)$/);
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
                // Bold match: **text**
                if (segment.startsWith('**') && segment.endsWith('**') && segment.length >= 4) {
                  return <strong key={sIdx} className="font-semibold text-cyan-300">{segment.slice(2, -2)}</strong>;
                }
                // Inline code: `code`
                if (segment.startsWith('`') && segment.endsWith('`') && segment.length >= 2) {
                  return (
                    <code key={sIdx} className="rounded bg-white/5 px-1 py-0.5 font-mono text-[10px] text-cyan-300 border border-white/10">
                      {segment.slice(1, -1)}
                    </code>
                  );
                }
                return segment;
              });

              if (isBullet) {
                return (
                  <div key={lIdx} className="flex items-start gap-1.5 pl-0.5 text-gray-200">
                    <span className="text-cyan-400 mt-1 text-[9px] leading-none">•</span>
                    <span className="flex-1">{segments}</span>
                  </div>
                );
              }

              return <p key={lIdx} className="text-gray-200">{segments}</p>;
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
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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

  const handleQuickPrompt = (prompt) => {
    if (loading || usage?.isLimitReached) return;
    sendMessage(prompt);
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <>
      {/* ─── FLOATING TRIGGER BUTTON & SUBTLE INVITATION BANNER ─────────────────── */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[999] flex items-center justify-end font-sans">
        {/* Subtle Invitation Banner */}
        <AnimatePresence>
          {!isOpen && !bannerDismissed && (
            <motion.div
              initial={{ opacity: 0, x: 12, scale: 0.94 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 8, scale: 0.94 }}
              transition={{ delay: 0.8, duration: 0.25 }}
              className="mr-2.5 hidden md:flex items-center gap-2 rounded-full border border-white/10 bg-[#0c0e16]/95 py-1.5 pl-3 pr-2 shadow-lg shadow-black/50 backdrop-blur-md cursor-pointer group hover:border-cyan-500/30 transition-all"
              onClick={toggleOpen}
            >
              <Sparkles size={12} className="text-cyan-400 opacity-80" />
              <span className="text-[11.5px] font-medium text-gray-300 group-hover:text-white">
                Ask <span className="text-cyan-400 font-semibold">Ego AI</span>
              </span>
              <button
                type="button"
                aria-label="Dismiss banner"
                onClick={(e) => {
                  e.stopPropagation();
                  setBannerDismissed(true);
                }}
                className="ml-0.5 rounded-full p-0.5 text-gray-500 hover:bg-white/10 hover:text-gray-300"
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
          aria-label={isOpen ? 'Close AI chat' : 'Open AI chat'}
        >
          <div className="relative flex items-center justify-center">
            {isOpen ? (
              <X size={18} className="transition-transform duration-150 rotate-90" />
            ) : (
              <Brain size={19} className="transition-transform duration-200 text-cyan-400" />
            )}
          </div>

          {/* Unread notification badge */}
          {hasUnread && !isOpen && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-60" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-cyan-500 border border-[#0b0d14]" />
            </span>
          )}
        </motion.button>
      </div>

      {/* ─── SLIDE-OUT CHAT DRAWER / POP-UP WIDGET (FULL-SCREEN MOBILE & COMPACT DESKTOP) ─────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ type: 'spring', damping: 28, stiffness: 340 }}
            className="fixed inset-0 z-[9999] flex flex-col w-full h-[100dvh] bg-[#090b12] font-sans md:inset-auto md:bottom-20 md:right-6 md:w-[380px] md:h-[500px] md:max-h-[calc(100vh-6.5rem)] md:rounded-2xl md:border md:border-white/10 md:bg-[#0a0c13]/98 md:shadow-2xl md:shadow-black/90 md:backdrop-blur-xl overflow-hidden"
            aria-label="AI Assistant Interface"
          >
            {/* Header with Dynamic Token Guard Status & Safe Top Spacing */}
            <div className="flex items-center justify-between border-b border-white/10 bg-[#0c0e17]/90 px-4 py-3 md:px-3 md:py-2 backdrop-blur-md shrink-0 pt-[max(0.75rem,env(safe-area-inset-top))] md:pt-2">
              <div className="flex items-center gap-2.5 md:gap-2">
                <div className="relative flex h-8 w-8 md:h-6 md:w-6 items-center justify-center rounded-lg md:rounded-md border border-white/10 bg-[#0e121d] text-cyan-400">
                  <Brain size={16} className="md:w-3.5 md:h-3.5" />
                  <span className={`absolute -bottom-0.5 -right-0.5 h-2 w-2 md:h-1.5 md:w-1.5 rounded-full ${
                    usage?.isLimitReached ? 'bg-red-400' : usage?.isWarning ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'
                  }`} />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xs md:text-[11.5px] font-semibold tracking-wide text-white">Ego Copilot</h3>
                    {usage?.isLimitReached ? (
                      <span className="rounded bg-red-500/10 px-1.5 py-0.5 md:px-1 md:py-0.2 text-[9px] md:text-[8px] font-mono text-red-400 border border-red-500/20">
                        Limit Reached
                      </span>
                    ) : usage?.isWarning ? (
                      <span className="rounded bg-amber-500/10 px-1.5 py-0.5 md:px-1 md:py-0.2 text-[9px] md:text-[8px] font-mono text-amber-300 border border-amber-500/20 animate-pulse" title={`${usage.currentTokens}/${usage.maxTokens} tokens`}>
                        ⚡ ~{usage.percentage}% Cap
                      </span>
                    ) : (
                      <span className="rounded bg-white/5 px-1.5 py-0.5 md:px-1 md:py-0.2 text-[9px] md:text-[8px] font-mono text-cyan-400 border border-white/10">
                        Live
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] md:text-[9px] text-gray-400 leading-none">Architecture & Portfolio AI</p>
                </div>
              </div>

              <div className="flex items-center gap-1 md:gap-0.5">
                <button
                  type="button"
                  onClick={clearChat}
                  title="Clear conversation & reset session"
                  className="rounded-lg md:rounded p-2 md:p-1 text-gray-400 transition-colors hover:bg-white/10 hover:text-gray-200"
                >
                  <RotateCcw size={15} className="md:w-3 md:h-3" />
                </button>
                <button
                  type="button"
                  onClick={closeChat}
                  title="Close widget"
                  className="rounded-lg md:rounded p-2 md:p-1 text-gray-400 transition-colors hover:bg-white/10 hover:text-gray-200"
                >
                  <X size={18} className="md:w-3.5 md:h-3.5" />
                </button>
              </div>
            </div>

            {/* Messages Scroll Area with Strict Scroll Isolation */}
            <div 
              className="flex-1 overflow-y-auto px-4 py-3 md:px-3 md:py-2.5 space-y-3 md:space-y-2 overscroll-contain scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
              style={{ overscrollBehavior: 'contain', touchAction: 'pan-y' }}
              onWheel={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
            >
              {messages.map((msg) => {
                const isUser = msg.role === 'user';

                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15 }}
                    className={`flex items-start gap-2 md:gap-1.5 group ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isUser && (
                      <div className="flex h-6 w-6 md:h-5 md:w-5 shrink-0 items-center justify-center rounded-md md:rounded border border-white/10 bg-[#0e121d] text-cyan-400 mt-0.5">
                        <Bot size={13} className="md:w-2.5 md:h-2.5" />
                      </div>
                    )}

                    <div
                      className={`relative max-w-[85%] md:max-w-[88%] rounded-xl md:rounded-lg px-3.5 py-2.5 md:px-2.5 md:py-1.5 shadow-sm ${
                        isUser
                          ? 'bg-cyan-600/90 text-white rounded-tr-none'
                          : 'border border-white/10 bg-white/[0.03] text-gray-100 rounded-tl-none backdrop-blur-sm'
                      }`}
                    >
                      <FormattedMessageContent text={msg.content} />

                      {/* Copy action for assistant responses */}
                      {!isUser && msg.content && (
                        <button
                          type="button"
                          onClick={() => handleCopy(msg.id, msg.content)}
                          className="absolute top-1.5 right-1.5 md:top-1 md:right-1 opacity-0 group-hover:opacity-100 transition-opacity rounded p-1 md:p-0.5 text-gray-400 hover:text-cyan-300 hover:bg-white/10"
                          title="Copy text"
                        >
                          {copiedId === msg.id ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} className="md:w-2.5 md:h-2.5" />}
                        </button>
                      )}
                    </div>

                    {isUser && (
                      <div className="flex h-6 w-6 md:h-5 md:w-5 shrink-0 items-center justify-center rounded-md md:rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 mt-0.5">
                        <User size={13} className="md:w-2.5 md:h-2.5" />
                      </div>
                    )}
                  </motion.div>
                );
              })}

              {/* Typing / Loading indicator */}
              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 3 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 md:gap-1.5"
                >
                  <div className="flex h-6 w-6 md:h-5 md:w-5 shrink-0 items-center justify-center rounded-md md:rounded border border-white/10 bg-[#0e121d] text-cyan-400">
                    <Brain size={13} className="animate-spin md:w-2.5 md:h-2.5" />
                  </div>
                  <div className="rounded-xl md:rounded-lg rounded-tl-none border border-white/10 bg-white/[0.03] px-3 py-1.5 md:px-2.5 md:py-1 text-xs md:text-[11px] text-cyan-400/90 flex items-center gap-1.5">
                    <span className="flex gap-1">
                      <span className="h-1 w-1 rounded-full bg-cyan-400 animate-bounce [animation-delay:-0.3s]" />
                      <span className="h-1 w-1 rounded-full bg-cyan-400 animate-bounce [animation-delay:-0.15s]" />
                      <span className="h-1 w-1 rounded-full bg-cyan-400 animate-bounce" />
                    </span>
                    <span className="text-[10px] md:text-[9.5px] text-gray-400 font-mono">Thinking...</span>
                  </div>
                </motion.div>
              )}

              {/* Token Limit Reached Inline Alert Card */}
              {usage?.isLimitReached && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl md:rounded-lg border border-amber-500/30 bg-amber-950/20 p-3 md:p-2.5 text-xs md:text-[11px] text-amber-200 space-y-1.5"
                >
                  <div className="flex items-center justify-between font-semibold text-amber-300">
                    <span>⚡ Session Capacity Reached</span>
                    <button
                      type="button"
                      onClick={clearChat}
                      className="rounded bg-amber-500/20 px-2.5 py-1 md:px-2 md:py-0.5 text-xs md:text-[10px] text-amber-200 hover:bg-amber-500/30 transition-colors"
                    >
                      Reset Session
                    </button>
                  </div>
                  <p className="text-[11px] md:text-[10px] text-amber-200/80 leading-normal">
                    To conserve API bandwidth, further queries are paused. Explore Haider's portfolio sections directly or click reset to start fresh!
                  </p>
                </motion.div>
              )}

              {/* Quick suggestion chips when conversation is early and limit not reached */}
              {messages.length <= 2 && !loading && !usage?.isLimitReached && (
                <div className="pt-1 md:pt-0.5">
                  <p className="text-[10.5px] md:text-[9.5px] font-medium text-gray-400 mb-1.5 md:mb-1 px-0.5">Quick inquiries:</p>
                  <div className="flex flex-col gap-1.5 md:gap-0.5">
                    {QUICK_PROMPTS.map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleQuickPrompt(item.prompt)}
                        className="flex items-center justify-between text-left rounded-lg md:rounded border border-white/5 bg-white/[0.02] px-3 py-2 md:px-2 md:py-1 text-xs md:text-[11px] text-gray-300 hover:border-cyan-500/30 hover:bg-white/[0.05] hover:text-white transition-all group"
                      >
                        <span>{item.label}</span>
                        <ChevronRight size={13} className="md:w-2.5 md:h-2.5 text-cyan-400 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Error Notification Bar */}
            {error && (
              <div className="border-t border-red-500/20 bg-red-950/30 px-3 py-1.5 md:px-2.5 md:py-1 text-xs md:text-[10px] text-red-300 flex items-center justify-between shrink-0">
                <span>{error}</span>
                <button
                  type="button"
                  onClick={() => handleQuickPrompt(input || 'Retry request')}
                  className="underline hover:text-white font-medium"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Input Form Footer with Safe Area Support */}
            <form
              onSubmit={handleSubmit}
              className="border-t border-white/10 bg-[#07080d] p-3 pb-[max(0.85rem,env(safe-area-inset-bottom))] md:p-2 md:pb-2 flex items-center gap-2 md:gap-1.5 shrink-0"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  usage?.isLimitReached
                    ? "Session limit reached (click Reset)..."
                    : "Ask about .NET, architecture, projects..."
                }
                disabled={loading || usage?.isLimitReached}
                className="flex-1 rounded-xl md:rounded-md border border-white/10 bg-white/[0.03] px-3.5 py-2.5 md:px-2.5 md:py-1.5 text-sm md:text-xs text-white placeholder-gray-500 outline-none focus:border-cyan-500/40 focus:bg-white/[0.05] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                type="submit"
                disabled={loading || !input.trim() || usage?.isLimitReached}
                className="flex h-10 w-10 md:h-7 md:w-7 items-center justify-center rounded-xl md:rounded-md bg-cyan-600 text-white shadow-sm transition-all hover:bg-cyan-500 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
                aria-label="Send query"
              >
                <Send size={15} className="md:w-3 md:h-3" />
              </button>
            </form>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
import { useCallback, useEffect, useRef, useState } from 'react';
import { aiService } from '../api/ai/ai.service';
import { tokenUsageGuard } from '../api/ai/tokenUsageGuard';
import { logger } from '../api/core/logger';

const INITIAL_MESSAGE = {
  id: 'msg-init',
  role: 'assistant',
  content: "Hello! 👋 I'm **Ego AI**, Haider's personal portfolio assistant.\n\nAsk me anything about his **system architecture**, **featured projects**, **technical skills**, **experience**, or **consulting services**!",
  timestamp: Date.now(),
};

/**
 * Presentation hook for AI chat state.
 * Controls message lifecycle, loading flags, open/close drawer states, token guard, and unmount safety.
 * Communicates exclusively with the Service Layer (aiService).
 */
export const useAIChat = () => {
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [usage, setUsage] = useState(() => tokenUsageGuard.getUsage());
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => {
      const next = !prev;
      if (next) setHasUnread(false);
      return next;
    });
  }, []);

  const openChat = useCallback(() => {
    setIsOpen(true);
    setHasUnread(false);
  }, []);

  const closeChat = useCallback(() => {
    setIsOpen(false);
  }, []);

  const clearChat = useCallback(() => {
    setMessages([
      {
        ...INITIAL_MESSAGE,
        id: `msg-init-${Date.now()}`,
        timestamp: Date.now(),
      },
    ]);
    setError(null);
    const freshUsage = tokenUsageGuard.reset();
    setUsage(freshUsage);
    logger.info('USE_AI_CHAT', 'Chat history and token session reset');
  }, []);

  const sendMessage = useCallback(
    async (content) => {
      const trimmed = (content || '').trim();
      if (!trimmed || !isMountedRef.current) return;

      const userMessage = {
        id: `usr-${Date.now()}`,
        role: 'user',
        content: trimmed,
        timestamp: Date.now(),
      };

      const updatedHistory = [...messages, userMessage];
      setMessages(updatedHistory);
      setLoading(true);
      setError(null);

      try {
        const response = await aiService.sendMessage({
          messages: updatedHistory.map(({ role, content }) => ({ role, content })),
          content: trimmed,
        });

        if (!isMountedRef.current) return;

        const assistantMessage = {
          id: `asst-${Date.now()}`,
          role: 'assistant',
          content: response.content,
          timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, assistantMessage]);

        if (!isOpen) {
          setHasUnread(true);
        }
      } catch (err) {
        logger.error('USE_AI_CHAT', 'Failed to dispatch AI message', err);
        if (isMountedRef.current) {
          setError(err.message || 'Failed to communicate with AI service. Please try again.');
          const errorMessage = {
            id: `err-${Date.now()}`,
            role: 'assistant',
            content: "⚠️ I encountered an issue processing your request. Please try again or rephrase your question.",
            timestamp: Date.now(),
          };
          setMessages((prev) => [...prev, errorMessage]);
        }
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
          setUsage(tokenUsageGuard.getUsage());
        }
      }
    },
    [messages, isOpen]
  );

  return {
    messages,
    loading,
    error,
    isOpen,
    hasUnread,
    usage,
    sendMessage,
    toggleOpen,
    openChat,
    closeChat,
    clearChat,
  };
};


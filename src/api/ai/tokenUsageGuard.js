import { logger } from '../core/logger';

const STORAGE_KEY = 'ego_ai_session_usage_v1';
const MAX_SESSION_TOKENS = 6000; // Approximate token limit per session
const WARNING_THRESHOLD_PERCENT = 80; // Show subtle warning badge at 80%

/**
 * Approximate token count from character length (standard ~4 chars per token).
 * @param {string} text
 * @returns {number}
 */
export function estimateTokens(text = '') {
  if (typeof text !== 'string') return 0;
  return Math.ceil(text.length / 4);
}

class TokenUsageGuard {
  constructor() {
    this.maxTokens = MAX_SESSION_TOKENS;
    this.warningThreshold = WARNING_THRESHOLD_PERCENT;
    this.currentTokens = this.loadUsage();
  }

  loadUsage() {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      return stored ? parseInt(stored, 10) || 0 : 0;
    } catch {
      return 0;
    }
  }

  saveUsage() {
    try {
      sessionStorage.setItem(STORAGE_KEY, this.currentTokens.toString());
    } catch {
      // Ignore storage errors in private browsing modes
    }
  }

  /**
   * Tracks token usage from input query and output response.
   * @param {string | unknown[]} input
   * @param {string} output
   * @returns {{ currentTokens: number, maxTokens: number, percentage: number, isWarning: boolean, isLimitReached: boolean }}
   */
  trackUsage(input = '', output = '') {
    const inputStr = typeof input === 'string' ? input : JSON.stringify(input);
    const outputStr = typeof output === 'string' ? output : JSON.stringify(output);

    const consumed = estimateTokens(inputStr) + estimateTokens(outputStr);
    this.currentTokens += consumed;
    this.saveUsage();

    const stats = this.getUsage();
    logger.info('TOKEN_GUARD', `Session Tokens: ${this.currentTokens}/${this.maxTokens} (${stats.percentage}%)`, {
      turnConsumed: consumed,
      warning: stats.isWarning,
      limitReached: stats.isLimitReached,
    });

    return stats;
  }

  /**
   * Returns current session token telemetry.
   */
  getUsage() {
    const percentage = Math.min(100, Math.round((this.currentTokens / this.maxTokens) * 100));
    const isLimitReached = this.currentTokens >= this.maxTokens;
    const isWarning = percentage >= this.warningThreshold && !isLimitReached;

    return {
      currentTokens: this.currentTokens,
      maxTokens: this.maxTokens,
      percentage,
      isWarning,
      isLimitReached,
    };
  }

  isLimitReached() {
    return this.currentTokens >= this.maxTokens;
  }

  isWarning() {
    const { isWarning } = this.getUsage();
    return isWarning;
  }

  reset() {
    this.currentTokens = 0;
    this.saveUsage();
    logger.info('TOKEN_GUARD', 'Session token usage counter reset to 0');
    return this.getUsage();
  }
}

export const tokenUsageGuard = new TokenUsageGuard();

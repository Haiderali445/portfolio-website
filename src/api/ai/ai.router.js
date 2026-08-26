/**
 * Intent resolution and heuristic tool routing for the local agent fallback.
 * Groq tool-calling still selects tools independently; this module only
 * decides which domain tool to run when the LLM pipeline is unavailable.
 */

/**
 * Lightweight intent detector for local agent heuristic routing.
 * @param {string} text
 * @returns {string} toolName
 */
export function detectIntentTool(text = '') {
  const q = text.toLowerCase();

  if (/project|app|built|portfolio|work|repo|github/i.test(q)) return 'get_projects';
  if (/skill|stack|technolog|specialt|c#|\.net|react|typescript|backend|frontend|database/i.test(q)) return 'get_skills';
  if (/experience|career|job|employ|history|role|worked/i.test(q)) return 'get_experience';
  if (/education|degree|university|study|college|academic/i.test(q)) return 'get_education';
  if (/service|hire|consult|offering|solution|architect/i.test(q)) return 'get_services';
  if (/price|pricing|cost|rate|package|tier/i.test(q)) return 'get_pricing';
  if (/testimonial|review|feedback|client|endorsement/i.test(q)) return 'get_testimonials';
  if (/who|haider|about|bio|contact|email|phone|resume|profile/i.test(q)) return 'get_profile';

  return 'get_profile';
}

/**
 * Resolves the local-fallback tool using intent detection plus the same
 * supplemental regex heuristics previously inlined in AIService.
 * @param {string} text
 * @returns {string} toolName
 */
export function resolveLocalFallbackTool(text = '') {
  const q = String(text).toLowerCase();
  const targetTool = detectIntentTool(text);

  if (targetTool === 'get_projects' || /project|work|app|build|built|portfolio/i.test(q)) {
    return 'get_projects';
  }
  if (targetTool === 'get_skills' || /skill|stack|tech|specialt|\.net|c#|react/i.test(q)) {
    return 'get_skills';
  }
  if (targetTool === 'get_experience' || /experience|career|job|worked|role/i.test(q)) {
    return 'get_experience';
  }
  if (targetTool === 'get_services' || /service|hire|consult|help|offer/i.test(q)) {
    return 'get_services';
  }
  if (targetTool === 'get_pricing' || /price|cost|tier|rate/i.test(q)) {
    return 'get_pricing';
  }

  return 'get_profile';
}

export const aiRouter = {
  detectIntentTool,
  resolveLocalFallbackTool,
};

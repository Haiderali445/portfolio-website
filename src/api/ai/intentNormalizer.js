import { logger } from '../core/logger';

/**
 * Common typo mappings & domain keyword aliases.
 */
const TYPO_MAP = {
  // .NET & C# synonyms
  dotnet: '.NET',
  netcore: '.NET Core',
  csharp: 'C#',
  cshrp: 'C#',
  aspnet: 'ASP.NET Core',
  entityframework: 'EF Core',
  efcore: 'EF Core',

  // Projects synonyms & typos
  projejcts: 'projects',
  projecs: 'projects',
  projcts: 'projects',
  projetcs: 'projects',
  projets: 'projects',
  portfoilio: 'portfolio',
  porfolio: 'portfolio',

  // Skills & specialties synonyms & typos
  specilties: 'specialties',
  specilities: 'specialties',
  specialities: 'specialties',
  skils: 'skills',
  skilz: 'skills',
  techstack: 'tech stack',
  technlogies: 'technologies',
  technologys: 'technologies',

  // Experience & background typos
  expierence: 'experience',
  expereince: 'experience',
  experiance: 'experience',
  experince: 'experience',
  carreer: 'career',
  emplyment: 'employment',

  // Education typos
  educashun: 'education',
  educaton: 'education',
  universty: 'university',
  colloge: 'college',

  // Services & pricing typos
  servises: 'services',
  servies: 'services',
  prcing: 'pricing',
  prizing: 'pricing',
  packges: 'packages',

  // Testimonials & Reviews typos
  testmonials: 'testimonials',
  testmonial: 'testimonials',
  reivews: 'reviews',
  recomends: 'recommendations',

  // Profile & identity typos
  haidar: 'Haider',
  haidr: 'Haider',
  contct: 'contact',
  emial: 'email',
  socails: 'socials',
};

/**
 * Normalizes user text and maps recognized typos to intended keywords.
 * @param {string} text
 * @returns {{ normalizedText: string, corrections: Array<{ original: string, corrected: string }> }}
 */
export function normalizeUserQuery(text = '') {
  if (!text || typeof text !== 'string') {
    return { normalizedText: '', corrections: [] };
  }

  const corrections = [];
  const words = text.split(/\b/);

  const normalizedWords = words.map((word) => {
    const lower = word.toLowerCase().trim();
    if (TYPO_MAP[lower]) {
      const corrected = TYPO_MAP[lower];
      corrections.push({ original: word, corrected });
      return corrected;
    }
    return word;
  });

  const normalizedText = normalizedWords.join('');

  if (corrections.length > 0) {
    logger.info('INTENT_NORMALIZER', 'Applied fuzzy typo corrections', {
      original: text,
      normalized: normalizedText,
      corrections,
    });
  }

  return {
    normalizedText,
    corrections,
  };
}

/**
 * Lightweight intent detector for local agent heuristic routing.
 * @param {string} text
 * @returns {string | null} toolName
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
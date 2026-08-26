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

export { detectIntentTool } from './ai.router';
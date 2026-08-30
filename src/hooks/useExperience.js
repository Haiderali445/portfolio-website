import { useMemo } from 'react';

export const normalizeExperienceItem = (experience = {}) => {
  const companyUrl = (() => {
    const rawValue = experience.companyUrl ?? experience.company_url ?? '';
    if (typeof rawValue !== 'string') return '';
    return rawValue.trim();
  })();

  return {
    ...experience,
    title: experience.title ?? '',
    company: experience.company ?? '',
    duration: experience.duration ?? '',
    description: experience.description ?? '',
    companyUrl,
    tech: Array.isArray(experience.tech) ? experience.tech : [],
  };
};

export const useExperience = (experiences = []) => {
  return useMemo(() => {
    if (!Array.isArray(experiences)) return [];
    return experiences.map(normalizeExperienceItem);
  }, [experiences]);
};

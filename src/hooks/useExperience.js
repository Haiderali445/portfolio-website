import { useMemo } from 'react';

export const normalizeExperienceItem = (experience = {}) => {
  const companyUrl = (() => {
    const rawValue = experience.companyUrl ?? experience.company_url ?? '';
    if (typeof rawValue !== 'string') return '';
    return rawValue.trim();
  })();
  const rawSortOrder = experience.sortOrder ?? experience.sortorder;
  const sortOrder = rawSortOrder == null ? null : Number(rawSortOrder);

  return {
    ...experience,
    sortOrder: sortOrder !== null && Number.isFinite(sortOrder) ? sortOrder : null,
    isCurrent: experience.isCurrent === true || experience.is_current === true,
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
    return experiences
      .map((experience, index) => ({
        normalized: normalizeExperienceItem(experience),
        index,
      }))
      .sort((a, b) => {
        const aOrder = a.normalized.sortOrder;
        const bOrder = b.normalized.sortOrder;
        if (aOrder !== null && bOrder !== null && aOrder !== bOrder) {
          return aOrder - bOrder;
        }
        if (aOrder !== null && bOrder === null) return -1;
        if (aOrder === null && bOrder !== null) return 1;
        return a.index - b.index;
      })
      .map(({ normalized }) => normalized);
  }, [experiences]);
};

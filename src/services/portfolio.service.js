import { profileService } from './profile.service';
import { siteService } from './site.service';
import { projectsService } from './projects.service';
import { experienceService } from './experience.service';
import { educationService } from './education.service';
import { offeringsService } from './offerings.service';
import { skillsService } from './skills.service';
import { testimonialsService } from './testimonials.service';
import { solutionsService } from './solutions.service';
import { pricingService } from './pricing.service';

export const portfolioService = {
  /**
   * Aggregates all domain service data for the main application state.
   * Uses Promise.allSettled to ensure a single failing service doesn't break the entire UI.
   * [Backend Swap]: Replace body with:
   *   const response = await apiClient.get('/portfolio');
   *   return response.data;
   */
  async getPortfolio() {
    const results = await Promise.allSettled([
      profileService.getProfile(),
      siteService.getSiteConfig(),
      projectsService.getProjects(),
      experienceService.getExperiences(),
      educationService.getEducations(),
      offeringsService.getServices(),
      skillsService.getSkills(),
      testimonialsService.getTestimonials(),
      solutionsService.getSolutions(),
      pricingService.getPricingPlans(),
    ]);

    // Helper to safely extract settled values with appropriate fallbacks
    const getValue = (index, fallback) => 
      results[index].status === 'fulfilled' ? results[index].value : fallback;

    // Optional: Log failures for monitoring without crashing execution
    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        console.warn(`Portfolio sub-service [Index ${index}] failed:`, result.reason);
      }
    });

    const personal = getValue(0, {});
    const site = getValue(1, {});
    const projects = getValue(2, []);
    const experience = getValue(3, []);
    const education = getValue(4, []);
    const services = getValue(5, []);
    const skills = getValue(6, []);
    const testimonials = getValue(7, []);
    const solutions = getValue(8, []);
    const pricing = getValue(9, []);

    // Merge siteConfig into personal object for smooth component prop compatibility
    const mergedPersonal = {
      ...personal,
      ...site,
      // Explicitly pull through terminal credentials from your profile service data
      terminalUser: personal?.terminalUser ?? 'haider@dev',
      terminalPass: personal?.terminalPass ?? 'pass123',
    };

    return {
      personal: mergedPersonal,
      site,
      projects,
      experience,
      education,
      services,
      skills,
      contacts: {
        email: personal?.email ?? '',
        phone: personal?.phone ?? '',
        address: personal?.address ?? '',
        github: personal?.github ?? '',
        instagram: personal?.instagram ?? '',
        linkedIn: personal?.linkedIn ?? '',
      },
      testimonials,
      solutions,
      pricing,
    };
  },
};
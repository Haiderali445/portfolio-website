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
   * [Backend Swap]: Replace body with:
   *   const response = await apiClient.get('/portfolio');
   *   return response.data;
   */
  async getPortfolio() {
    const [
      personal,
      site,
      projects,
      experience,
      education,
      services,
      skills,
      testimonials,
      solutions,
      pricing,
    ] = await Promise.all([
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

    // Merge siteConfig into personal object for smooth component prop compatibility
    const mergedPersonal = {
      ...personal,
      ...site,
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
        email: personal.email,
        phone: personal.phone,
        address: personal.address,
        github: personal.github,
        instagram: personal.instagram,
        linkedIn: personal.linkedIn,
      },
      testimonials,
      solutions,
      pricing,
    };
  },
};

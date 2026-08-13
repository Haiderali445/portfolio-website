import { profileService } from './services/profile.service';
import { siteService } from './services/site.service';
import { projectsService } from './services/projects.service';
import { experienceService } from './services/experience.service';
import { educationService } from './services/education.service';
import { offeringsService } from './services/offerings.service';
import { skillsService } from './services/skills.service';
import { testimonialsService } from './services/testimonials.service';
import { solutionsService } from './services/solutions.service';
import { pricingService } from './services/pricing.service';
import { BaseRepository } from './core/base.repository';

class PortfolioService extends BaseRepository {
  constructor() {
    super('/portfolio');
  }

  async getPortfolio() {
    if (this.useBackend) {
      try {
        const response = await this.getAll();
        return response;
      } catch (error) {
        console.warn('Backend portfolio fetch failed. Falling back to aggregated services.');
      }
    }

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

    const getValue = (index, fallback) => 
      results[index].status === 'fulfilled' ? results[index].value : fallback;

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

    const mergedPersonal = {
      ...personal,
      ...site,
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
  }
}

export const portfolioService = new PortfolioService();
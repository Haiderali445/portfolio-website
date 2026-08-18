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
import { terminalService } from './services/terminal.service';
import { gmailService } from './services/gmail.service';
import { TERMINAL_DEFAULT_CONFIG } from '../utils/data/terminalData';
import { BaseRepository } from './core/base.repository';

class PortfolioService {
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
      terminalService.getTerminalConfig(),
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
    const terminalConfig = getValue(10, TERMINAL_DEFAULT_CONFIG);

    const resolvedAvailability = 
      personal?.availabilityStatus || 
      personal?.availabilitystatus || 
      personal?.availabilityLabel || 
      personal?.availabilitylabel || 
      site?.availabilityStatus || 
      site?.availabilitystatus || 
      site?.availabilityLabel || 
      site?.availabilitylabel || 
      "Available for Opportunities";

    const mergedPersonal = {
      ...site,
      ...personal,
      profile: personal?.profile || personal?.heroImage || personal?.heroimage || '',
      heroImage: personal?.heroImage || personal?.heroimage || personal?.profile || '',
      typewriterTitles: personal?.typewriterTitles || personal?.typewritertitles || [],
      interests: personal?.interests || [],
      aboutFocus: personal?.aboutFocus || personal?.aboutfocus || [],
      terminalUser: personal?.terminaluser ?? personal?.terminalUser ?? terminalConfig.defaultUser,
      terminalPass: personal?.terminalpass ?? personal?.terminalPass ?? terminalConfig.defaultPass,
      
      // Availability properties mapped safely across naming variations
      availabilityStatus: resolvedAvailability,
      availabilityLabel: resolvedAvailability,
      
      // Ensure site config properties exist right on personalData if components look there
      footerTagline: personal?.footerTagline || personal?.footertagline || site?.footerTagline || site?.footertagline || "Crafting digital experiences with code and passion. Open for collaborations.",
      chaiBoxTitle: personal?.chaiBoxTitle || personal?.chaiboxtitle || site?.chaiBoxTitle || site?.chaiBoxTitle || "Fuel the Code ☕",
      chaiBoxDescription: personal?.chaiBoxDescription || personal?.chaiboxdescription || site?.chaiBoxDescription || site?.chaiBoxDescription || "Innovative solutions require high-octane chai. Support the craft!",
      contactSectionIntro: personal?.contactSectionIntro || personal?.contactsectionintro || site?.contactSectionIntro || site?.contactsectionintro || "Have a project in mind or want to discuss AI? I'm open to new connections.",
      projectsSectionSubtitle: personal?.projectsSectionSubtitle || personal?.projectssectionsubtitle || site?.projectsSectionSubtitle || site?.projectssectionsubtitle || "A curated selection of projects that demonstrate my technical capabilities and product design sensibilities.",
      solutionsSectionSubtitle: personal?.solutionsSectionSubtitle || personal?.solutionssectionsubtitle || site?.solutionsSectionSubtitle || site?.solutionssectionsubtitle || "A collection of technical challenges I've tackled, from system architecture to AI integration.",
      devStack: personal?.devStack || personal?.devstack || site?.devStack || site?.devstack || {
        os: "Linux/Windows(WSL)",
        editor: "Cursor",
        shell: "ZSH",
        framework: "React/Vite",
        style: "Tailwind",
      }
    };

    const mergedSite = {
      ...site,
      ...mergedPersonal,
    };

    return {
      personal: mergedPersonal,
      site: mergedSite,
      projects,
      experience,
      education,
      services,
      skills,
      contacts: {
        email: mergedPersonal?.email ?? '',
        phone: mergedPersonal?.phone ?? '',
        address: mergedPersonal?.address ?? '',
        github: mergedPersonal?.github ?? mergedPersonal?.Github ?? '',
        instagram: mergedPersonal?.instagram ?? mergedPersonal?.Instagram ?? '',
        linkedIn: mergedPersonal?.linkedIn ?? mergedPersonal?.linkedin ?? mergedPersonal?.LinkedIn ?? '',
      },
      testimonials,
      solutions,
      pricing,
      terminalConfig,
      dispatchers: {
        gmail: gmailService,
      },
    };
  }
}

export const portfolioService = new PortfolioService();
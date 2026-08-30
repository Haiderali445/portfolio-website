import { profileService } from '../services/profile.service';
import { projectsService } from '../services/projects.service';
import { skillsService } from '../services/skills.service';
import { experienceService } from '../services/experience.service';
import { educationService } from '../services/education.service';
import { offeringsService } from '../services/offerings.service';
import { solutionsService } from '../services/solutions.service';
import { pricingService } from '../services/pricing.service';
import { testimonialsService } from '../services/testimonials.service';
import { siteService } from '../services/site.service';
import { gmailService, isValidEmail } from '../services/gmail.service';
import { personalData } from '../../utils/data/personal-data';
import { logger } from '../core/logger';

/**
 * AI Tool Declarations & Domain Service Mappings.
 *
 * STRICT ARCHITECTURAL RULES:
 * 1. Retrieval tools are read-only.
 * 2. The only write-capable tool is send_email, which always delivers to the
 *    portfolio owner via gmailService and never arbitrary third-party inboxes.
 * 3. All executions flow strictly through the Service Layer.
 */
export const aiTools = {
  get_profile: {
    name: 'get_profile',
    description: 'Retrieve the developer\'s core bio, personal profile, contact information, social links, resume URL, availability status, and focus philosophy.',
    parameters: {
      type: 'object',
      properties: {},
      required: [],
    },
    execute: async () => {
      const data = await profileService.getProfile();
      return {
        name: data?.name,
        designation: data?.designation,
        description: data?.description,
        email: data?.email,
        phone: data?.phone,
        address: data?.address,
        github: data?.github,
        linkedin: data?.linkedIn || data?.linkedin,
        instagram: data?.instagram,
        resumeUrl: data?.resumeUrl || data?.resume,
        availabilityStatus: data?.availabilityStatus || data?.availabilityLabel,
        aboutEyebrow: data?.aboutEyebrow,
        interests: data?.interests,
        aboutFocus: data?.aboutFocus,
        typewriterTitles: data?.typewriterTitles,
      };
    },
  },

  get_projects: {
    name: 'get_projects',
    description: 'Retrieve portfolio projects. Optionally filter by specific tech keyword (e.g. ".NET", "React", "AI") or retrieve all featured highlights.',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Specific technology or keyword to filter by (e.g. ".NET", "React", "Tailor", "AI"). Leave empty or omit if user asks generally for projects.',
        },
        featuredOnly: {
          type: 'boolean',
          description: 'Optional flag to retrieve featured projects.',
        },
        limit: {
          type: 'number',
          description: 'Max number of projects to return (default 5).',
        },
      },
      required: [],
    },
    execute: async ({ query, featuredOnly = false, limit = 5 } = {}) => {
      const projects = await projectsService.getProjects();
      if (!Array.isArray(projects) || projects.length === 0) return [];
      
      let filtered = projects;

      if (query && typeof query === 'string') {
        const cleanQuery = query.toLowerCase().replace(/\b(list|show|his|my|all|the|projects|project|apps|app|work|built|portfolio)\b/gi, '').trim();
        if (cleanQuery.length >= 2) {
          const matches = projects.filter(
            (p) =>
              p.name?.toLowerCase().includes(cleanQuery) ||
              p.description?.toLowerCase().includes(cleanQuery) ||
              (p.tools || []).some((t) => t.toLowerCase().includes(cleanQuery))
          );
          if (matches.length > 0) {
            filtered = matches;
          }
        }
      }

      if (featuredOnly) {
        filtered = filtered.slice(0, 3);
      }

      const capped = filtered.slice(0, Math.min(limit, 8));

      return capped.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        role: p.role,
        tools: p.tools || [],
        demoUrl: p.demo || p.websiteUrl,
        codeUrl: p.code,
      }));
    },
  },

  get_project_by_id: {
    name: 'get_project_by_id',
    description: 'Retrieve detailed information for a specific project by its numeric ID.',
    parameters: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: 'The unique numeric ID of the project to retrieve.',
        },
      },
      required: ['id'],
    },
    execute: async ({ id }) => {
      const project = await projectsService.getProjectById(Number(id));
      if (!project) return { error: `Project with ID ${id} not found.` };
      return {
        id: project.id,
        name: project.name,
        description: project.description,
        role: project.role,
        tools: project.tools || [],
        codeUrl: project.code,
        demoUrl: project.demo || project.websiteUrl,
        inProgress: project.inProgress,
        contributors: (project.contributors || []).map((c) => c.name || c.github),
      };
    },
  },

  get_skills: {
    name: 'get_skills',
    description: 'Retrieve technical skills and tech stack domains.',
    parameters: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          description: 'Optional category name (e.g. "Frontend", "Backend", "Cloud", "DevOps", "Database").',
        },
      },
      required: [],
    },
    execute: async ({ category } = {}) => {
      const [skills, categories] = await Promise.all([
        skillsService.getSkills(),
        skillsService.getCategories(),
      ]);

      if (category && typeof category === 'string') {
        const catLower = category.toLowerCase().trim();
        const matchedCat = (categories || []).find(
          (c) => (c.title || c.name || '').toLowerCase().includes(catLower)
        );
        if (matchedCat) {
          return {
            category: matchedCat.title || matchedCat.name,
            skills: matchedCat.skills || [],
          };
        }
      }

      return {
        topSkills: Array.isArray(skills) ? skills.slice(0, 20).map((s) => s.name || s) : [],
        categories: Array.isArray(categories)
          ? categories.map((c) => ({
              category: c.title || c.name,
              skills: c.skills || [],
            }))
          : [],
      };
    },
  },

  get_experience: {
    name: 'get_experience',
    description: 'Retrieve career timeline and employment history.',
    parameters: {
      type: 'object',
      properties: {
        limit: {
          type: 'number',
          description: 'Max number of roles to return (default 4).',
        },
      },
      required: [],
    },
    execute: async ({ limit = 4 } = {}) => {
      const experiences = await experienceService.getExperiences();
      if (!Array.isArray(experiences) || experiences.length === 0) return [];
      return experiences.slice(0, limit).map((exp) => ({
        title: exp.title,
        company: exp.company,
        duration: exp.duration,
        description: exp.description,
        tech: exp.tech || [],
      }));
    },
  },

  get_education: {
    name: 'get_education',
    description: 'Retrieve academic credentials and university history.',
    parameters: {
      type: 'object',
      properties: {},
      required: [],
    },
    execute: async () => {
      const educations = await educationService.getEducations();
      if (!Array.isArray(educations) || educations.length === 0) return [];
      return educations.map((edu) => ({
        title: edu.title,
        institution: edu.institution,
        duration: edu.duration,
      }));
    },
  },

  get_services: {
    name: 'get_services',
    description: 'Retrieve consulting services and technical offerings.',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Optional keyword to search services.',
        },
      },
      required: [],
    },
    execute: async ({ query } = {}) => {
      const services = await offeringsService.getServices();
      if (!Array.isArray(services) || services.length === 0) return [];

      let list = services;
      if (query && typeof query === 'string') {
        const q = query.toLowerCase().replace(/\b(services|service|offerings|consulting)\b/gi, '').trim();
        if (q.length >= 2) {
          const matches = list.filter(
            (s) =>
              s.name?.toLowerCase().includes(q) ||
              s.description?.toLowerCase().includes(q)
          );
          if (matches.length > 0) list = matches;
        }
      }

      return list.slice(0, 4).map((s) => ({
        name: s.name,
        description: s.description,
        problem: s.problem,
        solution: s.solution,
        fullTechStack: s.fullTechStack || [],
      }));
    },
  },

  get_solutions: {
    name: 'get_solutions',
    description: 'Retrieve real-world architecture problem-solving case studies.',
    parameters: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          description: 'Optional category.',
        },
      },
      required: [],
    },
    execute: async ({ category } = {}) => {
      const solutions = await solutionsService.getSolutions();
      if (!Array.isArray(solutions) || solutions.length === 0) return [];

      let list = solutions;
      if (category && typeof category === 'string') {
        const c = category.toLowerCase().trim();
        const matches = list.filter((sol) => sol.category?.toLowerCase().includes(c));
        if (matches.length > 0) list = matches;
      }

      return list.slice(0, 4).map((sol) => ({
        title: sol.title,
        category: sol.category,
        description: sol.description,
        tech: sol.tech || [],
      }));
    },
  },

  get_pricing: {
    name: 'get_pricing',
    description: 'Retrieve investment pricing tiers, packages, features (AWS, database, auth support), and scope details.',
    parameters: {
      type: 'object',
      properties: {},
      required: [],
    },
    execute: async () => {
      const pricing = await pricingService.getPricingPlans();
      if (!Array.isArray(pricing)) return [];
      return pricing.map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        pages: p.pages,
        hasAws: Boolean(p.hasAws || p.aws),
        hasDatabase: Boolean(p.hasDatabase || p.database),
        hasAuth: Boolean(p.hasAuth || p.auth),
        databaseSize: p.databaseSize,
        isPopular: Boolean(p.isPopular),
      }));
    },
  },

  get_testimonials: {
    name: 'get_testimonials',
    description: 'Retrieve client reviews, peer testimonials, ratings, and endorsements.',
    parameters: {
      type: 'object',
      properties: {},
      required: [],
    },
    execute: async () => {
      const testimonials = await testimonialsService.getTestimonials();
      if (!Array.isArray(testimonials)) return [];
      return testimonials
        .filter((t) => t.isVisible !== false)
        .map((t) => ({
          name: t.name,
          title: t.title,
          company: t.company,
          testimonial: t.testimonial,
          stars: t.stars,
        }));
    },
  },

  get_site_config: {
    name: 'get_site_config',
    description: 'Retrieve site branding, availability status, developer setup (OS, shell, editor, framework), and section descriptions.',
    parameters: {
      type: 'object',
      properties: {},
      required: [],
    },
    execute: async () => {
      const config = await siteService.getSiteConfig();
      return {
        availabilityStatus: config?.availabilityStatus || config?.availabilityLabel,
        footerTagline: config?.footerTagline,
        devStack: config?.devStack,
        chaiBoxTitle: config?.chaiBoxTitle,
        chaiBoxDescription: config?.chaiBoxDescription,
      };
    },
  },

  send_email: {
    name: 'send_email',
    description:
      'Draft and send a professional email to Haider Ali (portfolio owner) via gmailService.sendDirectMail. The user may provide sender/recipient details and context in any order. Accept flexible aliases such as sender_email, email, from_email, recipient_email, recipient_name, sender_name, name, context, subject, and message. If the sender email is missing or invalid, return needs_sender_email: true and ask the user for it. If the message is missing, infer a professional draft from the provided context or ask for the missing content. The tool must send to the owner and also email a confirmation copy back to the sender.',
    parameters: {
      type: 'object',
      properties: {
        sender_email: {
          type: 'string',
          description: 'Sender or visitor email used as reply-to and confirmation copy destination. Required before sending.',
        },
        recipient_email: {
          type: 'string',
          description: 'Alias for sender_email when the user describes their own email as the destination for confirmation copy.',
        },
        email: {
          type: 'string',
          description: 'Alias for sender_email in case the user provided a generic email field.',
        },
        sender_name: {
          type: 'string',
          description: 'Name of the sender. Optional but helpful for the email body and confirmation copy.',
        },
        recipient_name: {
          type: 'string',
          description: 'Optional name of the recipient, usually Haider Ali or a contact alias.',
        },
        name: {
          type: 'string',
          description: 'Alias for sender_name when the user provides a general name field.',
        },
        subject: {
          type: 'string',
          description: 'Short professional subject line. If omitted, generate one from the context.',
        },
        message: {
          type: 'string',
          description: 'Full email body or detailed note to send to Haider.',
        },
        context: {
          type: 'string',
          description: 'Project context, reason for reaching out, or a short brief to turn into a polished email.',
        },
      },
      required: [],
    },
    execute: async ({
      sender_email,
      recipient_email,
      email,
      sender_name,
      recipient_name,
      name,
      subject,
      message,
      context,
    } = {}) => {
      const resolvedSenderEmail = String(sender_email || recipient_email || email || '').trim();
      const resolvedSenderName = String(sender_name || name || '').trim();
      const resolvedRecipientName = String(recipient_name || 'Haider Ali').trim();
      const resolvedMessage = String(message || context || '').trim();

      if (!isValidEmail(resolvedSenderEmail)) {
        return {
          sent: false,
          needs_sender_email: true,
          instruction:
            'Ask the user for their email address before sending. Do not guess or fabricate it. Then call send_email again with sender_email or email, sender_name, subject, and message or context.',
        };
      }

      const subjectLine = String(subject || 'Portfolio inquiry').trim() || 'Portfolio inquiry';
      const finalBody = resolvedMessage.length >= 12
        ? resolvedMessage
        : `Hello ${resolvedRecipientName},\n\nI would like to connect regarding a potential collaboration or opportunity.\n\nPlease let me know the best way to proceed.\n\nBest regards,\n${resolvedSenderName || 'Portfolio Visitor'}`;

      const ownerEmail = import.meta.env.VITE_PORTFOLIO_OWNER_EMAIL || personalData.email;

      await gmailService.sendDirectMail(null, {
        name: resolvedSenderName || 'Portfolio Visitor',
        email: resolvedSenderEmail,
        subject: subjectLine,
        message: finalBody,
        toEmail: ownerEmail,
        origin_mode: 'Ego AI Copilot Draft & Send',
        sendConfirmation: true,
      });

      return {
        sent: true,
        delivered_to_owner: true,
        confirmation_sent_to: resolvedSenderEmail,
        note: 'Tell the user the email was delivered to Haider and a confirmation copy was sent to their inbox. Keep the response polished and concise without dumping raw JSON.',
      };
    },
  },
};

/**
 * OpenAI / Groq tool declarations array format.
 */
export const aiToolDefinitions = Object.values(aiTools).map((tool) => ({
  type: 'function',
  function: {
    name: tool.name,
    description: tool.description,
    parameters: tool.parameters,
  },
}));

/**
 * Safe tool executor executing strictly through the Service Layer.
 * @param {string} toolName
 * @param {Record<string, unknown>} args
 * @returns {Promise<string>} Stringified JSON payload for the LLM
 */
export async function executeAITool(toolName, args = {}) {
  const tool = aiTools[toolName];
  if (!tool) {
    logger.error('AI_TOOLS', `Attempted to call unauthorized or unknown tool: ${toolName}`);
    return JSON.stringify({ error: `Tool ${toolName} is not recognized or permitted.` });
  }

  const start = performance.now();
  try {
    logger.info('AI_TOOLS', `Executing tool [${toolName}]`, args);
    const result = await tool.execute(args);
    const duration = (performance.now() - start).toFixed(2);
    logger.morgan('EXEC_TOOL', `/ai/tools/${toolName}`, 200, duration);
    return JSON.stringify(result);
  } catch (error) {
    const duration = (performance.now() - start).toFixed(2);
    logger.morgan('EXEC_TOOL', `/ai/tools/${toolName}`, 500, duration);
    logger.error('AI_TOOLS', `Failed executing tool [${toolName}]`, error);
    return JSON.stringify({ error: `Failed to fetch data: ${error.message || 'Unknown error'}` });
  }
}


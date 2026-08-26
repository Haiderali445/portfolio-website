import { apiClient } from '../core/apiClient';
import { aiToolDefinitions, executeAITool } from './ai.tools';
import { AI_CONFIG, AI_SYSTEM_PROMPT } from './ai.config';
import { tokenUsageGuard } from './tokenUsageGuard';
import { normalizeUserQuery } from './intentNormalizer';
import { aiRouter } from './ai.router';
import { logger } from '../core/logger';

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || '';

class AIService {
  constructor() {
    this.apiKey = GROQ_API_KEY;
    this.apiUrl = import.meta.env.VITE_AI_API_URL || import.meta.env.VITE_API_URL || '';
    this.models = AI_CONFIG.fallbackModels || [AI_CONFIG.model, 'llama-3.1-8b-instant'];
    this.model = this.models[0] || AI_CONFIG.model;
    this.groqUrl = AI_CONFIG.groqApiUrl;
    this.client = apiClient;
    this.tokenGuard = tokenUsageGuard;
  }

  /**
   * Primary entrypoint: Sends a conversation turn through the Fetch -> Process -> Format -> Send pipeline.
   * @param {{ messages: Array<{ role: string, content: string }>, content?: string }} payload
   * @returns {Promise<{ role: 'assistant', content: string, tokenUsage?: unknown }>}
   */
  async sendMessage(payload) {
    const start = performance.now();
    const { messages = [], content } = payload;

    // 1. Guardrail Check: Block outbound calls if session token limit is reached
    if (this.tokenGuard.isLimitReached()) {
      logger.error('AI_SERVICE', 'Outbound AI request blocked by TokenUsageGuard');
      return {
        role: 'assistant',
        content: '⚡ **Session Token Limit Reached:** To preserve API bandwidth, further AI responses in this session are restricted. Feel free to explore Haider\'s portfolio sections directly, or click **Reset (↻)** to start a new session!',
        tokenUsage: this.tokenGuard.getUsage(),
      };
    }

    // 2. Preprocess & Normalize User Query (Typo Tolerance & Slang mapping)
    const rawContent = content || (messages.length ? messages[messages.length - 1]?.content : '') || '';
    const { normalizedText, corrections } = normalizeUserQuery(rawContent);

    // Construct unified message history with normalized user turn
    const conversation = messages.map((m, idx) => {
      if (idx === messages.length - 1 && m.role === 'user' && normalizedText) {
        return { ...m, content: normalizedText };
      }
      return m;
    });

    if (content && (!conversation.length || conversation[conversation.length - 1].content !== normalizedText)) {
      conversation.push({ role: 'user', content: normalizedText || content });
    }

    logger.info('AI_SERVICE', `Processing query: "${normalizedText || rawContent}"`, {
      messageCount: conversation.length,
      hasApiKey: Boolean(this.apiKey),
      activeModel: this.model,
      typoCorrections: corrections.length,
    });

    try {
      let assistantReply;

      // Pipeline execution: Groq API with auto-rotating models -> Backend Proxy -> Local Agent Fallback
      if (this.apiKey) {
        assistantReply = await this.executeGroqPipeline(conversation);
      } else if (this.apiUrl) {
        assistantReply = await this.executeBackendProxy(conversation);
      } else {
        logger.info('AI_SERVICE', 'Activating local tool-assisted conversational synthesis fallback');
        assistantReply = await this.executeLocalAgentFallback(normalizedText || rawContent);
      }

      // Track consumed tokens in session guard
      const usageStats = this.tokenGuard.trackUsage(conversation, assistantReply);

      const duration = (performance.now() - start).toFixed(2);
      logger.morgan('POST', '/api/ai/chat', 200, duration);
      logger.success('AI_SERVICE', 'Successfully resolved conversational AI response', { 
        model: this.model,
        usage: `${usageStats.percentage}%` 
      });

      return {
        role: 'assistant',
        content: assistantReply,
        tokenUsage: usageStats,
      };
    } catch (error) {
      const duration = (performance.now() - start).toFixed(2);
      logger.morgan('POST', '/api/ai/chat', 500, duration);
      logger.error('AI_SERVICE', 'Error in AI pipeline, activating graceful local fallback', error);

      const fallbackReply = await this.executeLocalAgentFallback(normalizedText || rawContent);
      const usageStats = this.tokenGuard.trackUsage(conversation, fallbackReply);

      return {
        role: 'assistant',
        content: fallbackReply,
        tokenUsage: usageStats,
      };
    }
  }

  /**
   * Executes multi-turn tool calling with auto-selecting model fallback rotation.
   * If a model returns 404, 400, model_not_found, or deprecation, rotates to backup models automatically.
   * @param {Array<{ role: string, content: string }>} conversation
   * @returns {Promise<string>}
   */
  async executeGroqPipeline(conversation) {
    const candidateModels = [
      this.model,
      ...this.models.filter((m) => m !== this.model),
    ];

    let lastError = null;

    for (let i = 0; i < candidateModels.length; i++) {
      const activeModel = candidateModels[i];
      try {
        const reply = await this.executeGroqModelTurn(conversation, activeModel);
        // Persist successful active model for future turns
        this.model = activeModel;
        return reply;
      } catch (err) {
        lastError = err;
        const errMsg = (err.message || '').toLowerCase();
        const isModelError =
          errMsg.includes('404') ||
          errMsg.includes('400') ||
          errMsg.includes('model_not_found') ||
          errMsg.includes('does not exist') ||
          errMsg.includes('decommissioned') ||
          errMsg.includes('deprecated') ||
          errMsg.includes('not found');

        if (isModelError && i < candidateModels.length - 1) {
          const nextModel = candidateModels[i + 1];
          logger.info('AI_SERVICE', `Model [${activeModel}] failed (${err.message}). Auto-rotating to fallback model [${nextModel}]...`);
          continue;
        }

        // If not a model error or last candidate, rethrow for global handler
        throw err;
      }
    }

    throw lastError || new Error('All candidate Groq models failed.');
  }

  /**
   * Single model multi-turn tool execution loop.
   * @param {Array<{ role: string, content: string }>} conversation
   * @param {string} modelName
   * @returns {Promise<string>}
   */
  async executeGroqModelTurn(conversation, modelName) {
    const formattedMessages = [
      { role: 'system', content: AI_SYSTEM_PROMPT },
      ...conversation.map((m) => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.content || '',
      })),
    ];

    let currentMessages = [...formattedMessages];
    const maxTurns = AI_CONFIG.maxToolTurns || 5;

    for (let turn = 0; turn < maxTurns; turn++) {
      const response = await fetch(this.groqUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: modelName,
          messages: currentMessages,
          tools: aiToolDefinitions,
          tool_choice: 'auto',
          temperature: AI_CONFIG.temperature,
          max_tokens: AI_CONFIG.maxTokens,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Groq API returned HTTP ${response.status} for model [${modelName}]: ${errText}`);
      }

      const data = await response.json();
      const choice = data.choices?.[0];
      const message = choice?.message;

      if (!message) {
        throw new Error(`Invalid response structure received from Groq for model [${modelName}].`);
      }

      // Check if LLM requested tool executions (Fetch -> Process)
      if (message.tool_calls && message.tool_calls.length > 0) {
        logger.info('AI_SERVICE', `LLM [${modelName}] triggered ${message.tool_calls.length} tool call(s) (Turn ${turn + 1})`);
        currentMessages.push(message);

        for (const toolCall of message.tool_calls) {
          const toolName = toolCall.function.name;
          let parsedArgs = {};
          try {
            parsedArgs = JSON.parse(toolCall.function.arguments || '{}');
          } catch (parseErr) {
            logger.error('AI_SERVICE', `Failed to parse arguments for tool ${toolName}`, parseErr);
          }

          // Step 3: Fetch & Process data via Service Layer
          const toolResult = await executeAITool(toolName, parsedArgs);
          currentMessages.push({
            role: 'tool',
            tool_call_id: toolCall.id,
            name: toolName,
            content: toolResult,
          });
        }
        // Step 4: Feed processed tool data back to LLM for final conversational synthesis
        continue;
      }

      // Final formatted conversational response from LLM
      return message.content || 'I gathered the information, but received no text output.';
    }

    return 'I completed gathering the necessary information from Haider\'s portfolio services.';
  }

  /**
   * Alternative backend proxy for NestJS / Express proxy migration.
   * @param {Array<{ role: string, content: string }>} conversation
   * @returns {Promise<string>}
   */
  async executeBackendProxy(conversation) {
    const res = await this.client.post('/ai/chat', {
      messages: conversation,
    });
    return res.data?.message || res.data?.content || 'Received response from backend AI service.';
  }

  /**
   * Conversational offline / local heuristic agent fallback.
   * Formats projects into clean markdown cards instead of broken HTML tables.
   * @param {string} query
   * @returns {Promise<string>}
   */
  async executeLocalAgentFallback(query) {
    const { normalizedText } = normalizeUserQuery(query);
    const targetTool = aiRouter.resolveLocalFallbackTool(normalizedText);

    logger.info('AI_LOCAL_AGENT', `Executing local synthesized fallback for intent [${targetTool}]`);

    if (targetTool === 'get_projects') {
      const projectsJson = await executeAITool('get_projects', { limit: 5 });
      const projects = JSON.parse(projectsJson);
      if (Array.isArray(projects) && projects.length) {
        const list = projects
          .map((p, idx) => `### 🛠️ ${idx + 1}. ${p.name}\n- **Role:** ${p.role || 'Full-Stack Developer'}\n- **Stack:** ${(p.tools || []).join(' • ') || 'React, .NET Core'}\n- **Highlights:** ${p.description || 'Enterprise-grade architecture.'}\n${p.demoUrl || p.githubUrl ? `- **Links:** ${p.githubUrl ? `[GitHub](${p.githubUrl})` : ''} ${p.demoUrl ? `| [Live Demo](${p.demoUrl})` : ''}` : ''}`)
          .join('\n\n---not-break---\n\n');
        return `🎉 **Haider Ali – Project Showcase**\nBelow is a clean, structured overview of Haider's top engineering projects:\n\n${list}\n\n✨ Want to dive deeper into the architecture of any of these?`;
      }
    }

    if (targetTool === 'get_skills') {
      const skillsJson = await executeAITool('get_skills');
      const data = JSON.parse(skillsJson);
      const categories = data.categories || [];
      if (categories.length) {
        const catList = categories
          .map((c) => `⚡ **${c.category}**: ${(c.skills || []).join(', ')}`)
          .join('\n');
        return `Haider is a powerhouse when it comes to modern engineering stacks! 🛠️✨\n\n${catList}\n\n💡 He specializes in high-throughput **.NET 8** backends, **CQRS / Clean Architecture**, and ultra-sleek **React / Vite** frontends!`;
      }
    }

    if (targetTool === 'get_experience') {
      const expJson = await executeAITool('get_experience', { limit: 4 });
      const exps = JSON.parse(expJson);
      if (Array.isArray(exps) && exps.length) {
        const expList = exps
          .map((e) => `💼 **${e.title}** @ **${e.company}** (${e.duration})\n${e.description}`)
          .join('\n\n');
        return `Here is a look at Haider's impressive career journey: 💼🚀\n\n${expList}\n\nHe has a proven track record of shipping resilient, scalable systems!`;
      }
    }

    if (targetTool === 'get_services') {
      const servicesJson = await executeAITool('get_services');
      const services = JSON.parse(servicesJson);
      if (Array.isArray(services) && services.length) {
        const sList = services
          .map((s) => `✨ **${s.name}**\n${s.description}\n🛠️ *Tech:* ${(s.fullTechStack || []).join(', ')}`)
          .join('\n\n');
        return `Looking to build something great together? Here are Haider's core offerings: 💡🚀\n\n${sList}\n\n📬 Feel free to drop a message directly to get started!`;
      }
    }

    if (targetTool === 'get_pricing') {
      const pricingJson = await executeAITool('get_pricing');
      const plans = JSON.parse(pricingJson);
      if (Array.isArray(plans) && plans.length) {
        const pList = plans
          .map((p) => `🏷️ **${p.name}** ($${p.price}) — ${p.pages || 'Full'} delivery with ${p.hasDatabase ? 'Database' : 'Static'} & ${p.hasAuth ? 'Auth' : 'Standard'} integration.`)
          .join('\n');
        return `Here are the investment tiers for collaborating with Haider: 💰⚡\n\n${pList}\n\nCustom architectures can also be tailored to your exact roadmap!`;
      }
    }

    // Default Jolly Profile Synthesis
    const profileJson = await executeAITool('get_profile');
    const profile = JSON.parse(profileJson);
    return `👋 Hey there! I'm Ego, Haider's architectural copilot! 🚀✨\n\n**${profile.name || 'Haider Ali'}** is a ${profile.designation || 'Senior Full-Stack Engineer & System Architect'} who crafts resilient .NET 8 distributed systems and modern web apps.\n\n${profile.description || 'Dedicated to architecting high-impact, enterprise-grade digital ecosystems.'}\n\n• 📬 **Email:** ${profile.email || 'haiderali@example.com'}\n• 🟢 **Status:** ${profile.availabilityStatus || 'Available for exciting roles & collaborations'}\n• 🐙 **GitHub:** [github.com/${profile.github || 'Haiderali445'}](https://github.com/${profile.github || 'Haiderali445'})\n\nAsk me about his **projects**, **.NET skills**, or **career history** — I'd love to tell you all about them! 🎉`;
  }
}

export const aiService = new AIService();
import { BaseRepository } from '../core/base.repository';
import { TERMINAL_DEFAULT_CONFIG } from '../../utils/data/terminalData';
import { logger } from '../core/logger';

class TerminalService extends BaseRepository {
  constructor() {
    super('terminal_config', TERMINAL_DEFAULT_CONFIG);
  }

  async getTerminalConfig() {
    const start = performance.now();

    if (!this.useBackend && this.localMockData !== null) {
      return Promise.resolve(this.localMockData);
    }

    try {
      const { data: configData, error: configError } = await this.supabase
        .from('terminal_config')
        .select('*')
        .single();

      if (configError && configError.code !== 'PGRST116') throw configError;

      let protectedCommands = ["health", "siteconfig"];
      if (configData) {
        const { data: cmdData } = await this.supabase
          .from('terminal_protected_commands')
          .select('command')
          .eq('terminal_config_id', configData.id);
        
        if (cmdData && cmdData.length > 0) {
          protectedCommands = cmdData.map(c => c.command);
        }
      }

      // Fully dynamic map driven entirely by the database table rows
      let sectionMap = {};
      
      if (configData) {
        const { data: mapData } = await this.supabase
          .from('terminal_section_map')
          .select('map_key, map_value')
          .eq('terminal_config_id', configData.id);

        if (mapData && mapData.length > 0) {
          sectionMap = mapData.reduce((acc, curr) => {
            acc[curr.map_key] = curr.map_value;
            return acc;
          }, {});
        }
      }

      const duration = (performance.now() - start).toFixed(2);
      logger.morgan('GET', `/api/terminal_config`, 200, duration);

      if (!configData) return this.localMockData;

      return {
        ...configData,
        protectedCommands,
        sectionMap
      };
    } catch (error) {
      const duration = (performance.now() - start).toFixed(2);
      logger.morgan('GET', `/api/terminal_config`, 500, duration);
      logger.error(this.endpoint, 'Failed to fetch terminal config, using fallback', error);
      return this.localMockData;
    }
  }

  processCommand(action, target, portfolioData, isAuthenticated) {
    switch (action) {
      case "help":
        return {
          type: "system",
          text: "Available System Commands:\n[Public]\n - goto [section] : Scroll to section\n - resume / cv    : Open your resume\n - github / repos : Open repository link\n - socials / links: Show professional links\n - login          : Authenticate as root\n - refresh        : Reload application\n - cls / clear    : Clear screen\n\n[Protected]\n - health         : Run system audit\n - siteconfig     : View build stack specs"
        };
      case "skills":
        const skillsList = portfolioData?.skills?.map(s => s.name || s.skill_name).join(', ') || ".NET Core, Node.js, React, TypeScript";
        return {
          type: "system",
          text: `Core Technical Stack:\n${skillsList}`
        };
      case "siteconfig":
        const site = portfolioData?.site || portfolioData?.personal || {};
        return {
          type: "system",
          text: `Environment Metrics:\n - OS: ${site.devStack_os || 'Linux'}\n - Shell: ${site.devStack_shell || 'Zsh'}\n - Editor: ${site.devStack_editor || 'Cursor'}`
        };
      case "health":
      case "status":
        return {
          type: "success",
          text: `System Health Audit:\n[OK] Database: Connected (Supabase)\n[OK] Root Privileges: ${isAuthenticated ? 'Active' : 'Locked'}`
        };
      default:
        return null;
    }
  }
}

export const terminalService = new TerminalService();
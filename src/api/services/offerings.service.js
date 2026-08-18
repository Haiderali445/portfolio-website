import { BaseRepository } from '../core/base.repository';
import { servicesData } from '../../utils/data/services-data';
import { logger } from '../core/logger';

class OfferingsService extends BaseRepository {
  constructor() {
    super('services', servicesData);
  }

  async getServices() {
    const start = performance.now();

    if (!this.useBackend && this.localMockData !== null) {
      logger.info(this.endpoint, `[Mock Mode] Serving local mock data for services`);
      return Promise.resolve(this.localMockData);
    }

    try {
      const { data: services, error } = await this.supabase
        .from('services')
        .select('*');

      if (error) throw error;
      if (!services || services.length === 0) return this.localMockData;

      const serviceIds = services.map(s => s.id);
      const [techRes, stepsRes] = await Promise.all([
        this.supabase.from('service_full_tech_stack').select('*').in('service_id', serviceIds),
        this.supabase.from('service_implementation_steps').select('*').in('service_id', serviceIds)
      ]);

      const formattedServices = services.map(service => ({
        ...service,
        fullTechStack: techRes.data?.filter(t => t.service_id === service.id).map(t => t.tech) || [],
        implementationSteps: stepsRes.data?.filter(s => s.service_id === service.id).map(s => ({
          title: s.title,
          description: s.description
        })) || []
      }));

      const duration = (performance.now() - start).toFixed(2);
      logger.morgan('GET', `/api/services/with-relations`, 200, duration);
      logger.success(this.endpoint, `Successfully fetched offerings with tech stack and steps (${formattedServices.length} records)`);

      return formattedServices;
    } catch (error) {
      const duration = (performance.now() - start).toFixed(2);
      logger.morgan('GET', `/api/services/with-relations`, 500, duration);
      logger.error(this.endpoint, 'Failed to fetch services from Supabase, using local fallback', error);
      return this.localMockData;
    }
  }

  async getServiceById(id) {
    const services = await this.getServices();
    return services.find(s => s.id === Number(id)) || null;
  }
}

export const offeringsService = new OfferingsService();
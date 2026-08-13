import { BaseRepository } from '../core/base.repository';
import { servicesData } from '../../utils/data/services-data';

class OfferingsService extends BaseRepository {
  constructor() {
    super('/services', servicesData);
  }

  async getServices() {
    return this.getAll();
  }

  async getServiceById(id) {
    return this.getById(id);
  }
}

export const offeringsService = new OfferingsService();
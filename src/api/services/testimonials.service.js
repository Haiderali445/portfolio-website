import { BaseRepository } from '../core/base.repository';
import { testimonialData } from '../../utils/data/testem-data';

class TestimonialsService extends BaseRepository {
  constructor() {
    super('/testimonials', testimonialData);
  }

  async getTestimonials() {
    return this.getAll();
  }
}

export const testimonialsService = new TestimonialsService();
import { supabase } from './supabase.client';
import { logger } from './logger';

export class BaseRepository {
  constructor(endpoint, localMockData = null, forceBackend = false) {
    this.supabase = supabase;
    this.endpoint = endpoint; // e.g., 'profile', 'projects'
    this.localMockData = localMockData;
    // Checks environment flag or constructor override
    this.useBackend = forceBackend || import.meta.env.VITE_USE_BACKEND === 'true';
  }

  async getAll(params = {}) {
    const start = performance.now();
    const operationName = `GET_ALL_${this.endpoint.toUpperCase()}`;

    if (!this.useBackend && this.localMockData !== null) {
      logger.info(this.endpoint, `[Mock Mode] Serving local data for ${this.endpoint}`);
      return Promise.resolve(this.localMockData);
    }

    try {
      // Default query to Supabase table matching endpoint name
      let query = this.supabase.from(this.endpoint).select('*');

      // Optional basic filtering if params are provided
      if (params && Object.keys(params).length > 0) {
        Object.entries(params).forEach(([key, value]) => {
          query = query.eq(key, value);
        });
      }

      const { data, error } = await query;
      if (error) throw error;

      const duration = (performance.now() - start).toFixed(2);
      logger.morgan('GET', `/api/${this.endpoint}`, 200, duration);
      
      // If table is empty and mock data exists, fallback gracefully
      if ((!data || data.length === 0) && this.localMockData !== null) {
        logger.info(this.endpoint, `Table empty or missing. Falling back to local mock data.`);
        return this.localMockData;
      }

      logger.success(this.endpoint, `Successfully fetched all records for ${this.endpoint}`);
      return data;
    } catch (error) {
      const duration = (performance.now() - start).toFixed(2);
      logger.morgan('GET', `/api/${this.endpoint}`, 500, duration);
      logger.error(this.endpoint, `Failed during ${operationName}`, error);

      if (this.localMockData !== null) {
        logger.info(this.endpoint, `Falling back to local mock data due to error.`);
        return Promise.resolve(this.localMockData);
      }
      throw error;
    }
  }

  async getById(id) {
    const start = performance.now();
    const operationName = `GET_BY_ID_${this.endpoint.toUpperCase()}`;

    if (!this.useBackend && this.localMockData !== null) {
      return Promise.resolve(this.localMockData);
    }

    try {
      const { data, error } = await this.supabase
        .from(this.endpoint)
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;

      const duration = (performance.now() - start).toFixed(2);
      logger.morgan('GET', `/api/${this.endpoint}/${id}`, 200, duration);
      logger.success(this.endpoint, `Successfully fetched record ID: ${id} from ${this.endpoint}`);
      return data;
    } catch (error) {
      const duration = (performance.now() - start).toFixed(2);
      logger.morgan('GET', `/api/${this.endpoint}/${id}`, 500, duration);
      logger.error(this.endpoint, `Failed during ${operationName}`, error);
      throw error;
    }
  }

  async create(payload) {
    const start = performance.now();
    const operationName = `CREATE_${this.endpoint.toUpperCase()}`;

    try {
      const { data, error } = await this.supabase
        .from(this.endpoint)
        .insert([payload])
        .select()
        .single();

      if (error) throw error;

      const duration = (performance.now() - start).toFixed(2);
      logger.morgan('POST', `/api/${this.endpoint}`, 201, duration);
      logger.success(this.endpoint, `Successfully created record in ${this.endpoint}`);
      return data;
    } catch (error) {
      const duration = (performance.now() - start).toFixed(2);
      logger.morgan('POST', `/api/${this.endpoint}`, 500, duration);
      logger.error(this.endpoint, `Failed during ${operationName}`, error);
      throw error;
    }
  }

  async update(id, payload) {
    const start = performance.now();
    const operationName = `UPDATE_${this.endpoint.toUpperCase()}`;

    try {
      const { data, error } = await this.supabase
        .from(this.endpoint)
        .update(payload)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const duration = (performance.now() - start).toFixed(2);
      logger.morgan('PUT', `/api/${this.endpoint}/${id}`, 200, duration);
      logger.success(this.endpoint, `Successfully updated record ID: ${id} in ${this.endpoint}`);
      return data;
    } catch (error) {
      const duration = (performance.now() - start).toFixed(2);
      logger.morgan('PUT', `/api/${this.endpoint}/${id}`, 500, duration);
      logger.error(this.endpoint, `Failed during ${operationName}`, error);
      throw error;
    }
  }

  async remove(id) {
    const start = performance.now();
    const operationName = `DELETE_${this.endpoint.toUpperCase()}`;

    try {
      const { data, error } = await this.supabase
        .from(this.endpoint)
        .delete()
        .eq('id', id)
        .select();

      if (error) throw error;

      const duration = (performance.now() - start).toFixed(2);
      logger.morgan('DELETE', `/api/${this.endpoint}/${id}`, 200, duration);
      logger.success(this.endpoint, `Successfully deleted record ID: ${id} from ${this.endpoint}`);
      return data;
    } catch (error) {
      const duration = (performance.now() - start).toFixed(2);
      logger.morgan('DELETE', `/api/${this.endpoint}/${id}`, 500, duration);
      logger.error(this.endpoint, `Failed during ${operationName}`, error);
      throw error;
    }
  }
}
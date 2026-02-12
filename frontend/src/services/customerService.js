import api from './api';

export const customerService = {
  // Get all customers with optional filters
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/customers', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch customers' };
    }
  },

  // Get single customer by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/customers/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch customer' };
    }
  },

  // Create new customer
  create: async (customerData) => {
    try {
      const response = await api.post('/customers', customerData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to create customer' };
    }
  },

  // Update customer
  update: async (id, customerData) => {
    try {
      const response = await api.put(`/customers/${id}`, customerData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to update customer' };
    }
  },

  // Delete customer
  delete: async (id) => {
    try {
      const response = await api.delete(`/customers/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to delete customer' };
    }
  },

  // Get customers by area
  getByArea: async (area) => {
    try {
      const response = await api.get(`/customers/area/${area}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch customers by area' };
    }
  },

  // Get customer statistics
  getStats: async () => {
    try {
      const response = await api.get('/customers/stats/summary');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch customer statistics' };
    }
  },

  // Search customers
  search: async (searchTerm) => {
    try {
      const response = await api.get('/customers', {
        params: { search: searchTerm }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Search failed' };
    }
  },

  // Get paginated customers
  getPaginated: async (page = 1, limit = 50) => {
    try {
      const response = await api.get('/customers', {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch paginated customers' };
    }
  },

  // Bulk update customer status
  bulkUpdateStatus: async (customerIds, status) => {
    try {
      const response = await api.post('/customers/bulk-update', {
        customerIds,
        status
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to bulk update customers' };
    }
  },

  // Export customers as CSV
  exportCSV: async () => {
    try {
      const response = await api.get('/customers/export/csv', {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to export customers' };
    }
  }
};

export default customerService;
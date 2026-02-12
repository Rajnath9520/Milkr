import api from './api';

export const deliveryService = {
  // Get all milk records/deliveries
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/milk-records', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch delivery records' };
    }
  },

  // Get single delivery record
  getById: async (id) => {
    try {
      const response = await api.get(`/milk-records/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch delivery record' };
    }
  },

  // Create new delivery record
  create: async (recordData) => {
    try {
      const response = await api.post('/milk-records', recordData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to create delivery record' };
    }
  },

  // Update delivery record
  update: async (id, recordData) => {
    try {
      const response = await api.put(`/milk-records/${id}`, recordData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to update delivery record' };
    }
  },

  // Delete delivery record
  delete: async (id) => {
    try {
      const response = await api.delete(`/milk-records/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to delete delivery record' };
    }
  },

  // Create bulk records for all customers on a date
  bulkCreate: async (date, status = 'Pending') => {
    try {
      const response = await api.post('/milk-records/bulk-create', { date, status });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to create bulk records' };
    }
  },

  // Get all records for specific customer
  getByCustomer: async (customerId, params = {}) => {
    try {
      const response = await api.get(`/milk-records/customer/${customerId}`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch customer records' };
    }
  },

  // Get all records for specific date
  getByDate: async (date) => {
    try {
      const response = await api.get(`/milk-records/daily/${date}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch daily records' };
    }
  },

  // Get delivery statistics
  getStats: async (params = {}) => {
    try {
      const response = await api.get('/milk-records/stats/summary', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch delivery statistics' };
    }
  },

  // Update delivery status
  updateStatus: async (id, status) => {
    try {
      const response = await api.put(`/milk-records/${id}`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to update status' };
    }
  },

  // Mark delivery as completed
  markDelivered: async (id) => {
    try {
      const response = await api.put(`/milk-records/${id}`, {
        status: 'Delivered',
        deliveryTime: new Date()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to mark as delivered' };
    }
  },

  // Get pending deliveries
  getPending: async () => {
    try {
      const response = await api.get('/milk-records', {
        params: { status: 'Pending' }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch pending deliveries' };
    }
  },

  // Get today's deliveries
  getToday: async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await api.get(`/milk-records/daily/${today}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch today\'s deliveries' };
    }
  }
};

export default deliveryService;
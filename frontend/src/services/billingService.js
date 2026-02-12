import api from './api';

export const billingService = {
  // Get monthly billing for all customers
  getMonthlyBilling: async (year, month) => {
    try {
      const response = await api.get(`/billing/monthly/${year}/${month}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch monthly billing' };
    }
  },

  // Get billing for specific customer
  getCustomerBilling: async (customerId, params = {}) => {
    try {
      const response = await api.get(`/billing/customer/${customerId}`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch customer billing' };
    }
  },

  // Record payment for customer
  recordPayment: async (customerId, paymentData) => {
    try {
      const response = await api.post(`/billing/customer/${customerId}/payment`, paymentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to record payment' };
    }
  },

  // Get pending payments
  getPendingPayments: async () => {
    try {
      const response = await api.get('/billing/pending');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch pending payments' };
    }
  },

  // Get billing by area
  getAreaBilling: async (area, params = {}) => {
    try {
      const response = await api.get(`/billing/area/${area}`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch area billing' };
    }
  },

  // Get daily revenue
  getDailyRevenue: async (params = {}) => {
    try {
      const response = await api.get('/billing/revenue/daily', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch daily revenue' };
    }
  },

  // Generate invoice
  generateInvoice: async (customerId, year, month) => {
    try {
      const response = await api.get(`/billing/invoice/${customerId}/${year}/${month}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to generate invoice' };
    }
  },

  // Download invoice as PDF
  downloadInvoice: async (customerId, year, month) => {
    try {
      const response = await api.get(`/billing/invoice/${customerId}/${year}/${month}/download`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to download invoice' };
    }
  },

  // Get billing summary
  getSummary: async (params = {}) => {
    try {
      const response = await api.get('/billing/summary', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch billing summary' };
    }
  },

  // Get overdue payments
  getOverdue: async () => {
    try {
      const response = await api.get('/billing/overdue');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch overdue payments' };
    }
  },

  // Generate report for date range
  generateReport: async (startDate, endDate) => {
    try {
      const response = await api.post('/billing/report', { startDate, endDate });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to generate report' };
    }
  },

  // Export billing data as CSV
  exportBillingCSV: async (year, month) => {
    try {
      const response = await api.get(`/billing/export/${year}/${month}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to export billing data' };
    }
  }
};

export default billingService;
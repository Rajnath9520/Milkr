import { useState, useEffect } from 'react';
import { customerAPI } from '../services/api';

export const useCustomers = (initialParams = {}) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});

  const fetchCustomers = async (params = initialParams) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await customerAPI.getAll(params);
      setCustomers(data.customers);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  };

  const createCustomer = async (customerData) => {
    try {
      const { data } = await customerAPI.create(customerData);
      setCustomers(prev => [data.customer, ...prev]);
      return { success: true, customer: data.customer };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.error || 'Failed to create customer' 
      };
    }
  };

  const updateCustomer = async (id, customerData) => {
    try {
      const { data } = await customerAPI.update(id, customerData);
      setCustomers(prev => 
        prev.map(c => c._id === id ? data.customer : c)
      );
      return { success: true, customer: data.customer };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.error || 'Failed to update customer' 
      };
    }
  };

  const deleteCustomer = async (id) => {
    try {
      await customerAPI.delete(id);
      setCustomers(prev => prev.filter(c => c._id !== id));
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.error || 'Failed to delete customer' 
      };
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return {
    customers,
    loading,
    error,
    pagination,
    fetchCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
  };
};
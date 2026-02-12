import React, { createContext, useContext, useState, useEffect } from 'react';
import { customerService } from '../services/customerService';
import { useAuth } from './AuthContext';
import { useToast } from '../hooks/useToast';

const CustomerContext = createContext();

export const useCustomers = () => {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error('useCustomers must be used within CustomerProvider');
  }
  return context;
};

export const CustomerProvider = ({ children }) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCustomers = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const data = await customerService.getAll(params);
      // show no toast on fetch success (silent)
      setCustomers(data.customers || []);
    } catch (err) {
      setError(err.error || 'Failed to fetch customers');
      console.error('Fetch customers error:', err);
      toastError?.(err.error || err.message || 'Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  };

  const addCustomer = async (customerData) => {
    try {
      // Normalize payload: convert lat/lng fields into nested location object
      const payload = { ...customerData };
      if (payload.lat !== undefined || payload.lng !== undefined) {
        payload.location = {
          lat: payload.lat !== undefined ? Number(payload.lat) : payload.location?.lat,
          lng: payload.lng !== undefined ? Number(payload.lng) : payload.location?.lng,
        };
        delete payload.lat;
        delete payload.lng;
      }
      if (payload.milkPerDay !== undefined) payload.milkPerDay = Number(payload.milkPerDay);

      const data = await customerService.create(payload);
      setCustomers(prev => [...prev, data.customer]);
      toastSuccess?.('Customer added');
      return { success: true, customer: data.customer };
    } catch (err) {
      console.error('Add customer error:', err);
      toastError?.(err.error || err.message || 'Failed to add customer');
      return { success: false, error: err.error || 'Failed to add customer' };
    }
  };

  const updateCustomer = async (id, customerData) => {
    try {
      const payload = { ...customerData };
      if (payload.lat !== undefined || payload.lng !== undefined) {
        payload.location = {
          lat: payload.lat !== undefined ? Number(payload.lat) : payload.location?.lat,
          lng: payload.lng !== undefined ? Number(payload.lng) : payload.location?.lng,
        };
        delete payload.lat;
        delete payload.lng;
      }
      if (payload.milkPerDay !== undefined) payload.milkPerDay = Number(payload.milkPerDay);

      const data = await customerService.update(id, payload);
      setCustomers(prev => 
        prev.map(c => c._id === id || c.id === id ? data.customer : c)
      );
      toastSuccess?.('Customer updated');
      return { success: true, customer: data.customer };
    } catch (err) {
      console.error('Update customer error:', err);
      toastError?.(err.error || err.message || 'Failed to update customer');
      return { success: false, error: err.error || 'Failed to update customer' };
    }
  };

  const deleteCustomer = async (id) => {
    try {
      await customerService.delete(id);
      setCustomers(prev => prev.filter(c => c._id !== id && c.id !== id));
      toastSuccess?.('Customer removed');
      return { success: true };
    } catch (err) {
      console.error('Delete customer error:', err);
      toastError?.(err.error || err.message || 'Failed to delete customer');
      return { success: false, error: err.error || 'Failed to delete customer' };
    }
  };

  const searchCustomers = async (searchTerm) => {
    try {
      const data = await customerService.search(searchTerm);
      return { success: true, customers: data.customers };
    } catch (err) {
      toastError?.(err.error || err.message || 'Search failed');
      return { success: false, error: err.error || 'Search failed' };
    }
  };

  useEffect(() => {
    // Fetch customers when auth user changes so each user sees only their customers
    // (AuthContext provides user info and token)
    // We'll call fetchCustomers without params; backend will filter based on req.user
    // Note: ensure this effect runs once when mounted and again when auth user changes.
    // fetchCustomers();
  }, []);

  // New effect: when auth user changes, refresh customer list
  const { user } = useAuth();
  const { success: toastSuccess, error: toastError } = useToast();
  useEffect(() => {
    if (user) {
      fetchCustomers();
    } else {
      setCustomers([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const value = {
    customers,
    loading,
    error,
    fetchCustomers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    searchCustomers,
  };

  return (
    <CustomerContext.Provider value={value}>
      {children}
    </CustomerContext.Provider>
  );
};
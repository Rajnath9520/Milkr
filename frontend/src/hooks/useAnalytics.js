import { useState, useEffect } from 'react';
import { analyticsAPI } from '../services/api';

export const useAnalytics = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await analyticsAPI.getDashboard();
      setDashboard(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  const getMonthlyComparison = async (months = 6) => {
    try {
      const { data } = await analyticsAPI.getMonthlyComparison(months);
      return { success: true, data: data.monthlyComparison };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.error || 'Failed to fetch comparison' 
      };
    }
  };

  const getAreaWise = async (params) => {
    try {
      const { data } = await analyticsAPI.getAreaWise(params);
      return { success: true, data: data.areaStats };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.error || 'Failed to fetch area stats' 
      };
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return {
    dashboard,
    loading,
    error,
    fetchDashboard,
    getMonthlyComparison,
    getAreaWise,
  };
};
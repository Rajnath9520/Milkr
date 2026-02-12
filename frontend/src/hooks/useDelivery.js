import { useState, useEffect } from 'react';
import { milkRecordAPI } from '../services/api';

export const useDelivery = (initialParams = {}) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRecords = async (params = initialParams) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await milkRecordAPI.getAll(params);
      setRecords(data.records);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch records');
    } finally {
      setLoading(false);
    }
  };

  const createRecord = async (recordData) => {
    try {
      const { data } = await milkRecordAPI.create(recordData);
      setRecords(prev => [data.record, ...prev]);
      return { success: true, record: data.record };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.error || 'Failed to create record' 
      };
    }
  };

  const updateRecord = async (id, recordData) => {
    try {
      const { data } = await milkRecordAPI.update(id, recordData);
      setRecords(prev => 
        prev.map(r => r._id === id ? data.record : r)
      );
      return { success: true, record: data.record };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.error || 'Failed to update record' 
      };
    }
  };

  const bulkCreateRecords = async (date, status = 'Pending') => {
    try {
      const { data } = await milkRecordAPI.bulkCreate(date, status);
      await fetchRecords();
      return { success: true, count: data.count };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.error || 'Failed to create bulk records' 
      };
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  return {
    records,
    loading,
    error,
    fetchRecords,
    createRecord,
    updateRecord,
    bulkCreateRecords,
  };
};
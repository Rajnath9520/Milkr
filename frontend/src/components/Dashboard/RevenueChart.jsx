import { format, parseISO, isValid } from 'date-fns';
import { DATE_FORMATS } from './constants';

// Date formatting
export const formatDate = (date, formatString = DATE_FORMATS.DISPLAY) => {
  if (!date) return '';
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return isValid(parsedDate) ? format(parsedDate, formatString) : '';
};

export const formatDateTime = (date) => {
  return formatDate(date, DATE_FORMATS.DATETIME);
};

export const getTodayDate = () => {
  return format(new Date(), DATE_FORMATS.API);
};

export const getMonthYear = (date = new Date()) => {
  return {
    month: date.getMonth() + 1,
    year: date.getFullYear(),
  };
};

// Number formatting
export const formatCurrency = (amount, currency = '₹') => {
  if (typeof amount !== 'number') return `${currency}0`;
  return `${currency}${amount.toLocaleString('en-IN')}`;
};

export const formatNumber = (number) => {
  if (typeof number !== 'number') return '0';
  return number.toLocaleString('en-IN');
};

export const roundToDecimal = (number, decimals = 2) => {
  return Math.round(number * Math.pow(10, decimals)) / Math.pow(10, decimals);
};

// String formatting
export const capitalizeFirst = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const truncate = (str, length = 50) => {
  if (!str || str.length <= length) return str;
  return `${str.substring(0, length)}...`;
};

export const getInitials = (name) => {
  if (!name) return '';
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
};

// Validation helpers
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone) => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone);
};

export const isValidPassword = (password) => {
  // At least 6 characters
  return password && password.length >= 6;
};

// Array helpers
export const sortByKey = (array, key, order = 'asc') => {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (order === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });
};

export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const group = item[key];
    result[group] = result[group] || [];
    result[group].push(item);
    return result;
  }, {});
};

export const filterBySearch = (array, searchTerm, keys) => {
  if (!searchTerm) return array;
  
  const term = searchTerm.toLowerCase();
  return array.filter(item => 
    keys.some(key => 
      String(item[key]).toLowerCase().includes(term)
    )
  );
};

// Calculation helpers
export const calculateMonthlyBill = (milkPerDay, pricePerLitre, days = 30) => {
  return roundToDecimal(milkPerDay * pricePerLitre * days);
};

export const calculateTotalLitres = (customers, days = 30) => {
  return customers.reduce((total, customer) => 
    total + (customer.milkPerDay * days), 0
  );
};

export const calculateRevenue = (records) => {
  return records.reduce((total, record) => 
    total + (record.totalAmount || 0), 0
  );
};

export const getPercentageChange = (current, previous) => {
  if (previous === 0) return 100;
  return roundToDecimal(((current - previous) / previous) * 100);
};

// Status helpers
export const getStatusColor = (status) => {
  const statusColors = {
    Active: 'green',
    Inactive: 'gray',
    Suspended: 'red',
    Delivered: 'green',
    Pending: 'yellow',
    Cancelled: 'red',
    Skipped: 'gray',
    Paid: 'green',
    Partial: 'orange',
  };
  return statusColors[status] || 'gray';
};

export const getStatusBadgeClass = (status) => {
  const color = getStatusColor(status);
  return `bg-${color}-100 text-${color}-700`;
};

// Local storage helpers
export const storage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error getting from storage:', error);
      return null;
    }
  },
  
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error setting to storage:', error);
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from storage:', error);
    }
  },
  
  clear: () => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  },
};

// Download helpers
export const downloadAsJSON = (data, filename) => {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const downloadAsCSV = (data, filename) => {
  if (!data || data.length === 0) return;
  
  const headers = Object.keys(data[0]).join(',');
  const rows = data.map(row => 
    Object.values(row).map(val => `"${val}"`).join(',')
  );
  
  const csv = [headers, ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Error handling
export const getErrorMessage = (error) => {
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function
export const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};
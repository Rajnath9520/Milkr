import { format, parseISO, isValid, differenceInDays } from 'date-fns';

// ============================================
// DATE FORMATTING
// ============================================

export const formatDate = (date, formatString = 'dd MMM yyyy') => {
  if (!date) return '';
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return isValid(parsedDate) ? format(parsedDate, formatString) : '';
};

export const formatDateTime = (date) => {
  return formatDate(date, 'dd MMM yyyy, hh:mm a');
};

export const formatTime = (date) => {
  return formatDate(date, 'hh:mm a');
};

export const getTodayDate = () => {
  return format(new Date(), 'yyyy-MM-dd');
};

export const getMonthYear = (date = new Date()) => {
  return {
    month: date.getMonth() + 1,
    year: date.getFullYear(),
  };
};

export const getDaysAgo = (date) => {
  return differenceInDays(new Date(), parseISO(date));
};

export const getRelativeTime = (date) => {
  const days = getDaysAgo(date);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return `${Math.floor(days / 365)} years ago`;
};

// ============================================
// NUMBER FORMATTING
// ============================================

export const formatCurrency = (amount, currency = '₹') => {
  if (typeof amount !== 'number') return `${currency}0`;
  return `${currency}${amount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
};

export const formatNumber = (number) => {
  if (typeof number !== 'number') return '0';
  return number.toLocaleString('en-IN');
};

export const roundToDecimal = (number, decimals = 2) => {
  return Math.round(number * Math.pow(10, decimals)) / Math.pow(10, decimals);
};

export const formatPercentage = (value, total) => {
  if (total === 0) return '0%';
  return `${roundToDecimal((value / total) * 100, 1)}%`;
};

export const formatCompactNumber = (num) => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

// ============================================
// STRING FORMATTING
// ============================================

export const capitalizeFirst = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const capitalizeWords = (str) => {
  if (!str) return '';
  return str.split(' ').map(word => capitalizeFirst(word)).join(' ');
};

export const truncate = (str, length = 50, suffix = '...') => {
  if (!str || str.length <= length) return str;
  return `${str.substring(0, length)}${suffix}`;
};

export const getInitials = (name) => {
  if (!name) return '';
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
};

export const slugify = (str) => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// ============================================
// VALIDATION
// ============================================

export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone) => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone);
};

export const isValidPassword = (password) => {
  return password && password.length >= 6;
};

export const isValidURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// ============================================
// ARRAY HELPERS
// ============================================

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

export const removeDuplicates = (array, key) => {
  return [...new Map(array.map(item => [item[key], item])).values()];
};

export const chunk = (array, size) => {
  return Array.from({ length: Math.ceil(array.length / size) }, (_, index) =>
    array.slice(index * size, index * size + size)
  );
};

// ============================================
// CALCULATION HELPERS
// ============================================

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
  if (previous === 0) return current > 0 ? 100 : 0;
  return roundToDecimal(((current - previous) / previous) * 100);
};

export const calculateAverage = (numbers) => {
  if (numbers.length === 0) return 0;
  return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
};

// ============================================
// STATUS HELPERS
// ============================================

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

// ============================================
// LOCAL STORAGE
// ============================================

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

// ============================================
// DOWNLOAD HELPERS
// ============================================

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

// ============================================
// ERROR HANDLING
// ============================================

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

// ============================================
// DEBOUNCE & THROTTLE
// ============================================

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

// ============================================
// UTILITY FUNCTIONS
// ============================================

export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy:', error);
    return false;
  }
};

export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const isEmpty = (value) => {
  return value === null || value === undefined || 
         (typeof value === 'string' && value.trim() === '') ||
         (Array.isArray(value) && value.length === 0) ||
         (typeof value === 'object' && Object.keys(value).length === 0);
};

export default {
  formatDate,
  formatDateTime,
  formatCurrency,
  formatNumber,
  capitalizeFirst,
  truncate,
  getInitials,
  isValidEmail,
  isValidPhone,
  sortByKey,
  groupBy,
  filterBySearch,
  calculateMonthlyBill,
  getStatusColor,
  storage,
  downloadAsJSON,
  downloadAsCSV,
  debounce,
  throttle,
};
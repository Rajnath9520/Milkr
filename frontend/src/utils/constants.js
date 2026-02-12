export const APP_NAME = 'Milkr';
export const APP_VERSION = '1.0.0';

export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  DELIVERY: 'delivery',
};

export const CUSTOMER_STATUS = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  SUSPENDED: 'Suspended',
};

export const DELIVERY_STATUS = {
  DELIVERED: 'Delivered',
  PENDING: 'Pending',
  CANCELLED: 'Cancelled',
  SKIPPED: 'Skipped',
};

export const PAYMENT_STATUS = {
  PAID: 'Paid',
  PENDING: 'Pending',
  PARTIAL: 'Partial',
};

export const DEFAULT_PRICE_PER_LITRE = 60;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 50,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
};

export const DATE_FORMATS = {
  DISPLAY: 'DD MMM YYYY',
  API: 'YYYY-MM-DD',
  DATETIME: 'DD MMM YYYY, hh:mm A',
};

export const COLORS = {
  primary: '#3B82F6',
  secondary: '#06B6D4',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#3B82F6',
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  CUSTOMERS: '/customers',
  DELIVERY: '/delivery',
  BILLING: '/billing',
  ANALYTICS: '/analytics',
  PROFILE: '/profile',
  SETTINGS: '/settings',
};

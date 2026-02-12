export const validators = {
  required: (value) => {
    return value ? null : 'This field is required';
  },
  
  email: (value) => {
    if (!value) return null;
    return isValidEmail(value) ? null : 'Invalid email address';
  },
  
  phone: (value) => {
    if (!value) return null;
    return isValidPhone(value) ? null : 'Invalid phone number (10 digits starting with 6-9)';
  },
  
  password: (value) => {
    if (!value) return null;
    if (value.length < 6) return 'Password must be at least 6 characters';
    return null;
  },
  
  minValue: (min) => (value) => {
    if (!value) return null;
    return parseFloat(value) >= min ? null : `Must be at least ${min}`;
  },
  
  maxValue: (max) => (value) => {
    if (!value) return null;
    return parseFloat(value) <= max ? null : `Must be at most ${max}`;
  },
  
  minLength: (min) => (value) => {
    if (!value) return null;
    return value.length >= min ? null : `Must be at least ${min} characters`;
  },
  
  maxLength: (max) => (value) => {
    if (!value) return null;
    return value.length <= max ? null : `Must be at most ${max} characters`;
  },
  
  match: (fieldName) => (value, allValues) => {
    if (!value) return null;
    return value === allValues[fieldName] ? null : `Must match ${fieldName}`;
  },
};

export const validateForm = (values, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach(field => {
    const fieldRules = Array.isArray(rules[field]) ? rules[field] : [rules[field]];
    
    for (const rule of fieldRules) {
      const error = rule(values[field], values);
      if (error) {
        errors[field] = error;
        break;
      }
    }
  });
  
  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};
// src/components/common/Input.jsx
import React from 'react';

const Input = ({
  label,
  error,
  icon: Icon,
  iconPosition = 'left',
  type = 'text',
  className = '',
  required = false,
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-bold text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && iconPosition === 'left' && (
          <Icon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        )}
        <input
          type={type}
          className={`
            w-full px-5 py-4 
            ${Icon && iconPosition === 'left' ? 'pl-12' : ''}
            ${Icon && iconPosition === 'right' ? 'pr-12' : ''}
            border-2 
            ${error ? 'border-red-500' : 'border-gray-200'}
            rounded-2xl 
            focus:ring-4 
            ${error ? 'focus:ring-red-100 focus:border-red-500' : 'focus:ring-blue-100 focus:border-blue-500'}
            transition-all 
            text-gray-700 
            font-medium
            disabled:bg-gray-100
            disabled:cursor-not-allowed
            ${className}
          `}
          {...props}
        />
        {Icon && iconPosition === 'right' && (
          <Icon className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        )}
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};

export default Input;
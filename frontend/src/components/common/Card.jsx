// src/components/common/Card.jsx
import React from 'react';

const Card = ({ 
  children, 
  title, 
  subtitle,
  headerAction,
  className = '', 
  hover = true,
  padding = 'normal',
  ...props 
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    normal: 'p-6',
    lg: 'p-8',
  };

  return (
    <div 
      className={`
        bg-white 
        rounded-3xl 
        shadow-lg 
        border 
        border-gray-100 
        ${hover ? 'hover:shadow-2xl transform hover:scale-[1.02]' : ''} 
        transition-all 
        duration-300
        ${paddingClasses[padding]}
        ${className}
      `}
      {...props}
    >
      {(title || subtitle || headerAction) && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            {title && (
              <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
            )}
            {headerAction && <div>{headerAction}</div>}
          </div>
          {subtitle && (
            <p className="text-gray-600 text-sm">{subtitle}</p>
          )}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
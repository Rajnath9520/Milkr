import React from 'react';
import { Check, Clock, X, AlertCircle, Package } from 'lucide-react';

const DeliveryStatus = ({ status, size = 'md', showLabel = true, onClick }) => {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-12 h-12'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6'
  };

  const getStatusConfig = () => {
    switch (status) {
      case 'Delivered':
        return {
          icon: Check,
          bgColor: 'bg-green-100',
          iconColor: 'text-green-600',
          badgeColor: 'bg-green-100 text-green-700',
          label: 'Delivered'
        };
      case 'Pending':
        return {
          icon: Clock,
          bgColor: 'bg-yellow-100',
          iconColor: 'text-yellow-600',
          badgeColor: 'bg-yellow-100 text-yellow-700',
          label: 'Pending'
        };
      case 'Cancelled':
        return {
          icon: X,
          bgColor: 'bg-red-100',
          iconColor: 'text-red-600',
          badgeColor: 'bg-red-100 text-red-700',
          label: 'Cancelled'
        };
      case 'Skipped':
        return {
          icon: AlertCircle,
          bgColor: 'bg-gray-100',
          iconColor: 'text-gray-600',
          badgeColor: 'bg-gray-100 text-gray-700',
          label: 'Skipped'
        };
      default:
        return {
          icon: Package,
          bgColor: 'bg-blue-100',
          iconColor: 'text-blue-600',
          badgeColor: 'bg-blue-100 text-blue-700',
          label: 'Unknown'
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  if (showLabel) {
    return (
      <button
        onClick={onClick}
        disabled={!onClick}
        className={`
          px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300
          ${config.badgeColor}
          ${onClick ? 'hover:scale-105 cursor-pointer' : 'cursor-default'}
        `}
      >
        <div className="flex items-center space-x-2">
          <Icon className={iconSizes[size]} />
          <span>{config.label}</span>
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      className={`
        ${sizes[size]} ${config.bgColor} rounded-xl
        flex items-center justify-center
        ${onClick ? 'hover:scale-110 cursor-pointer' : 'cursor-default'}
        transition-all duration-300
      `}
    >
      <Icon className={`${iconSizes[size]} ${config.iconColor}`} />
    </button>
  );
};

export default DeliveryStatus;
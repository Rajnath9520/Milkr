// src/components/common/Toast.jsx
import React, { useEffect } from 'react';
import { Check, AlertCircle, Info, X } from 'lucide-react';

export const Toast = ({ message, type = 'info', onClose, duration = 3000 }) => {
  const icons = {
    success: Check,
    error: AlertCircle,
    info: Info,
    warning: AlertCircle,
  };

  const colors = {
    success: 'bg-green-500/90',
    error: 'bg-red-500/90',
    info: 'bg-blue-500/90',
    warning: 'bg-yellow-500/90',
  };

  const Icon = icons[type];

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <div
      className={`
        ${colors[type]} 
        text-white 
        px-6 py-4 
        rounded-2xl 
        shadow-2xl 
        backdrop-blur-lg 
        transform 
        transition-all 
        duration-300 
        animate-slide-down
        flex 
        items-center 
        justify-between 
        space-x-3
        min-w-[300px]
      `}
    >
      <div className="flex items-center space-x-3">
        <Icon className="w-5 h-5 flex-shrink-0" />
        <p className="font-semibold">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="p-1 hover:bg-white/20 rounded-lg transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;
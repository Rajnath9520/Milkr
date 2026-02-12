// src/components/common/Modal.jsx
import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
}) => {
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-full mx-4',
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={closeOnOverlayClick ? onClose : undefined}
      />
      
      {/* Modal Content */}
      <div 
        className={`
          relative 
          bg-white 
          rounded-3xl 
          shadow-2xl 
          w-full 
          ${sizes[size]} 
          max-h-[90vh] 
          overflow-hidden
          animate-scale-in
        `}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-cyan-500 px-8 py-6 flex items-center justify-between">
            {title && (
              <h3 className="text-3xl font-bold text-white">{title}</h3>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-3 hover:bg-white/20 rounded-xl transition-all duration-300"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="overflow-y-auto max-h-[calc(90vh-100px)]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
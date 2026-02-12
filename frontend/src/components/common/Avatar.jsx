import React from 'react';

const Avatar = ({
  name,
  src,
  size = 'md',
  className = '',
  onClick,
}) => {
  const sizes = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-xl',
    xl: 'w-24 h-24 text-3xl',
  };

  const getInitials = (name) =>
    name
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');

  return (
    <div
      className={`
        ${sizes[size]}
        bg-gradient-to-br from-blue-400 to-cyan-600
        rounded-2xl
        flex items-center justify-center
        text-white font-bold
        shadow-md
        ${onClick ? 'cursor-pointer hover:scale-110' : ''}
        transition-all duration-300
        ${className}
      `}
      onClick={onClick}
    >
      {src ? (
        <img
          src={src}
          alt={name}
          className="w-full h-full object-cover rounded-2xl"
        />
      ) : (
        <span>{getInitials(name)}</span>
      )}
    </div>
  );
};

export default Avatar;

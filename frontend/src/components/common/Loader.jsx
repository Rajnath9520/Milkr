import React from 'react';
import { Milk } from 'lucide-react';

const Loader = ({ size = 'md', text = 'Loading...', fullScreen = false }) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const content = (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className={`${sizes[size]} bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl flex items-center justify-center animate-bounce`}>
        <Milk className={`${iconSizes[size]} text-white`} />
      </div>
      {text && <p className="text-gray-600 font-semibold">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return content;
};
export default Loader;
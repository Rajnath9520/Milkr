import React from 'react';

const StatsCard = ({ icon: Icon, title, value, subtitle, color, delay }) => {
  return (
    <div 
      className="bg-white rounded-3xl shadow-lg p-6 transform transition-all duration-500 hover:scale-105 hover:shadow-2xl border border-gray-100 group"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-2">
            {title}
          </p>
          <h3 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent mb-1">
            {value}
          </h3>
          {subtitle && <p className="text-gray-400 text-xs font-medium">{subtitle}</p>}
        </div>
        <div className={`w-16 h-16 ${color} rounded-2xl flex items-center justify-center transform transition-all duration-500 group-hover:rotate-12 group-hover:scale-110 shadow-lg`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
      </div>
      <div className="mt-4 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    </div>
  );
};

export default StatsCard;
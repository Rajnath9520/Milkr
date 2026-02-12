import React from 'react';
import { Check, Clock } from 'lucide-react';

const RecentActivity = ({ activities = [] }) => {
  return (
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <div key={index} className="flex items-center space-x-4 p-4 rounded-2xl hover:bg-gray-50 transition-all">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            activity.status === 'success' ? 'bg-green-100' : 'bg-yellow-100'
          }`}>
            {activity.status === 'success' ? (
              <Check className="w-6 h-6 text-green-600" />
            ) : (
              <Clock className="w-6 h-6 text-yellow-600" />
            )}
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-800">{activity.customer}</p>
            <p className="text-sm text-gray-500">{activity.action}</p>
          </div>
          <span className="text-xs text-gray-400 font-medium">{activity.time}</span>
        </div>
      ))}
    </div>
  );
};

export default RecentActivity;
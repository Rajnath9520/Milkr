import React from 'react';
import { MapPin, Droplet, Settings, Navigation } from 'lucide-react';

const CustomerCard = ({ customer, onView, onEdit }) => {
  const openDirections = () => {
    const hasCoords = customer?.location && typeof customer.location.lat === 'number' && typeof customer.location.lng === 'number';
    const destination = hasCoords
      ? `${customer.location.lat},${customer.location.lng}`
      : encodeURIComponent(customer?.address || customer?.area || customer?.name || '');
    if (!destination) return;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };
  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border border-gray-100 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-cyan-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:rotate-12 transition-all duration-300">
            {customer.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-lg">{customer.name}</h3>
            <p className="text-sm text-gray-500">{customer.phone}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
          customer.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
        }`}>
          {customer.status}
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-2 text-gray-600">
          <MapPin className="w-4 h-4 text-blue-500" />
          <span className="text-sm">{customer.area}</span>
          <button
            type="button"
            onClick={openDirections}
            title="Get directions"
            className="ml-2 inline-flex items-center justify-center rounded-lg p-1.5 bg-green-50 text-green-600 hover:bg-green-100 transition-all"
          >
            <Navigation className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center space-x-2 text-gray-600">
          <Droplet className="w-4 h-4 text-cyan-500" />
          <span className="text-sm font-semibold">{customer.milkPerDay}L per day</span>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100 flex space-x-2">
        <button 
          onClick={() => onView?.(customer)}
          className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-xl font-semibold hover:bg-blue-100 transition-all"
        >
          View Details
        </button>
        <button 
          onClick={() => onEdit?.(customer)}
          className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-all"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default CustomerCard;
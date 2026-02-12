import React from 'react';
import { Package, Check, Clock, X, MapPin, Droplet } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import Avatar from '../common/Avatar';

const DeliveryList = ({ deliveries = [], onStatusChange, onViewDetails }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered':
        return <Check className="w-5 h-5 text-green-600" />;
      case 'Pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'Cancelled':
        return <X className="w-5 h-5 text-red-600" />;
      default:
        return <Package className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-700';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'Cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (deliveries.length === 0) {
    return (
      <Card>
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-600 mb-2">No Deliveries Found</h3>
          <p className="text-gray-500">Start by creating delivery records for your customers</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {deliveries.map((delivery) => (
        <Card key={delivery.id} hover padding="normal">
          <div className="flex items-center justify-between">
            {/* Customer Info */}
            <div className="flex items-center space-x-4 flex-1">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                delivery.deliveryStatus === 'Delivered' ? 'bg-green-100' :
                delivery.deliveryStatus === 'Pending' ? 'bg-yellow-100' :
                'bg-red-100'
              }`}>
                {getStatusIcon(delivery.deliveryStatus)}
              </div>

              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-1">
                  <h4 className="font-bold text-gray-800 text-lg">{delivery.customerName}</h4>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(delivery.deliveryStatus)}`}>
                    {delivery.deliveryStatus}
                  </span>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    <span>{delivery.area}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Droplet className="w-4 h-4 text-cyan-500" />
                    <span className="font-semibold">{delivery.litres}L</span>
                  </div>
                  {delivery.deliveryTime && (
                    <span className="text-gray-400">• {delivery.deliveryTime}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2 ml-4">
              {delivery.deliveryStatus === 'Pending' && (
                <Button
                  size="sm"
                  variant="success"
                  onClick={() => onStatusChange?.(delivery.id, 'Delivered')}
                >
                  Mark Delivered
                </Button>
              )}
              <Button
                size="sm"
                variant="secondary"
                onClick={() => onViewDetails?.(delivery)}
              >
                View Details
              </Button>
            </div>
          </div>

          {/* Additional Info */}
          {delivery.notes && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Notes:</span> {delivery.notes}
              </p>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
};

export default DeliveryList;
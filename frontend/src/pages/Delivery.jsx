
import React, { useState } from 'react';
import { Package, Plus, Calendar, Check, Clock, Filter } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const Delivery = ({ customers = [] }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [filter, setFilter] = useState('all'); // all, delivered, pending

  const deliveries = customers.map(customer => ({
    ...customer,
    deliveryStatus: Math.random() > 0.5 ? 'Delivered' : 'Pending',
    deliveryTime: Math.random() > 0.5 ? '8:30 AM' : null,
    litres: customer.milkPerDay
  }));

  const filteredDeliveries = deliveries.filter(d => {
    if (filter === 'delivered') return d.deliveryStatus === 'Delivered';
    if (filter === 'pending') return d.deliveryStatus === 'Pending';
    return true;
  });

  const stats = {
    total: deliveries.length,
    delivered: deliveries.filter(d => d.deliveryStatus === 'Delivered').length,
    pending: deliveries.filter(d => d.deliveryStatus === 'Pending').length,
    totalLitres: deliveries.reduce((sum, d) => sum + d.litres, 0)
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Delivery Management</h2>
          <p className="text-gray-600 mt-1">Track and manage daily milk deliveries</p>
        </div>
        <Button variant="primary" icon={Plus}>
          Create Bulk Delivery
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card hover={false} padding="normal">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-semibold">Total Deliveries</p>
              <h3 className="text-3xl font-bold text-gray-800">{stats.total}</h3>
            </div>
            <Package className="w-10 h-10 text-blue-500" />
          </div>
        </Card>
        <Card hover={false} padding="normal">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-semibold">Delivered</p>
              <h3 className="text-3xl font-bold text-green-600">{stats.delivered}</h3>
            </div>
            <Check className="w-10 h-10 text-green-500" />
          </div>
        </Card>
        <Card hover={false} padding="normal">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-semibold">Pending</p>
              <h3 className="text-3xl font-bold text-yellow-600">{stats.pending}</h3>
            </div>
            <Clock className="w-10 h-10 text-yellow-500" />
          </div>
        </Card>
        <Card hover={false} padding="normal">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-semibold">Total Litres</p>
              <h3 className="text-3xl font-bold text-cyan-600">{stats.totalLitres}L</h3>
            </div>
            <Package className="w-10 h-10 text-cyan-500" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <Input
            type="date"
            icon={Calendar}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="flex-1"
          />
          <div className="flex space-x-2">
            <Button
              variant={filter === 'all' ? 'primary' : 'secondary'}
              onClick={() => setFilter('all')}
            >
              All
            </Button>
            <Button
              variant={filter === 'delivered' ? 'success' : 'secondary'}
              onClick={() => setFilter('delivered')}
            >
              Delivered
            </Button>
            <Button
              variant={filter === 'pending' ? 'warning' : 'secondary'}
              onClick={() => setFilter('pending')}
            >
              Pending
            </Button>
          </div>
        </div>
      </Card>

      {/* Delivery List */}
      <Card title="Today's Deliveries">
        <div className="space-y-3">
          {filteredDeliveries.map((delivery) => (
            <div
              key={delivery.id}
              className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all"
            >
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  delivery.deliveryStatus === 'Delivered' ? 'bg-green-100' : 'bg-yellow-100'
                }`}>
                  {delivery.deliveryStatus === 'Delivered' ? (
                    <Check className="w-6 h-6 text-green-600" />
                  ) : (
                    <Clock className="w-6 h-6 text-yellow-600" />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">{delivery.name}</h4>
                  <p className="text-sm text-gray-500">{delivery.area} • {delivery.litres}L</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                {delivery.deliveryTime && (
                  <span className="text-sm text-gray-500">{delivery.deliveryTime}</span>
                )}
                <Button
                  size="sm"
                  variant={delivery.deliveryStatus === 'Delivered' ? 'success' : 'warning'}
                >
                  {delivery.deliveryStatus}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Delivery;
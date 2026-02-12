import React from 'react';
import { MapPin, Phone, Mail, Calendar, Droplet, DollarSign, TrendingUp } from 'lucide-react';
import Card from '../common/Card';
import Avatar from '../common/Avatar';

const CustomerDetails = ({ customer }) => {
  if (!customer) return null;

  const monthlyBill = customer.milkPerDay * 30 * 60;

  return (
    <div className="space-y-6">
      {/* Customer Header */}
      <Card>
        <div className="flex items-center space-x-6">
          <Avatar name={customer.name} size="xl" />
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-800">{customer.name}</h2>
            <p className="text-gray-600 mt-1">Customer ID: #{customer.id}</p>
            <div className="flex items-center space-x-4 mt-3">
              <span className={`px-4 py-1 rounded-full text-sm font-bold ${
                customer.status === 'Active' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {customer.status}
              </span>
              <span className="text-sm text-gray-500">
                Member since {new Date().getFullYear()}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Contact Information */}
      <Card title="Contact Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start space-x-3">
            <Phone className="w-5 h-5 text-blue-500 mt-1" />
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-semibold text-gray-800">{customer.phone}</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <MapPin className="w-5 h-5 text-blue-500 mt-1" />
            <div>
              <p className="text-sm text-gray-500">Address</p>
              <p className="font-semibold text-gray-800">{customer.address || 'N/A'}</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <MapPin className="w-5 h-5 text-blue-500 mt-1" />
            <div>
              <p className="text-sm text-gray-500">Area</p>
              <p className="font-semibold text-gray-800">{customer.area}</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Mail className="w-5 h-5 text-blue-500 mt-1" />
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-semibold text-gray-800">{customer.email || 'Not provided'}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Subscription Details */}
      <Card title="Subscription Details">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <Droplet className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-sm text-gray-600">Daily Requirement</p>
            <p className="text-2xl font-bold text-blue-600">{customer.milkPerDay}L</p>
          </div>
          <div className="bg-green-50 p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-sm text-gray-600">Monthly Bill</p>
            <p className="text-2xl font-bold text-green-600">₹{monthlyBill}</p>
          </div>
          <div className="bg-purple-50 p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
            <p className="text-sm text-gray-600">Rate per Litre</p>
            <p className="text-2xl font-bold text-purple-600">₹60</p>
          </div>
        </div>
      </Card>

      {/* Recent Deliveries */}
      <Card title="Recent Deliveries">
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
              <div>
                <p className="font-semibold text-gray-800">
                  {new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">{customer.milkPerDay}L delivered</p>
              </div>
              <span className="px-4 py-2 bg-green-100 text-green-700 rounded-xl text-sm font-bold">
                Delivered
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default CustomerDetails;

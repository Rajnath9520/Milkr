import React from 'react';
import { Edit2, Trash2, MapPin } from 'lucide-react';
import Avatar from '../common/Avatar';

const CustomerTable = ({ customers, onEdit, onDelete, onToggleStatus }) => {
  return (
    <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-blue-50 to-cyan-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Customer</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Address</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Area</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Milk/Day</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Status</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {customers.map((customer) => (
              <tr key={customer.id} className="hover:bg-blue-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                    <Avatar name={customer.name} size="md" />
                    <div>
                      <p className="text-sm font-bold text-gray-900">{customer.name}</p>
                      <p className="text-xs text-gray-500">{customer.phone}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                  {customer.address}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium text-gray-700">{customer.area}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-bold text-blue-600">
                  {customer.milkPerDay}L
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => onToggleStatus?.(customer.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                      customer.status === 'Active'
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                    }`}
                  >
                    {customer.status}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEdit?.(customer)}
                      className="p-3 text-blue-600 hover:bg-blue-100 rounded-xl transition-all"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    {onDelete && (
                      <button
                        onClick={() => onDelete?.(customer.id)}
                        className="p-3 text-red-600 hover:bg-red-100 rounded-xl transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerTable;
import React from 'react';
import { Download, Eye } from 'lucide-react';
import Button from '../common/Button';

const BillingTable = ({ bills = [] }) => {
  return (
    <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100">
      <div className="px-8 py-6 bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-gray-200">
        <h3 className="text-2xl font-bold text-gray-800">Monthly Bills</h3>
        <p className="text-sm text-gray-600 mt-1">
          Customer billing details for current month
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Customer</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Area</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Litres</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Rate</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Amount</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Status</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {bills.map((bill) => (
              <tr key={bill.id || bill._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <p className="text-sm font-bold text-gray-900">{bill.name}</p>
                    <p className="text-xs text-gray-500">{bill.phone}</p>
                  </div>
                </td>

                <td className="px-6 py-4 text-sm text-gray-600">{bill.area}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-700">{bill.monthlyLitres}L</td>
                <td className="px-6 py-4 text-sm text-gray-600">₹{bill.rate || 60}/L</td>
                <td className="px-6 py-4 text-sm font-bold text-blue-600">
                  ₹{bill.amount ? bill.amount.toLocaleString() : '0'}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`px-4 py-2 rounded-xl text-xs font-bold ${
                      bill.paymentStatus === 'Paid'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {bill.paymentStatus}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button
                      title="View Bill"
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      title="Download Bill"
                      className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-all"
                    >
                      <Download className="w-5 h-5" />
                    </button>
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

export default BillingTable;

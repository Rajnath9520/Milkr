import React from 'react';
import { Download, Printer, Mail } from 'lucide-react';
import Button from '../common/Button';

const Invoice = ({ invoiceData }) => {
  const {
    invoiceNumber = 'INV-2025-001',
    date = new Date().toLocaleDateString(),
    customer = { name: 'Customer Name', address: 'Address', phone: '0000000000' },
    items = [],
    subtotal = 0,
    tax = 0,
    total = 0
  } = invoiceData || {};

  return (
    <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            Milkr
          </h1>
          <p className="text-gray-600 mt-1">Fresh & Pure Milk Delivery</p>
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-bold text-gray-800">INVOICE</h2>
          <p className="text-gray-600">#{invoiceNumber}</p>
          <p className="text-sm text-gray-500">{date}</p>
        </div>
      </div>

      {/* Bill To */}
      <div className="mb-8">
        <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">Bill To:</h3>
        <div className="bg-gray-50 p-4 rounded-2xl">
          <p className="font-bold text-gray-800">{customer.name}</p>
          <p className="text-sm text-gray-600">{customer.address}</p>
          <p className="text-sm text-gray-600">{customer.phone}</p>
        </div>
      </div>

      {/* Items */}
      <div className="mb-8">
        <table className="w-full">
          <thead className="bg-blue-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">Description</th>
              <th className="px-4 py-3 text-center text-sm font-bold text-gray-700">Qty</th>
              <th className="px-4 py-3 text-right text-sm font-bold text-gray-700">Rate</th>
              <th className="px-4 py-3 text-right text-sm font-bold text-gray-700">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {items.map((item, index) => (
              <tr key={index}>
                <td className="px-4 py-3 text-sm text-gray-800">{item.description}</td>
                <td className="px-4 py-3 text-center text-sm text-gray-800">{item.quantity}</td>
                <td className="px-4 py-3 text-right text-sm text-gray-800">₹{item.rate}</td>
                <td className="px-4 py-3 text-right text-sm font-semibold text-gray-800">₹{item.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-64 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-semibold">₹{subtotal}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tax (0%):</span>
            <span className="font-semibold">₹{tax}</span>
          </div>
          <div className="border-t-2 border-gray-200 pt-2 flex justify-between">
            <span className="font-bold text-gray-800">Total:</span>
            <span className="font-bold text-xl text-blue-600">₹{total}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <Button variant="secondary" icon={Printer} size="sm">
          Print
        </Button>
        <Button variant="secondary" icon={Mail} size="sm">
          Email
        </Button>
        <Button variant="primary" icon={Download} size="sm">
          Download PDF
        </Button>
      </div>
    </div>
  );
};

export default Invoice;
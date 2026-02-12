import React, { useState } from 'react';
import { DollarSign, CreditCard, Calendar } from 'lucide-react';
import Input from '../common/Input';
import Button from '../common/Button';

const PaymentForm = ({ customer, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    amount: '',
    paymentMethod: 'cash',
    paymentDate: new Date().toISOString().split('T')[0],
    transactionId: '',
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(formData);
  };

  return (
    <div className="p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        {customer && (
          <div className="bg-blue-50 p-4 rounded-2xl mb-6">
            <p className="text-sm text-gray-600">Recording payment for:</p>
            <p className="font-bold text-gray-800 text-lg">{customer.name}</p>
            <p className="text-sm text-gray-600">{customer.area}</p>
          </div>
        )}

        <Input
          label="Amount"
          name="amount"
          type="number"
          value={formData.amount}
          onChange={handleChange}
          icon={DollarSign}
          placeholder="Enter amount"
          required
        />

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Payment Method
          </label>
          <select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
          >
            <option value="cash">Cash</option>
            <option value="online">Online Transfer</option>
            <option value="card">Card</option>
            <option value="upi">UPI</option>
            <option value="cheque">Cheque</option>
          </select>
        </div>

        <Input
          label="Payment Date"
          name="paymentDate"
          type="date"
          value={formData.paymentDate}
          onChange={handleChange}
          icon={Calendar}
          required
        />

        {formData.paymentMethod !== 'cash' && (
          <Input
            label="Transaction ID / Reference"
            name="transactionId"
            value={formData.transactionId}
            onChange={handleChange}
            icon={CreditCard}
            placeholder="Enter transaction reference"
          />
        )}

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Notes (Optional)
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all resize-none"
            rows={3}
            placeholder="Add any notes..."
          />
        </div>

        <div className="flex space-x-4 pt-4">
          <Button type="submit" variant="primary" fullWidth>
            Record Payment
          </Button>
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PaymentForm;

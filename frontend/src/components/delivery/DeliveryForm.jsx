import React, { useState, useEffect } from 'react';
import { Package, Calendar, Droplet, MapPin, FileText } from 'lucide-react';
import Input from '../common/Input';
import Button from '../common/Button';

const DeliveryForm = ({ customers = [], selectedCustomer, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    customerId: '',
    customerName: '',
    date: new Date().toISOString().split('T')[0],
    litres: '',
    status: 'Pending',
    notes: '',
    area: ''
  });

  useEffect(() => {
    if (selectedCustomer) {
      setFormData({
        customerId: selectedCustomer.id,
        customerName: selectedCustomer.name,
        date: new Date().toISOString().split('T')[0],
        litres: selectedCustomer.milkPerDay || '',
        status: 'Pending',
        notes: '',
        area: selectedCustomer.area || ''
      });
    }
  }, [selectedCustomer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Auto-fill customer details when customer is selected
    if (name === 'customerId') {
      const customer = customers.find(c => c.id.toString() === value);
      if (customer) {
        setFormData(prev => ({
          ...prev,
          customerName: customer.name,
          litres: customer.milkPerDay || '',
          area: customer.area || ''
        }));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(formData);
  };

  return (
    <div className="p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Selection */}
        {!selectedCustomer && (
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Select Customer <span className="text-red-500">*</span>
            </label>
            <select
              name="customerId"
              value={formData.customerId}
              onChange={handleChange}
              className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
              required
            >
              <option value="">Choose a customer...</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name} - {customer.area}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Show customer info if selected */}
        {(selectedCustomer || formData.customerId) && (
          <div className="bg-blue-50 p-4 rounded-2xl">
            <p className="text-sm text-gray-600">Creating delivery for:</p>
            <p className="font-bold text-gray-800 text-lg">{formData.customerName}</p>
            <p className="text-sm text-gray-600">{formData.area}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Delivery Date */}
          <Input
            label="Delivery Date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            icon={Calendar}
            required
          />

          {/* Litres */}
          <Input
            label="Litres"
            name="litres"
            type="number"
            step="0.5"
            value={formData.litres}
            onChange={handleChange}
            icon={Droplet}
            placeholder="Enter quantity"
            required
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Delivery Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
          >
            <option value="Pending">Pending</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Skipped">Skipped</option>
          </select>
        </div>

        {/* Notes */}
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
            placeholder="Add any special instructions or notes..."
          />
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4 pt-4">
          <Button
            type="submit"
            variant="primary"
            icon={Package}
            fullWidth
          >
            Create Delivery Record
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default DeliveryForm;
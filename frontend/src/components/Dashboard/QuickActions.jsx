import React from 'react';
import { Plus, Package, DollarSign, BarChart3 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const QuickActions = ({ onAction }) => {
  const { user } = useAuth();
  
  // Check if user can create customers (admin/manager only)
  const canCreateCustomer = user?.role === 'admin' || user?.role === 'manager';
  
  const actions = [
    ...(canCreateCustomer ? [{ icon: Plus, label: 'Add Customer', color: 'blue', action: 'add-customer' }] : []),
    { icon: Package, label: 'New Delivery', color: 'green', action: 'new-delivery' },
    { icon: DollarSign, label: 'Record Payment', color: 'purple', action: 'record-payment' },
    { icon: BarChart3, label: 'View Analytics', color: 'cyan', action: 'view-analytics' },
  ];

  return (
    <div className="space-y-3">
      {actions.map((action, index) => (
        <button
          key={index}
          onClick={() => onAction?.(action.action)}
          className={`w-full p-4 rounded-2xl bg-${action.color}-50 hover:bg-${action.color}-100 text-${action.color}-700 font-semibold flex items-center space-x-3 transition-all duration-300 transform hover:scale-105`}
        >
          <action.icon className="w-5 h-5" />
          <span>{action.label}</span>
        </button>
      ))}
    </div>
  );
};

export default QuickActions;
import React, { useState } from 'react';
import { DollarSign, Download, FileText, Calendar } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import BillingTable from '../components/billing/BillingTable';

const Billing = ({ customers = [] }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const bills = customers.map(customer => {
    const monthlyLitres = customer.milkPerDay * 30;
    const amount = monthlyLitres * 60;
    return {
      ...customer,
      monthlyLitres,
      amount,
      paymentStatus: Math.random() > 0.3 ? 'Paid' : 'Pending'
    };
  });

  const totalRevenue = bills.reduce((sum, b) => sum + b.amount, 0);
  const paidAmount = bills.filter(b => b.paymentStatus === 'Paid').reduce((sum, b) => sum + b.amount, 0);
  const pendingAmount = totalRevenue - paidAmount;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Billing & Payments</h2>
          <p className="text-gray-600 mt-1">Manage invoices and track payments</p>
        </div>
        <Button variant="primary" icon={Download}>
          Download Report
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card hover={false}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-semibold">Total Revenue</p>
              <h3 className="text-3xl font-bold text-gray-800">₹{(totalRevenue / 1000).toFixed(1)}K</h3>
            </div>
            <DollarSign className="w-10 h-10 text-green-500" />
          </div>
        </Card>
        <Card hover={false}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-semibold">Collected</p>
              <h3 className="text-3xl font-bold text-green-600">₹{(paidAmount / 1000).toFixed(1)}K</h3>
            </div>
            <FileText className="w-10 h-10 text-green-500" />
          </div>
        </Card>
        <Card hover={false}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-semibold">Pending</p>
              <h3 className="text-3xl font-bold text-orange-600">₹{(pendingAmount / 1000).toFixed(1)}K</h3>
            </div>
            <Calendar className="w-10 h-10 text-orange-500" />
          </div>
        </Card>
      </div>

      {/* Billing Table */}
      <BillingTable bills={bills} />
    </div>
  );
};

export default Billing;
import React from 'react';
import { Package, Users, TrendingUp, DollarSign } from 'lucide-react';
import StatsCard from '../components/Dashboard/StatsCard';
import RecentActivity from '../components/Dashboard/RecentActivity';
import QuickActions from '../components/Dashboard/QuickActions';
import Card from '../components/common/Card';

const Dashboard = ({ customers = [], onQuickAction }) => {
  const stats = {
    totalLitres: customers.reduce((sum, c) => sum + c.milkPerDay, 0) * 30,
    totalCustomers: customers.length,
    deliveredToday: customers.filter(c => c.status === 'Delivered').length,
    monthlyRevenue: customers.reduce((sum, c) => sum + c.milkPerDay, 0) * 30 * 60,
  };

  const recentActivities = [
    { customer: 'Rajesh Kumar', action: 'Milk delivered', time: '2 hours ago', status: 'success' },
    { customer: 'Priya Sharma', action: 'Payment received', time: '3 hours ago', status: 'success' },
    { customer: 'Amit Patel', action: 'Delivery pending', time: '5 hours ago', status: 'pending' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          icon={Package}
          title="Monthly Delivery"
          value={`${stats.totalLitres}L`}
          subtitle="Total litres delivered"
          color="bg-gradient-to-br from-blue-500 to-blue-600"
          delay={0}
        />
        <StatsCard
          icon={Users}
          title="Total Customers"
          value={stats.totalCustomers}
          subtitle="Active subscribers"
          color="bg-gradient-to-br from-cyan-500 to-cyan-600"
          delay={100}
        />
        <StatsCard
          icon={TrendingUp}
          title="Delivered Today"
          value={stats.deliveredToday}
          subtitle={`${Math.round((stats.deliveredToday / stats.totalCustomers) * 100)}% completion`}
          color="bg-gradient-to-br from-green-500 to-emerald-600"
          delay={200}
        />
        <StatsCard
          icon={DollarSign}
          title="Monthly Revenue"
          value={`₹${(stats.monthlyRevenue / 1000).toFixed(1)}K`}
          subtitle="Estimated earnings"
          color="bg-gradient-to-br from-purple-500 to-pink-600"
          delay={300}
        />
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2" title="Recent Activity">
          <RecentActivity activities={recentActivities} />
        </Card>

        <Card title="Quick Actions">
          <QuickActions onAction={onQuickAction} />
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
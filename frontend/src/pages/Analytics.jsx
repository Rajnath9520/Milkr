import React from 'react';
import { TrendingUp, Users, Package, DollarSign } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Card from '../components/common/Card';

const Analytics = ({ customers = [] }) => {
  const monthlyData = [
    { month: 'Jan', revenue: 45000, litres: 750 },
    { month: 'Feb', revenue: 52000, litres: 867 },
    { month: 'Mar', revenue: 48000, litres: 800 },
    { month: 'Apr', revenue: 61000, litres: 1017 },
    { month: 'May', revenue: 55000, litres: 917 },
    { month: 'Jun', revenue: 67000, litres: 1117 },
  ];

  const areaData = customers.reduce((acc, customer) => {
    const area = customer.area;
    if (!acc[area]) {
      acc[area] = { name: area, count: 0, litres: 0 };
    }
    acc[area].count++;
    acc[area].litres += customer.milkPerDay * 30;
    return acc;
  }, {});

  const areaChartData = Object.values(areaData);
  const COLORS = ['#3B82F6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444'];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-gray-800">Analytics & Reports</h2>
        <p className="text-gray-600 mt-1">Detailed insights into your business performance</p>
      </div>

      {/* Monthly Trend */}
      <Card title="Monthly Revenue & Delivery Trend">
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={3} />
            <Line yAxisId="right" type="monotone" dataKey="litres" stroke="#10B981" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Area-wise Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Area-wise Customers">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={areaChartData}
                dataKey="count"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {areaChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Area-wise Milk Distribution">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={areaChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="litres" fill="#06B6D4" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
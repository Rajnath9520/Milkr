import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DeliveryChart = ({ data, type = 'line' }) => {
  const defaultData = [
    { day: 'Mon', litres: 145, deliveries: 48 },
    { day: 'Tue', litres: 160, deliveries: 53 },
    { day: 'Wed', litres: 155, deliveries: 52 },
    { day: 'Thu', litres: 170, deliveries: 57 },
    { day: 'Fri', litres: 165, deliveries: 55 },
    { day: 'Sat', litres: 180, deliveries: 60 },
    { day: 'Sun', litres: 175, deliveries: 58 },
  ];

  const chartData = data || defaultData;

  if (type === 'bar') {
    return (
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={chartData}>
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity={1} />
              <stop offset="100%" stopColor="#06B6D4" stopOpacity={0.8} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="day" stroke="#6B7280" />
          <YAxis stroke="#6B7280" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#FFF', 
              border: 'none', 
              borderRadius: '16px', 
              boxShadow: '0 10px 40px rgba(0,0,0,0.15)'
            }}
          />
          <Legend />
          <Bar dataKey="litres" fill="url(#barGradient)" radius={[12, 12, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={chartData}>
        <defs>
          <linearGradient id="lineGradient1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.8} />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis dataKey="day" stroke="#6B7280" />
        <YAxis stroke="#6B7280" />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#FFF', 
            border: 'none', 
            borderRadius: '16px', 
            boxShadow: '0 10px 40px rgba(0,0,0,0.15)'
          }}
        />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="litres" 
          stroke="#3B82F6" 
          strokeWidth={3} 
          dot={{ r: 6, fill: '#3B82F6', strokeWidth: 2, stroke: '#fff' }}
          activeDot={{ r: 8 }}
          fill="url(#lineGradient1)"
        />
        <Line 
          type="monotone" 
          dataKey="deliveries" 
          stroke="#10B981" 
          strokeWidth={3} 
          dot={{ r: 6, fill: '#10B981', strokeWidth: 2, stroke: '#fff' }}
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default DeliveryChart;

'use client';

import { useMemo } from 'react';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { Opportunity } from '@/types/opportunity';

interface OpportunityChartProps {
  opportunities: Opportunity[];
  type: 'line' | 'pie';
}

/**
 * Opportunity Chart Component
 * 
 * Displays opportunities data in line or pie chart format
 */
export function OpportunityChart({ opportunities, type }: OpportunityChartProps) {
  // Prepare line chart data (opportunities over time)
  const lineChartData = useMemo(() => {
    const dateMap = new Map<string, number>();
    
    opportunities.forEach(opp => {
      const date = new Date(opp.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
      dateMap.set(date, (dateMap.get(date) || 0) + 1);
    });
    
    return Array.from(dateMap.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA.getTime() - dateB.getTime();
      });
  }, [opportunities]);

  // Prepare pie chart data (status distribution)
  const pieChartData = useMemo(() => {
    const statusCounts = new Map<string, number>();
    
    opportunities.forEach(opp => {
      const status = opp.status.charAt(0).toUpperCase() + opp.status.slice(1);
      statusCounts.set(status, (statusCounts.get(status) || 0) + 1);
    });
    
    const colors = {
      'New': '#3B82F6',
      'Viewed': '#8B5CF6',
      'Contacted': '#F59E0B',
      'Applied': '#10B981',
      'Rejected': '#EF4444',
      'Won': '#10B981',
      'Lost': '#6B7280',
    };
    
    return Array.from(statusCounts.entries()).map(([name, value]) => ({
      name,
      value,
      color: colors[name as keyof typeof colors] || '#6B7280',
    }));
  }, [opportunities]);

  if (opportunities.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <p>No data available for the selected time period</p>
      </div>
    );
  }

  if (type === 'line') {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={lineChartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis 
            dataKey="date" 
            stroke="#6B7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#6B7280"
            style={{ fontSize: '12px' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="count" 
            stroke="#3B82F6" 
            strokeWidth={2}
            name="Opportunities"
            dot={{ fill: '#3B82F6', r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  }

  // Pie chart
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={pieChartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
        >
          {pieChartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip 
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #E5E7EB',
            borderRadius: '8px',
          }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}


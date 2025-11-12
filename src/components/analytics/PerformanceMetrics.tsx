'use client';

import { Briefcase, CheckCircle, XCircle, Clock, TrendingUp } from 'lucide-react';
import type { Opportunity } from '@/types/opportunity';

interface PerformanceMetricsProps {
  opportunities: Opportunity[];
}

/**
 * Performance Metrics Component
 * 
 * Displays key metrics cards for opportunities
 */
export function PerformanceMetrics({ opportunities }: PerformanceMetricsProps) {
  const total = opportunities.length;
  const newCount = opportunities.filter(o => o.status === 'new').length;
  const contactedCount = opportunities.filter(o => o.status === 'contacted' || o.status === 'applied').length;
  const wonCount = opportunities.filter(o => o.status === 'won').length;
  const lostCount = opportunities.filter(o => o.status === 'lost').length;
  
  const responseRate = total > 0 ? ((contactedCount / total) * 100).toFixed(1) : '0';
  const winRate = (contactedCount + wonCount) > 0 ? ((wonCount / (contactedCount + wonCount)) * 100).toFixed(1) : '0';

  const metrics = [
    {
      icon: Briefcase,
      label: 'Total Opportunities',
      value: total,
      color: 'blue',
      bgGradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Clock,
      label: 'New',
      value: newCount,
      color: 'yellow',
      bgGradient: 'from-yellow-500 to-orange-500',
    },
    {
      icon: CheckCircle,
      label: 'Contacted/Applied',
      value: contactedCount,
      color: 'purple',
      bgGradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: CheckCircle,
      label: 'Won',
      value: wonCount,
      color: 'green',
      bgGradient: 'from-green-500 to-emerald-500',
    },
    {
      icon: XCircle,
      label: 'Lost',
      value: lostCount,
      color: 'red',
      bgGradient: 'from-red-500 to-rose-500',
    },
    {
      icon: TrendingUp,
      label: 'Response Rate',
      value: `${responseRate}%`,
      color: 'indigo',
      bgGradient: 'from-indigo-500 to-blue-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <div key={index} className="card-hover">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{metric.label}</p>
                <p className="text-3xl font-bold text-gray-900 mb-2">
                  {metric.value}
                </p>
              </div>
              <div className={`w-12 h-12 bg-gradient-to-br ${metric.bgGradient} rounded-lg flex items-center justify-center shadow-lg`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}


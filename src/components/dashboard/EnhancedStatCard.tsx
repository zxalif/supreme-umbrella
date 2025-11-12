'use client';

import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useMemo } from 'react';

interface EnhancedStatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  previousValue?: number;
  change?: string;
  color?: 'blue' | 'purple' | 'green' | 'yellow' | 'red' | 'indigo';
  bgGradient: string;
  trend?: number[]; // Array of values for sparkline
  onClick?: () => void;
  loading?: boolean;
}

/**
 * Enhanced Stat Card Component
 * 
 * Features:
 * - Trend indicators with percentage change
 * - Color-coded performance
 * - Mini sparkline chart
 * - Click-to-drill-down
 * - Loading states
 */
export function EnhancedStatCard({
  icon: Icon,
  label,
  value,
  previousValue,
  change,
  color = 'blue',
  bgGradient,
  trend,
  onClick,
  loading = false,
}: EnhancedStatCardProps) {
  
  // Calculate percentage change
  const percentageChange = useMemo(() => {
    if (previousValue === undefined || previousValue === 0) return null;
    
    const currentValue = typeof value === 'string' 
      ? parseFloat(value.replace(/[^0-9.-]/g, '')) 
      : value;
    
    const change = ((currentValue - previousValue) / previousValue) * 100;
    return change;
  }, [value, previousValue]);

  // Determine trend direction
  const trendDirection = useMemo(() => {
    if (percentageChange === null) return 'neutral';
    if (percentageChange > 0) return 'up';
    if (percentageChange < 0) return 'down';
    return 'neutral';
  }, [percentageChange]);

  // Sparkline path
  const sparklinePath = useMemo(() => {
    if (!trend || trend.length < 2) return '';
    
    const width = 60;
    const height = 20;
    const max = Math.max(...trend);
    const min = Math.min(...trend);
    const range = max - min || 1;
    
    const points = trend.map((value, index) => {
      const x = (index / (trend.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    });
    
    return `M ${points.join(' L ')}`;
  }, [trend]);

  const TrendIcon = trendDirection === 'up' 
    ? TrendingUp 
    : trendDirection === 'down' 
    ? TrendingDown 
    : Minus;

  const trendColor = trendDirection === 'up'
    ? 'text-green-600'
    : trendDirection === 'down'
    ? 'text-red-600'
    : 'text-gray-400';

  return (
    <div 
      className={`card-hover group relative overflow-hidden ${onClick ? 'cursor-pointer' : ''} ${loading ? 'animate-pulse' : ''} transition-all duration-300 hover:scale-[1.02] hover:shadow-xl`}
      onClick={onClick}
    >
      {/* Animated background gradient on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${bgGradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
      
      <div className="relative flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1 uppercase tracking-wide">{label}</p>
          <div className="flex items-baseline space-x-2">
            <p className="text-3xl font-bold text-gray-900 transition-all duration-300 group-hover:text-4xl">
              {loading ? '...' : value}
            </p>
            {percentageChange !== null && !loading && (
              <div className={`flex items-center space-x-1 ${trendColor} transition-transform duration-300 group-hover:scale-110`}>
                <TrendIcon className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {Math.abs(percentageChange).toFixed(1)}%
                </span>
              </div>
            )}
          </div>
          {change && !loading && (
            <p className={`text-sm font-medium mt-1 ${
              trendDirection === 'up' 
                ? 'text-green-600' 
                : trendDirection === 'down'
                ? 'text-red-600'
                : 'text-gray-600'
            }`}>
              {change}
            </p>
          )}
        </div>
        <div className={`w-12 h-12 bg-gradient-to-br ${bgGradient} rounded-lg flex items-center justify-center shadow-lg flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl group-hover:rotate-3`}>
          <Icon className="w-6 h-6 text-white transition-transform duration-300 group-hover:scale-110" />
        </div>
      </div>

      {/* Sparkline */}
      {trend && trend.length > 1 && !loading && (
        <div className="mt-2 pt-2 border-t border-gray-100">
          <svg width="60" height="20" className="opacity-50">
            <path
              d={sparklinePath}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={trendColor}
            />
          </svg>
        </div>
      )}
    </div>
  );
}

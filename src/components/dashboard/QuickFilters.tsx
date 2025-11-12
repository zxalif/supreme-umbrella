'use client';

import { Calendar, Clock, TrendingUp } from 'lucide-react';
import { DateRangePicker, type DateRange } from './DateRangePicker';

export type TimeRange = 'today' | '7d' | '30d' | '90d' | 'all' | 'custom';

interface QuickFiltersProps {
  selectedRange: TimeRange;
  onRangeChange: (range: TimeRange) => void;
  onCustomRangeChange?: (range: DateRange) => void;
  customRange?: DateRange;
  className?: string;
  showCustomRange?: boolean;
}

/**
 * Quick Filters Component
 * 
 * Provides quick date range selection buttons with optional custom date picker
 */
export function QuickFilters({ 
  selectedRange, 
  onRangeChange,
  onCustomRangeChange,
  customRange,
  className = '',
  showCustomRange = true,
}: QuickFiltersProps) {
  
  const filters: { value: TimeRange; label: string; icon: typeof Calendar; description?: string }[] = [
    { value: 'today', label: 'Today', icon: Clock, description: 'Last 24 hours' },
    { value: '7d', label: '7 Days', icon: Calendar, description: 'Past week' },
    { value: '30d', label: '30 Days', icon: Calendar, description: 'Past month' },
    { value: '90d', label: '3 Months', icon: TrendingUp, description: 'Past quarter' },
    { value: 'all', label: 'All Time', icon: TrendingUp, description: 'Complete history' },
  ];

  const handleCustomRangeChange = (range: DateRange) => {
    if (onCustomRangeChange) {
      onCustomRangeChange(range);
      onRangeChange('custom');
    }
  };

  return (
    <div className={`flex flex-col sm:flex-row items-start sm:items-center gap-3 ${className}`}>
      <div className="flex flex-wrap items-center gap-2 bg-gray-50 rounded-xl p-2 border border-gray-200">
        {filters.map((filter) => {
          const Icon = filter.icon;
          const isSelected = selectedRange === filter.value;
          return (
            <button
              key={filter.value}
              onClick={() => onRangeChange(filter.value)}
              className={`group relative px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${
                isSelected
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-sm'
              }`}
              title={filter.description}
            >
              <Icon className="w-4 h-4" />
              <span>{filter.label}</span>
              
              {/* Tooltip */}
              {filter.description && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                  {filter.description}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                </div>
              )}
            </button>
          );
        })}
      </div>
      
      {showCustomRange && onCustomRangeChange && (
        <DateRangePicker
          onRangeChange={handleCustomRangeChange}
        />
      )}
    </div>
  );
}

'use client';

import { useState, useRef, useEffect } from 'react';
import { Calendar, X } from 'lucide-react';

export interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

interface DateRangePickerProps {
  onRangeChange: (range: DateRange) => void;
  className?: string;
}

/**
 * Date Range Picker Component
 * 
 * Allows users to select custom date ranges
 */
export function DateRangePicker({ 
  onRangeChange,
  className = '' 
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [tempStartDate, setTempStartDate] = useState<string>('');
  const [tempEndDate, setTempEndDate] = useState<string>('');
  const pickerRef = useRef<HTMLDivElement>(null);

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Initialize temp dates when opening
  useEffect(() => {
    if (isOpen) {
      if (startDate) {
        setTempStartDate(formatDateForInput(startDate));
      }
      if (endDate) {
        setTempEndDate(formatDateForInput(endDate));
      }
    }
  }, [isOpen, startDate, endDate]);

  const formatDateForInput = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatDateForDisplay = (date: Date | null): string => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const handleApply = () => {
    const start = tempStartDate ? new Date(tempStartDate) : null;
    const end = tempEndDate ? new Date(tempEndDate) : null;

    if (start) start.setHours(0, 0, 0, 0);
    if (end) end.setHours(23, 59, 59, 999);

    // Validate dates
    if (start && end && start > end) {
      alert('Start date must be before end date');
      return;
    }

    setStartDate(start);
    setEndDate(end);
    onRangeChange({ startDate: start, endDate: end });
    setIsOpen(false);
  };

  const handleClear = () => {
    setStartDate(null);
    setEndDate(null);
    setTempStartDate('');
    setTempEndDate('');
    onRangeChange({ startDate: null, endDate: null });
    setIsOpen(false);
  };

  const displayText = () => {
    if (startDate && endDate) {
      return `${formatDateForDisplay(startDate)} - ${formatDateForDisplay(endDate)}`;
    }
    if (startDate) {
      return `From ${formatDateForDisplay(startDate)}`;
    }
    if (endDate) {
      return `Until ${formatDateForDisplay(endDate)}`;
    }
    return 'Custom Range';
  };

  return (
    <div className={`relative ${className}`} ref={pickerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <Calendar className="w-4 h-4" />
        <span className="text-sm font-medium">{displayText()}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">Select Date Range</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={tempStartDate}
                onChange={(e) => setTempStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={tempEndDate}
                onChange={(e) => setTempEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center space-x-2 pt-2 border-t border-gray-200">
              <button
                onClick={handleApply}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Apply
              </button>
              {(startDate || endDate) && (
                <button
                  onClick={handleClear}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


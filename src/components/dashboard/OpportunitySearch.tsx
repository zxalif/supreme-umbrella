'use client';

import { useState, useEffect } from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { useOpportunitySearch } from '@/hooks/useOpportunitySearch';
import type { Opportunity, OpportunityStatus } from '@/types/opportunity';

interface OpportunitySearchProps {
  opportunities: Opportunity[];
  onFilteredResults: (filtered: Opportunity[]) => void;
  className?: string;
}

export function OpportunitySearch({ opportunities, onFilteredResults, className = '' }: OpportunitySearchProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const {
    filters,
    filteredOpportunities,
    filterOptions,
    isSearching,
    hasActiveFilters,
    updateFilters,
    clearFilters
  } = useOpportunitySearch(opportunities);

  // Update parent component with filtered results
  useEffect(() => {
    onFilteredResults(filteredOpportunities);
  }, [filteredOpportunities, onFilteredResults]);

  return (
    <div className={`bg-white rounded-xl border border-gray-200 shadow-sm ${className}`}>
      {/* Main Search Bar */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search opportunities by title, content, author, or keywords..."
              value={filters.query}
              onChange={(e) => updateFilters({ query: e.target.value })}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
            {isSearching && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
          
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
              showAdvanced 
                ? 'bg-primary-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
          
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 px-4 py-3 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition-colors"
            >
              <X className="w-4 h-4" />
              Clear
            </button>
          )}
        </div>
        
        {/* Results Count */}
        <div className="flex items-center justify-between mt-3 text-sm text-gray-600">
          <span>
            {filteredOpportunities.length} of {opportunities.length} opportunities
            {hasActiveFilters && ' (filtered)'}
          </span>
          {isSearching && <span className="text-primary-500">Searching...</span>}
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filters.status}
                onChange={(e) => updateFilters({ status: e.target.value as OpportunityStatus | 'all' })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Statuses</option>
                <option value="new">New</option>
                <option value="viewed">Viewed</option>
                <option value="contacted">Contacted</option>
                <option value="applied">Applied</option>
                <option value="rejected">Rejected</option>
                <option value="won">Won</option>
                <option value="lost">Lost</option>
              </select>
            </div>

            {/* Source Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Source</label>
              <select
                value={filters.source}
                onChange={(e) => updateFilters({ source: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Sources</option>
                {filterOptions.sources.map(source => (
                  <option key={source} value={source} className="capitalize">
                    {source}
                  </option>
                ))}
              </select>
            </div>

            {/* Score Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Score: {filters.minScore}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={filters.minScore}
                onChange={(e) => updateFilters({ minScore: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>

            {/* Date Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
              <select
                value={filters.dateRange}
                onChange={(e) => updateFilters({ dateRange: e.target.value as any })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
              </select>
            </div>
          </div>

          {/* Keyword Filter */}
          {filterOptions.keywords.length > 0 && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Keywords</label>
              <div className="flex flex-wrap gap-2">
                {filterOptions.keywords.map(keyword => (
                  <button
                    key={keyword}
                    onClick={() => {
                      updateFilters({
                        hasKeywords: filters.hasKeywords.includes(keyword)
                          ? filters.hasKeywords.filter((k: string) => k !== keyword)
                          : [...filters.hasKeywords, keyword]
                      });
                    }}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      filters.hasKeywords.includes(keyword)
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {keyword}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

'use client';

import { useMemo } from 'react';
import { Search, TrendingUp, TrendingDown } from 'lucide-react';
import type { KeywordSearch } from '@/types/keyword-search';
import type { Opportunity } from '@/types/opportunity';

interface KeywordSearchPerformanceProps {
  keywordSearches: KeywordSearch[];
  opportunities: Opportunity[];
}

/**
 * Keyword Search Performance Component
 * 
 * Displays performance metrics for each keyword search
 */
export function KeywordSearchPerformance({
  keywordSearches,
  opportunities,
}: KeywordSearchPerformanceProps) {
  // Calculate performance for each keyword search
  const performanceData = useMemo(() => {
    return keywordSearches.map(search => {
      const searchOpportunities = opportunities.filter(
        opp => opp.keyword_search_id === search.id
      );
      
      const total = searchOpportunities.length;
      const newCount = searchOpportunities.filter(o => o.status === 'new').length;
      const contactedCount = searchOpportunities.filter(
        o => o.status === 'contacted' || o.status === 'applied'
      ).length;
      const wonCount = searchOpportunities.filter(o => o.status === 'won').length;
      
      const responseRate = total > 0 ? ((contactedCount / total) * 100).toFixed(1) : '0';
      const winRate = (contactedCount + wonCount) > 0 
        ? ((wonCount / (contactedCount + wonCount)) * 100).toFixed(1) 
        : '0';
      
      return {
        search,
        total,
        newCount,
        contactedCount,
        wonCount,
        responseRate: parseFloat(responseRate),
        winRate: parseFloat(winRate),
        isActive: search.enabled,
      };
    }).sort((a, b) => b.total - a.total); // Sort by total opportunities
  }, [keywordSearches, opportunities]);

  if (keywordSearches.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Search className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No Keyword Searches Yet
        </h3>
        <p className="text-gray-600">
          Create your first keyword search to start tracking performance
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {performanceData.map(({ search, total, newCount, contactedCount, wonCount, responseRate, winRate, isActive }) => (
        <div
          key={search.id}
          className={`card ${!isActive ? 'opacity-60' : ''}`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  {search.name}
                </h3>
                {!isActive && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    Paused
                  </span>
                )}
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Opportunities</p>
                  <p className="text-2xl font-bold text-gray-900">{total}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">New</p>
                  <p className="text-2xl font-bold text-yellow-600">{newCount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Response Rate</p>
                  <div className="flex items-center space-x-1">
                    <p className="text-2xl font-bold text-gray-900">{responseRate}%</p>
                    {responseRate > 20 ? (
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    ) : responseRate < 10 ? (
                      <TrendingDown className="w-5 h-5 text-red-600" />
                    ) : null}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Win Rate</p>
                  <p className="text-2xl font-bold text-green-600">{winRate}%</p>
                </div>
              </div>
              
              {/* Keywords */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 mb-2">Keywords:</p>
                <div className="flex flex-wrap gap-2">
                  {search.keywords.slice(0, 5).map((keyword, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                    >
                      {keyword}
                    </span>
                  ))}
                  {search.keywords.length > 5 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      +{search.keywords.length - 5} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}


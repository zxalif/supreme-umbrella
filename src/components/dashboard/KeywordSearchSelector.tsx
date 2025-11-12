'use client';

import { Check, Search as SearchIcon } from 'lucide-react';
import type { KeywordSearch } from '@/types/keyword-search';

interface KeywordSearchSelectorProps {
  searches: KeywordSearch[];
  selectedSearchId: string;
  onSelect: (searchId: string) => void;
  className?: string;
}

/**
 * Keyword Search Selector Component
 * 
 * Card-based selector for choosing a keyword search to generate opportunities from.
 * Replaces the dropdown with a more visual, intuitive interface.
 */
export function KeywordSearchSelector({
  searches,
  selectedSearchId,
  onSelect,
  className = '',
}: KeywordSearchSelectorProps) {
  if (searches.length === 0) {
    return (
      <div className={`card p-6 text-center ${className}`}>
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <SearchIcon className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No Keyword Searches Yet
        </h3>
        <p className="text-gray-600 mb-4">
          Create a keyword search first to generate opportunities
        </p>
        <a
          href="/dashboard/keyword-searches"
          className="btn-primary inline-flex items-center"
        >
          <SearchIcon className="w-4 h-4 mr-2" />
          Create Keyword Search
        </a>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`} data-tour="keyword-search-select">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Keyword Search
        </label>
        <p className="text-xs text-gray-500 mb-3">
          Choose a keyword search to generate opportunities from
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {/* "All Searches" option */}
        <button
          onClick={() => onSelect('all')}
          className={`relative p-4 rounded-lg border-2 transition-colors text-left min-h-[120px] flex flex-col ${
            selectedSearchId === 'all'
              ? 'border-blue-500 bg-blue-50 shadow-md'
              : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
          }`}
        >
          <div className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center">
            {selectedSearchId === 'all' && (
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
          <div className="pr-8 flex-1 flex flex-col">
            <h4 className="font-semibold text-gray-900 mb-1">All Searches</h4>
            <p className="text-xs text-gray-500">
              View opportunities from all keyword searches
            </p>
          </div>
        </button>

        {/* Individual keyword searches */}
        {searches.map((search) => {
          const isSelected = selectedSearchId === search.id;
          const keywordCount = search.keywords?.length || 0;
          
          return (
            <button
              key={search.id}
              onClick={() => onSelect(search.id)}
              className={`relative p-4 rounded-lg border-2 transition-colors text-left min-h-[120px] flex flex-col ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
              } ${!search.enabled ? 'opacity-60' : ''}`}
            >
              <div className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center">
                {isSelected && (
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
              
              <div className="pr-8 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold text-gray-900 truncate flex-1">
                    {search.name}
                  </h4>
                  {!search.enabled && (
                    <span className="ml-2 px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded flex-shrink-0">
                      Paused
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                  <span>{keywordCount} keyword{keywordCount !== 1 ? 's' : ''}</span>
                  {search.enabled && (
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded">
                      Active
                    </span>
                  )}
                </div>
                
                {search.keywords && search.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-auto">
                    {search.keywords.slice(0, 3).map((keyword, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded"
                      >
                        {keyword}
                      </span>
                    ))}
                    {search.keywords.length > 3 && (
                      <span className="px-2 py-0.5 text-xs text-gray-400">
                        +{search.keywords.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}


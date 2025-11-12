'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Briefcase, Search as SearchIcon, ArrowRight, Loader2, X } from 'lucide-react';
import type { SearchResults as SearchResultsType } from '@/lib/search/globalSearchService';

interface SearchResultsProps {
  results: SearchResultsType | null;
  query: string;
  isLoading: boolean;
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: () => void;
}

/**
 * SearchResults Component
 * 
 * Displays search results in a dropdown with keyboard navigation
 */
export function SearchResults({
  results,
  query,
  isLoading,
  isOpen,
  onClose,
  onNavigate,
}: SearchResultsProps) {
  const router = useRouter();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const resultsRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  // Flatten results for keyboard navigation
  const allResults = results
    ? [
        ...results.opportunities.map(r => ({ ...r, group: 'opportunities' as const })),
        ...results.keywordSearches.map(r => ({ ...r, group: 'keyword_searches' as const })),
      ]
    : [];

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [results, query]);

  // Scroll selected item into view
  useEffect(() => {
    if (itemRefs.current[selectedIndex]) {
      itemRefs.current[selectedIndex]?.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      });
    }
  }, [selectedIndex]);

  const handleNavigate = (url: string) => {
    onNavigate?.();
    onClose();
    router.push(url);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || allResults.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % allResults.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + allResults.length) % allResults.length);
        break;
      case 'Enter':
        e.preventDefault();
        if (allResults[selectedIndex]) {
          handleNavigate(allResults[selectedIndex].url);
        }
        break;
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
    }
  };

  if (!isOpen) return null;

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <mark key={i} className="bg-yellow-200 font-semibold">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  return (
    <div
      ref={resultsRef}
      className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 max-h-[500px] overflow-hidden z-[9999]"
      onKeyDown={handleKeyDown}
    >
      {isLoading ? (
        <div className="p-8 text-center">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600 mx-auto mb-2" />
          <p className="text-sm text-gray-600">Searching...</p>
        </div>
      ) : !results || results.total === 0 ? (
        <div className="p-8 text-center">
          <SearchIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">
            {query.length < 2 ? 'Type at least 2 characters to search' : 'No results found'}
          </p>
        </div>
      ) : (
        <div className="max-h-[500px] overflow-y-auto">
          {/* Opportunities Section */}
          {results.opportunities.length > 0 && (
            <div className="border-b border-gray-200">
              <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
                <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  Opportunities ({results.opportunities.length})
                </h3>
              </div>
              <div className="py-1">
                {results.opportunities.map((result, index) => {
                  const flatIndex = index;
                  return (
                    <a
                      key={result.id}
                      ref={(el) => {
                        itemRefs.current[flatIndex] = el;
                      }}
                      href={result.url}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavigate(result.url);
                      }}
                      className={`flex items-start px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer ${
                        selectedIndex === flatIndex ? 'bg-blue-50' : ''
                      }`}
                    >
                      <Briefcase className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 mb-1">
                          {highlightText(result.title, query)}
                        </div>
                        {result.subtitle && (
                          <div className="text-xs text-gray-500">{result.subtitle}</div>
                        )}
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400 ml-2 flex-shrink-0" />
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          {/* Keyword Searches Section */}
          {results.keywordSearches.length > 0 && (
            <div>
              <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
                <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  Keyword Searches ({results.keywordSearches.length})
                </h3>
              </div>
              <div className="py-1">
                {results.keywordSearches.map((result, index) => {
                  const flatIndex = results.opportunities.length + index;
                  return (
                    <a
                      key={result.id}
                      ref={(el) => {
                        itemRefs.current[flatIndex] = el;
                      }}
                      href={result.url}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavigate(result.url);
                      }}
                      className={`flex items-start px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer ${
                        selectedIndex === flatIndex ? 'bg-blue-50' : ''
                      }`}
                    >
                      <SearchIcon className="w-5 h-5 text-purple-600 mr-3 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 mb-1">
                          {highlightText(result.title, query)}
                        </div>
                        {result.subtitle && (
                          <div className="text-xs text-gray-500">{result.subtitle}</div>
                        )}
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400 ml-2 flex-shrink-0" />
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          {/* View All Results */}
          {results.total > 0 && (
            <div className="border-t border-gray-200 px-4 py-3 bg-gray-50">
              <a
                href={`/dashboard/opportunities?search=${encodeURIComponent(query)}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigate(`/dashboard/opportunities?search=${encodeURIComponent(query)}`);
                }}
                className="flex items-center justify-center text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                View all results for "{query}"
                <ArrowRight className="w-4 h-4 ml-1" />
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


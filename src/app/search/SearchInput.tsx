'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';

/**
 * Search Input Component
 * 
 * Handles search input with URL query parameter synchronization
 */
export default function SearchInput() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams?.get('q') || '';
  const [inputValue, setInputValue] = useState(query);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync input with URL query parameter
  useEffect(() => {
    setInputValue(query);
  }, [query]);

  // Focus input on mount if no query
  useEffect(() => {
    if (!query && inputRef.current) {
      inputRef.current.focus();
    }
  }, [query]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateSearchQuery(inputValue.trim());
  };

  const handleClear = () => {
    setInputValue('');
    updateSearchQuery('');
    inputRef.current?.focus();
  };

  const updateSearchQuery = (newQuery: string) => {
    const params = new URLSearchParams(searchParams?.toString());
    
    if (newQuery) {
      params.set('q', newQuery);
    } else {
      params.delete('q');
    }
    
    // Update URL without page reload
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Search for blog posts, documentation, FAQ, and more..."
          className="w-full pl-12 pr-12 py-4 text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
        {inputValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Clear search"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
      
      {/* Search Tips */}
      {!query && (
        <div className="mt-4 text-sm text-gray-500">
          <p className="mb-2">Try searching for:</p>
          <div className="flex flex-wrap gap-2">
            {['freelance opportunities', 'Reddit', 'keyword search', 'pricing', 'getting started'].map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => {
                  setInputValue(term);
                  updateSearchQuery(term);
                }}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}
    </form>
  );
}


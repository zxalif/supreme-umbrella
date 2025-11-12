'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { performGlobalSearch, type SearchResults } from '@/lib/search/globalSearchService';

interface UseGlobalSearchOptions {
  debounceMs?: number;
  minQueryLength?: number;
}

export function useGlobalSearch(options: UseGlobalSearchOptions = {}) {
  const { debounceMs = 300, minQueryLength = 2 } = options;
  
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const performSearch = useCallback(async (searchQuery: string) => {
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Create new abort controller
    abortControllerRef.current = new AbortController();
    
    if (searchQuery.length < minQueryLength) {
      setResults(null);
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const searchResults = await performGlobalSearch(searchQuery);
      setResults(searchResults);
    } catch (err: any) {
      if (err.name === 'AbortError') {
        // Request was cancelled, ignore
        return;
      }
      console.error('Search error:', err);
      setError('Failed to perform search');
      setResults(null);
    } finally {
      setIsLoading(false);
    }
  }, [minQueryLength]);

  const handleQueryChange = useCallback((newQuery: string) => {
    setQuery(newQuery);
    
    // Clear previous debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    // Open dropdown if query is long enough
    if (newQuery.length >= minQueryLength) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
      setResults(null);
    }
    
    // Debounce search
    debounceTimerRef.current = setTimeout(() => {
      performSearch(newQuery);
    }, debounceMs);
  }, [debounceMs, minQueryLength, performSearch]);

  const clearSearch = useCallback(() => {
    setQuery('');
    setResults(null);
    setIsOpen(false);
    setError(null);
    
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    query,
    results,
    isLoading,
    error,
    isOpen,
    setQuery: handleQueryChange,
    clearSearch,
    closeDropdown,
    setIsOpen,
  };
}


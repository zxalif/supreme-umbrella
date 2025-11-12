'use client';

import { useState, useMemo, useCallback } from 'react';
import { useDebounceWithLoading } from './useDebounce';
import type { Opportunity, OpportunityStatus } from '@/types/opportunity';

interface SearchFilters {
  query: string;
  status: OpportunityStatus | 'all';
  source: string;
  minScore: number;
  dateRange: 'all' | 'today' | '7d' | '30d';
  hasKeywords: string[];
}

const initialFilters: SearchFilters = {
  query: '',
  status: 'all',
  source: 'all',
  minScore: 0,
  dateRange: 'all',
  hasKeywords: []
};

export function useOpportunitySearch(opportunities: Opportunity[]) {
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);
  
  // Debounce search query with loading state
  const { debouncedValue: debouncedQuery, isLoading: isSearching } = useDebounceWithLoading(filters.query, 300);

  // Filter options
  const filterOptions = useMemo(() => {
    const sources = [...new Set(opportunities.map(o => o.source))];
    const allKeywords = [...new Set(opportunities.flatMap(o => o.matched_keywords))];
    
    return {
      sources,
      keywords: allKeywords.slice(0, 20)
    };
  }, [opportunities]);

  // Filtered results
  const filteredOpportunities = useMemo(() => {
    let filtered = [...opportunities];

    // Text search
    if (debouncedQuery.trim()) {
      const query = debouncedQuery.toLowerCase().trim();
      filtered = filtered.filter(opp => 
        opp.title?.toLowerCase().includes(query) ||
        opp.content.toLowerCase().includes(query) ||
        opp.author.toLowerCase().includes(query) ||
        opp.matched_keywords.some(keyword => keyword.toLowerCase().includes(query))
      );
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(opp => opp.status === filters.status);
    }

    // Source filter
    if (filters.source !== 'all') {
      filtered = filtered.filter(opp => opp.source === filters.source);
    }

    // Score filter
    if (filters.minScore > 0) {
      filtered = filtered.filter(opp => opp.total_score >= filters.minScore / 100);
    }

    // Date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const cutoff = new Date();
      
      switch (filters.dateRange) {
        case 'today':
          cutoff.setHours(0, 0, 0, 0);
          break;
        case '7d':
          cutoff.setDate(now.getDate() - 7);
          break;
        case '30d':
          cutoff.setDate(now.getDate() - 30);
          break;
      }
      
      filtered = filtered.filter(opp => new Date(opp.created_at) >= cutoff);
    }

    // Keyword filter
    if (filters.hasKeywords.length > 0) {
      filtered = filtered.filter(opp => 
        filters.hasKeywords.some(keyword => 
          opp.matched_keywords.includes(keyword)
        )
      );
    }

    // Sort by total score (highest first)
    filtered.sort((a, b) => b.total_score - a.total_score);

    return filtered;
  }, [opportunities, debouncedQuery, filters.status, filters.source, filters.minScore, filters.dateRange, filters.hasKeywords]);

  const updateFilters = useCallback((updates: Partial<SearchFilters>) => {
    setFilters(prev => ({ ...prev, ...updates }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(initialFilters);
  }, []);

  const hasActiveFilters = filters.query || filters.status !== 'all' || filters.source !== 'all' || 
                          filters.minScore > 0 || filters.dateRange !== 'all' || filters.hasKeywords.length > 0;

  return {
    filters,
    filteredOpportunities,
    filterOptions,
    isSearching,
    hasActiveFilters,
    updateFilters,
    clearFilters
  };
}

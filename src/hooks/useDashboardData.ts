/**
 * Custom hook for dashboard data management
 * 
 * Provides:
 * - Data fetching
 * - Auto-refresh
 * - Error handling
 * - Loading states
 */

import { useState, useEffect, useCallback } from 'react';
import { listOpportunities } from '@/lib/api/opportunities';
import { listKeywordSearches } from '@/lib/api/keyword-searches';
import type { Opportunity } from '@/types/opportunity';
import type { KeywordSearch } from '@/types/keyword-search';

export interface DashboardStats {
  totalOpportunities: number;
  activeSearches: number;
  thisMonth: number;
  responseRate: number;
}

export interface DashboardData {
  opportunities: Opportunity[];
  keywordSearches: KeywordSearch[];
  stats: DashboardStats;
}

export interface UseDashboardDataOptions {
  autoRefresh?: boolean;
  refreshInterval?: number; // in milliseconds
  opportunitiesLimit?: number;
}

export function useDashboardData(options: UseDashboardDataOptions = {}) {
  const {
    autoRefresh = true,
    refreshInterval = 30000, // 30 seconds
    opportunitiesLimit = 10,
  } = options;

  const [data, setData] = useState<DashboardData>({
    opportunities: [],
    keywordSearches: [],
    stats: {
      totalOpportunities: 0,
      activeSearches: 0,
      thisMonth: 0,
      responseRate: 0,
    },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateStats = useCallback((
    opportunities: Opportunity[],
    searches: KeywordSearch[]
  ): DashboardStats => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const thisMonthOpps = opportunities.filter(
      opp => new Date(opp.created_at) >= startOfMonth
    );

    const activeSearches = searches.filter(s => s.enabled).length;
    
    // Calculate response rate (opportunities with status beyond 'new')
    const respondedOpps = opportunities.filter(
      opp => opp.status !== 'new'
    );
    const responseRate = opportunities.length > 0
      ? Math.round((respondedOpps.length / opportunities.length) * 100)
      : 0;

    return {
      totalOpportunities: opportunities.length,
      activeSearches,
      thisMonth: thisMonthOpps.length,
      responseRate,
    };
  }, []);

  const loadData = useCallback(async (showRefreshing = false) => {
    try {
      if (showRefreshing) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      // Fetch data in parallel
      const [opportunitiesResponse, searchesData] = await Promise.all([
        listOpportunities({ limit: opportunitiesLimit, offset: 0 }),
        listKeywordSearches(),
      ]);

      const opportunitiesData = opportunitiesResponse.items;

      const stats = calculateStats(opportunitiesData, searchesData);

      setData({
        opportunities: opportunitiesData,
        keywordSearches: searchesData,
        stats,
      });
    } catch (err: any) {
      console.error('Failed to load dashboard data:', err);
      setError(err?.detail || err?.message || 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [opportunitiesLimit, calculateStats]);

  // Initial load
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      loadData(true);
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, loadData]);

  // Update stats when opportunities change
  const updateOpportunityInData = useCallback((updated: Opportunity) => {
    setData(prev => {
      const updatedOpportunities = prev.opportunities.map(
        opp => opp.id === updated.id ? updated : opp
      );
      const newStats = calculateStats(updatedOpportunities, prev.keywordSearches);
      return {
        ...prev,
        opportunities: updatedOpportunities,
        stats: newStats,
      };
    });
  }, [calculateStats]);

  return {
    data,
    isLoading,
    isRefreshing,
    error,
    refresh: () => loadData(true),
    reload: () => loadData(false),
    updateOpportunity: updateOpportunityInData,
  };
}


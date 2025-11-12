/**
 * Global Search Service
 * 
 * Provides unified search across opportunities and keyword searches
 */

import { listOpportunities } from '@/lib/api/opportunities';
import { listKeywordSearches } from '@/lib/api/keyword-searches';
import type { Opportunity } from '@/types/opportunity';
import type { KeywordSearch } from '@/types/keyword-search';

export interface SearchResult {
  type: 'opportunity' | 'keyword_search';
  id: string;
  title: string;
  subtitle?: string;
  url: string;
  metadata?: Record<string, any>;
}

export interface SearchResults {
  opportunities: SearchResult[];
  keywordSearches: SearchResult[];
  total: number;
}

const SEARCH_CACHE_KEY = 'global_search_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface CachedResult {
  query: string;
  results: SearchResults;
  timestamp: number;
}

/**
 * Get cached search results
 */
function getCachedResults(query: string): SearchResults | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const cached = localStorage.getItem(SEARCH_CACHE_KEY);
    if (!cached) return null;
    
    const cache: CachedResult[] = JSON.parse(cached);
    const cachedItem = cache.find(item => item.query.toLowerCase() === query.toLowerCase());
    
    if (cachedItem && Date.now() - cachedItem.timestamp < CACHE_DURATION) {
      return cachedItem.results;
    }
    
    return null;
  } catch {
    return null;
  }
}

/**
 * Cache search results
 */
function cacheResults(query: string, results: SearchResults): void {
  if (typeof window === 'undefined') return;
  
  try {
    const cached = localStorage.getItem(SEARCH_CACHE_KEY);
    const cache: CachedResult[] = cached ? JSON.parse(cached) : [];
    
    // Remove old cache entries (keep last 10)
    const filteredCache = cache
      .filter(item => Date.now() - item.timestamp < CACHE_DURATION)
      .slice(-9);
    
    // Add new result
    filteredCache.push({
      query,
      results,
      timestamp: Date.now(),
    });
    
    localStorage.setItem(SEARCH_CACHE_KEY, JSON.stringify(filteredCache));
  } catch {
    // Ignore cache errors
  }
}

/**
 * Search opportunities
 */
async function searchOpportunities(query: string, limit: number = 10): Promise<SearchResult[]> {
  try {
    const response = await listOpportunities({
      limit: 100, // Get more to filter client-side
      offset: 0,
    });
    
    // Handle both response formats: { items: [] } or direct array
    const opportunities = Array.isArray(response) ? response : (response.items || []);
    const lowerQuery = query.toLowerCase();
    
    // Client-side filtering (since API might not support search param)
    const filtered = opportunities.filter(opp => {
      const title = opp.title?.toLowerCase() || '';
      const content = opp.content?.toLowerCase() || '';
      const author = opp.author?.toLowerCase() || '';
      const keywords = opp.matched_keywords?.join(' ').toLowerCase() || '';
      
      return (
        title.includes(lowerQuery) ||
        content.includes(lowerQuery) ||
        author.includes(lowerQuery) ||
        keywords.includes(lowerQuery)
      );
    });
    
    return filtered.slice(0, limit).map(opp => ({
      type: 'opportunity' as const,
      id: opp.id,
      title: opp.title || 'Untitled Opportunity',
      subtitle: `${opp.author || 'Unknown'} • ${opp.source || 'Unknown'}`,
      url: `/dashboard/opportunities?highlight=${opp.id}`,
      metadata: {
        status: opp.status,
        score: opp.total_score,
        source: opp.source,
      },
    }));
  } catch (error) {
    console.error('Error searching opportunities:', error);
    return [];
  }
}

/**
 * Search keyword searches
 */
async function searchKeywordSearches(query: string, limit: number = 5): Promise<SearchResult[]> {
  try {
    const searches = await listKeywordSearches();
    const lowerQuery = query.toLowerCase();
    
    // Client-side filtering
    const filtered = searches.filter(search => {
      const name = search.name?.toLowerCase() || '';
      const keywords = search.keywords?.join(' ').toLowerCase() || '';
      
      return name.includes(lowerQuery) || keywords.includes(lowerQuery);
    });
    
    return filtered.slice(0, limit).map(search => ({
      type: 'keyword_search' as const,
      id: search.id,
      title: search.name || 'Unnamed Search',
      subtitle: `${search.keywords?.length || 0} keywords • ${search.enabled ? 'Active' : 'Paused'}`,
      url: `/dashboard/keyword-searches`,
      metadata: {
        enabled: search.enabled,
        keywordCount: search.keywords?.length || 0,
      },
    }));
  } catch (error) {
    console.error('Error searching keyword searches:', error);
    return [];
  }
}

/**
 * Perform global search
 */
export async function performGlobalSearch(query: string): Promise<SearchResults> {
  // Check cache first
  const cached = getCachedResults(query);
  if (cached) {
    return cached;
  }
  
  // Minimum 2 characters
  if (query.length < 2) {
    return {
      opportunities: [],
      keywordSearches: [],
      total: 0,
    };
  }
  
  // Perform searches in parallel
  const [opportunities, keywordSearches] = await Promise.all([
    searchOpportunities(query, 10),
    searchKeywordSearches(query, 5),
  ]);
  
  const results: SearchResults = {
    opportunities,
    keywordSearches,
    total: opportunities.length + keywordSearches.length,
  };
  
  // Cache results
  cacheResults(query, results);
  
  return results;
}

/**
 * Clear search cache
 */
export function clearSearchCache(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SEARCH_CACHE_KEY);
}


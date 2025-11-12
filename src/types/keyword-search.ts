/**
 * Keyword Search Types
 * 
 * TypeScript types for keyword search-related data
 */

export interface KeywordSearch {
  id: string;
  name: string;
  keywords: string[];
  patterns: string[];
  subreddits: string[];
  platforms: string[];
  enabled: boolean;
  created_at: string;
  updated_at: string;
  // Removed: user_id, last_run_at, zola_search_id, deleted_at (not needed/not exposed)
}

export interface KeywordSearchCreate {
  name: string;
  keywords: string[];
  patterns?: string[];
  subreddits?: string[];
  platforms?: string[];
  enabled?: boolean;
}

export interface KeywordSearchUpdate {
  name?: string;
  keywords?: string[];
  patterns?: string[];
  subreddits?: string[];
  platforms?: string[];
  enabled?: boolean;
}


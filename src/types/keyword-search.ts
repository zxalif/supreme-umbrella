/**
 * Keyword Search Types
 * 
 * TypeScript types for keyword search-related data
 */

export interface KeywordSearch {
  id: string;
  user_id: string;
  name: string;
  keywords: string[];
  patterns: string[];
  subreddits: string[];
  platforms: string[];
  enabled: boolean;
  created_at: string;
  updated_at: string;
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


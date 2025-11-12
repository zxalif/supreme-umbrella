/**
 * Opportunity Types
 * 
 * TypeScript types for opportunity-related data
 */

export interface ExtractedInfo {
  budget?: string | number;
  budget_min?: number | string;
  budget_max?: number | string;
  budget_currency?: string;
  timeline?: string;
  deadline?: string;
  requirements?: string[];
  skills?: string[];
  location?: string;
  remote?: boolean;
  payment_method?: string;
  [key: string]: any; // Allow additional fields
}

export interface Opportunity {
  id: string;
  user_id: string;
  keyword_search_id: string;
  source_post_id: string;
  source: string;
  source_type: string;
  title: string | null;
  content: string;
  author: string;
  url: string;
  matched_keywords: string[];
  detected_pattern: string | null;
  opportunity_type: string | null;
  opportunity_subtype: string | null;
  relevance_score: number;
  urgency_score: number;
  total_score: number;
  extracted_info: ExtractedInfo | null;
  status: OpportunityStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export type OpportunityStatus = 
  | 'new' 
  | 'viewed' 
  | 'contacted' 
  | 'applied' 
  | 'rejected' 
  | 'won' 
  | 'lost';

export interface OpportunityUpdate {
  status?: OpportunityStatus;
  notes?: string;
}

export interface OpportunityFilters {
  keyword_search_id?: string;
  status?: OpportunityStatus;
  source?: string;
  search?: string; // Search by keyword in title/content
  min_score?: number; // Minimum total score
  max_score?: number; // Maximum total score
  min_relevance?: number; // Minimum relevance score
  sort_by?: 'score' | 'relevance' | 'date' | 'urgency';
  sort_order?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface GenerateOpportunitiesResponse {
  opportunities_created: number;
  opportunities_skipped: number;
  opportunities: Opportunity[];
  message: string;
  cooldown_message?: string; // Optional cooldown message from backend
}

export interface GenerateOpportunitiesJobResponse {
  job_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  message: string;
}

export interface GenerateOpportunitiesJobStatus {
  job_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  progress: number;
  message: string;
  result: GenerateOpportunitiesResponse | null;
  error: string | null;
  created_at: string;
  updated_at: string;
}


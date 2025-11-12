/**
 * Opportunities API Functions
 * 
 * Centralized API calls for opportunity management
 */

import { apiGet, apiPost, apiPut, apiPatch, apiDelete, ApiClientError } from './client';
import type { 
  Opportunity, 
  OpportunityUpdate, 
  OpportunityFilters,
  GenerateOpportunitiesResponse,
  GenerateOpportunitiesJobResponse,
  GenerateOpportunitiesJobStatus
} from '@/types/opportunity';

/**
 * List opportunities with filters
 */
export interface PaginatedOpportunitiesResponse {
  items: Opportunity[];
  total: number;
  limit: number;
  offset: number;
  has_more: boolean;
}

export async function listOpportunities(filters?: OpportunityFilters): Promise<PaginatedOpportunitiesResponse> {
  try {
    const params = new URLSearchParams();
    if (filters?.keyword_search_id) {
      params.append('keyword_search_id', filters.keyword_search_id);
    }
    if (filters?.status) {
      params.append('status', filters.status);
    }
    if (filters?.source) {
      params.append('source', filters.source);
    }
    if (filters?.limit) {
      params.append('limit', filters.limit.toString());
    }
    if (filters?.offset) {
      params.append('offset', filters.offset.toString());
    }

    const queryString = params.toString();
    const url = `/api/v1/opportunities${queryString ? `?${queryString}` : ''}`;
    const response = await apiGet<PaginatedOpportunitiesResponse>(url);
    return response;
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error;
    }
    throw new ApiClientError(0, { detail: 'Failed to fetch opportunities' });
  }
}

/**
 * Get a single opportunity by ID
 */
export async function getOpportunity(id: string): Promise<Opportunity> {
  try {
    const response = await apiGet<Opportunity>(`/api/v1/opportunities/${id}`);
    return response;
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error;
    }
    throw new ApiClientError(0, { detail: 'Failed to fetch opportunity' });
  }
}

/**
 * Update an opportunity
 */
export async function updateOpportunity(
  id: string,
  data: OpportunityUpdate
): Promise<Opportunity> {
  try {
    // Use PATCH method to match backend endpoint
    const response = await apiPatch<Opportunity>(`/api/v1/opportunities/${id}`, data);
    return response;
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error;
    }
    throw new ApiClientError(0, { detail: 'Failed to update opportunity' });
  }
}

/**
 * Delete an opportunity
 */
export async function deleteOpportunity(id: string): Promise<void> {
  try {
    await apiDelete(`/api/v1/opportunities/${id}`);
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error;
    }
    throw new ApiClientError(0, { detail: 'Failed to delete opportunity' });
  }
}

/**
 * Start generating opportunities for a keyword search (returns job ID)
 */
export async function startGenerateOpportunities(
  keywordSearchId: string,
  limit: number = 100,
  forceRefresh: boolean = false
): Promise<GenerateOpportunitiesJobResponse> {
  try {
    const params = new URLSearchParams();
    params.append('keyword_search_id', keywordSearchId);
    params.append('limit', limit.toString());
    if (forceRefresh) {
      params.append('force_refresh', 'true');
    }
    
    const url = `/api/v1/opportunities/generate?${params.toString()}`;
    console.log(`[API] Generating opportunities with force_refresh=${forceRefresh}, URL: ${url}`);
    
    const response = await apiPost<GenerateOpportunitiesJobResponse>(url);
    return response;
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error;
    }
    throw new ApiClientError(0, { detail: 'Failed to start opportunity generation' });
  }
}

/**
 * Get status of opportunity generation job
 */
export async function getGenerationJobStatus(
  jobId: string
): Promise<GenerateOpportunitiesJobStatus> {
  try {
    const response = await apiGet<GenerateOpportunitiesJobStatus>(
      `/api/v1/opportunities/generate/${jobId}/status`
    );
    return response;
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error;
    }
    throw new ApiClientError(0, { detail: 'Failed to get job status' });
  }
}

/**
 * Get active job for a keyword search (if one exists)
 */
export async function getActiveJobForSearch(
  keywordSearchId: string
): Promise<GenerateOpportunitiesJobStatus | null> {
  try {
    const response = await apiGet<GenerateOpportunitiesJobStatus>(
      `/api/v1/opportunities/generate/active/${keywordSearchId}`
    );
    return response;
  } catch (error) {
    if (error instanceof ApiClientError) {
      // 404 means no active job - that's fine
      if (error.status === 404) {
        return null;
      }
      throw error;
    }
    throw new ApiClientError(0, { detail: 'Failed to check active job' });
  }
}

/**
 * Generate opportunities for a keyword search (with polling)
 * This is a convenience function that starts the job and polls until complete
 */
export async function generateOpportunities(
  keywordSearchId: string,
  limit: number = 100,
  onProgress?: (progress: number, message: string) => void,
  forceRefresh: boolean = false
): Promise<GenerateOpportunitiesResponse> {
  try {
    // Start the job
    const jobResponse = await startGenerateOpportunities(keywordSearchId, limit, forceRefresh);
    const jobId = jobResponse.job_id;

    // Poll for status until complete
    const maxAttempts = 120; // 10 minutes max (5s intervals)
    const pollInterval = 5000; // 5 seconds
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      await new Promise(resolve => setTimeout(resolve, pollInterval));
      
      const status = await getGenerationJobStatus(jobId);
      
      // Update progress callback
      if (onProgress) {
        onProgress(status.progress, status.message);
      }
      
      // Check if completed
      if (status.status === 'completed') {
        if (status.result) {
          return status.result;
        } else {
          throw new ApiClientError(0, { detail: 'Job completed but no result returned' });
        }
      }
      
      // Check if failed
      if (status.status === 'failed') {
        throw new ApiClientError(0, { 
          detail: status.error || 'Opportunity generation failed' 
        });
      }
      
      // Continue polling if still processing
      if (status.status === 'pending' || status.status === 'processing') {
        continue;
      }
    }
    
    // Timeout
    throw new ApiClientError(0, { detail: 'Opportunity generation timed out' });
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error;
    }
    throw new ApiClientError(0, { detail: 'Failed to generate opportunities' });
  }
}

/**
 * Export opportunities as CSV
 */
export async function exportOpportunitiesCSV(filters?: OpportunityFilters): Promise<Blob> {
  try {
    const params = new URLSearchParams();
    if (filters?.keyword_search_id) {
      params.append('keyword_search_id', filters.keyword_search_id);
    }
    if (filters?.status) {
      params.append('status', filters.status);
    }

    const queryString = params.toString();
    const url = `/api/v1/opportunities/export/csv${queryString ? `?${queryString}` : ''}`;
    
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7300';
    const token = localStorage.getItem('auth_token');
    
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new ApiClientError(response.status, { detail: 'Failed to export opportunities' });
    }

    return await response.blob();
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error;
    }
    throw new ApiClientError(0, { detail: 'Failed to export opportunities' });
  }
}


/**
 * Keyword Searches API Functions
 * 
 * Centralized API calls for keyword search management
 */

import { apiGet, apiPost, apiPut, apiDelete, ApiClientError } from './client';
import type { KeywordSearch, KeywordSearchCreate, KeywordSearchUpdate } from '@/types/keyword-search';

/**
 * List all keyword searches
 */
export async function listKeywordSearches(enabled?: boolean): Promise<KeywordSearch[]> {
  try {
    const params = enabled !== undefined ? `?enabled=${enabled}` : '';
    const response = await apiGet<KeywordSearch[]>(`/api/v1/keyword-searches${params}`);
    return response;
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error;
    }
    throw new ApiClientError(0, { detail: 'Failed to fetch keyword searches' });
  }
}

/**
 * Get a single keyword search by ID
 */
export async function getKeywordSearch(id: string): Promise<KeywordSearch> {
  try {
    const response = await apiGet<KeywordSearch>(`/api/v1/keyword-searches/${id}`);
    return response;
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error;
    }
    throw new ApiClientError(0, { detail: 'Failed to fetch keyword search' });
  }
}

/**
 * Create a new keyword search
 */
export async function createKeywordSearch(data: KeywordSearchCreate): Promise<KeywordSearch> {
  try {
    const response = await apiPost<KeywordSearch>('/api/v1/keyword-searches', data);
    return response;
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error;
    }
    throw new ApiClientError(0, { detail: 'Failed to create keyword search' });
  }
}

/**
 * Update a keyword search
 */
export async function updateKeywordSearch(
  id: string,
  data: KeywordSearchUpdate
): Promise<KeywordSearch> {
  try {
    const response = await apiPut<KeywordSearch>(`/api/v1/keyword-searches/${id}`, data);
    return response;
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error;
    }
    throw new ApiClientError(0, { detail: 'Failed to update keyword search' });
  }
}

/**
 * Delete a keyword search
 */
export async function deleteKeywordSearch(id: string): Promise<void> {
  try {
    await apiDelete(`/api/v1/keyword-searches/${id}`);
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error;
    }
    throw new ApiClientError(0, { detail: 'Failed to delete keyword search' });
  }
}


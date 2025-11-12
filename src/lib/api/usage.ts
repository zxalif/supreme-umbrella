/**
 * Usage API Functions
 * 
 * Centralized API calls for usage tracking
 */

import { apiGet, ApiClientError } from './client';

export interface UsageMetric {
  current: number;
  limit: number;
  allowed: boolean;
  remaining: number;
}

export interface UsageResponse {
  keyword_searches: UsageMetric;
  opportunities_per_month: UsageMetric;
  api_calls_per_month: UsageMetric;
}

export interface UsageLimitsResponse {
  plan: string;
  limits: {
    keyword_searches: number;
    opportunities_per_month: number;
    api_calls_per_month: number;
  };
}

export interface UsageCheckResponse {
  allowed: boolean;
  current: number;
  limit: number;
  remaining: number;
}

/**
 * Get all usage metrics for current user
 */
export async function getUsage(): Promise<UsageResponse> {
  try {
    const response = await apiGet<UsageResponse>('/api/v1/usage');
    return response;
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error;
    }
    throw new ApiClientError(0, { detail: 'Failed to fetch usage data' });
  }
}

/**
 * Get usage limits for current subscription
 */
export async function getUsageLimits(): Promise<UsageLimitsResponse> {
  try {
    const response = await apiGet<UsageLimitsResponse>('/api/v1/usage/limits');
    return response;
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error;
    }
    throw new ApiClientError(0, { detail: 'Failed to fetch usage limits' });
  }
}

/**
 * Check if user can perform an action (hasn't reached limit)
 */
export async function checkUsageLimit(metricType: string): Promise<UsageCheckResponse> {
  try {
    const response = await apiGet<UsageCheckResponse>(`/api/v1/usage/check/${metricType}`);
    return response;
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error;
    }
    throw new ApiClientError(0, { detail: `Failed to check usage limit for ${metricType}` });
  }
}


/**
 * Centralized API Client
 * 
 * Handles all API requests with:
 * - Base URL configuration
 * - Authentication token management
 * - Error handling
 * - Request/response interceptors
 * - Analytics tracking for errors
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7300';

// Lazy import analytics to avoid circular dependencies
let trackApiError: ((endpoint: string, status: number, message: string) => void) | null = null;
if (typeof window !== 'undefined') {
  // Only import on client side
  import('@/lib/analytics').then(({ errors }) => {
    trackApiError = errors.trackApiError;
  }).catch(() => {
    // Analytics not available - silently skip
  });
}

export interface ApiError {
  detail: string | {
    message: string;
    error_code?: string;
    error_type?: string;
    paddle_error?: string;
    documentation_url?: string;
    request_id?: string;
    raw_error?: string;
  } | Array<{
    type: string;
    loc: (string | number)[];
    msg: string;
    input?: any;
    ctx?: any;
  }>;
  message?: string;
  errors?: Record<string, string[]>;
}

/**
 * Extract error message from API error response
 * Handles Pydantic validation errors and other error formats
 */
export function extractErrorMessage(error: ApiError | any): string {
  if (!error) return 'An unknown error occurred';
  
  // If it's already a string
  if (typeof error === 'string') {
    return error;
  }
  
  // If it has a detail field
  if (error.detail) {
    // If detail is a string, return it
    if (typeof error.detail === 'string') {
      return error.detail;
    }
    
    // If detail is an object with a message
    if (typeof error.detail === 'object' && error.detail.message) {
      return error.detail.message;
    }
    
    // If detail is an array (Pydantic validation errors)
    if (Array.isArray(error.detail)) {
      return error.detail
        .map((err: any) => {
          const field = Array.isArray(err.loc) ? err.loc.slice(1).join('.') : 'field';
          return `${field}: ${err.msg}`;
        })
        .join(', ');
    }
  }
  
  // If it has a message field
  if (error.message) {
    return typeof error.message === 'string' ? error.message : 'An error occurred';
  }
  
  // Fallback
  return 'An unknown error occurred';
}

export class ApiClientError extends Error {
  constructor(
    public status: number,
    public data: ApiError,
    message?: string
  ) {
    super(message || data.detail || 'API request failed');
    this.name = 'ApiClientError';
  }
}

/**
 * Get authentication token from storage
 */
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
}

/**
 * Set authentication token in storage
 */
export function setAuthToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('auth_token', token);
}

/**
 * Remove authentication token from storage
 */
export function removeAuthToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('auth_token');
}

/**
 * Get refresh token from storage
 */
export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('refresh_token');
}

/**
 * Set refresh token in storage
 */
export function setRefreshToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('refresh_token', token);
}

/**
 * Remove refresh token from storage
 */
export function removeRefreshToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('refresh_token');
}

/**
 * Remove all auth tokens
 */
export function clearAuthTokens(): void {
  removeAuthToken();
  removeRefreshToken();
}

// Flag to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

/**
 * Refresh access token using refresh token
 */
async function refreshAccessToken(): Promise<string | null> {
  // If already refreshing, return the existing promise
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        return null;
      }

      const response = await fetch(`${API_BASE_URL}/api/v1/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (!response.ok) {
        // Refresh failed, clear tokens
        clearAuthTokens();
        return null;
      }

      const data = await response.json();
      
      // Store new tokens
      if (data.access_token) {
        setAuthToken(data.access_token);
      }
      if (data.refresh_token) {
        setRefreshToken(data.refresh_token);
      }

      return data.access_token;
    } catch (error) {
      // Refresh failed, clear tokens
      clearAuthTokens();
      return null;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

/**
 * Make API request with automatic token handling and refresh
 */
export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {},
  retryOn401: boolean = true
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  let token = getAuthToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);

    // Handle 401 Unauthorized - try to refresh token
    if (response.status === 401 && retryOn401 && endpoint !== '/api/v1/auth/refresh') {
      const newToken = await refreshAccessToken();
      
      if (newToken) {
        // Retry the request with new token
        headers['Authorization'] = `Bearer ${newToken}`;
        const retryResponse = await fetch(url, { ...config, headers });
        
        // Handle 204 No Content (empty response)
        if (retryResponse.status === 204) {
          return {} as T;
        }

        // Handle empty responses
        const contentType = retryResponse.headers.get('content-type');
        const contentLength = retryResponse.headers.get('content-length');
        
        if (contentLength === '0' || !contentType) {
          if (retryResponse.ok) {
            return {} as T;
          } else {
            throw new ApiClientError(
              retryResponse.status,
              { detail: `HTTP ${retryResponse.status}: ${retryResponse.statusText}` }
            );
          }
        }

        // Handle non-JSON responses
        if (!contentType?.includes('application/json')) {
          if (!retryResponse.ok) {
            throw new ApiClientError(
              retryResponse.status,
              { detail: `HTTP ${retryResponse.status}: ${retryResponse.statusText}` }
            );
          }
          return {} as T;
        }

        // Parse JSON response
        let retryData;
        try {
          const text = await retryResponse.text();
          if (!text || text.trim() === '') {
            if (retryResponse.ok) {
              return {} as T;
            } else {
              throw new ApiClientError(
                retryResponse.status,
                { detail: `HTTP ${retryResponse.status}: ${retryResponse.statusText}` }
              );
            }
          }
          retryData = JSON.parse(text);
        } catch (parseError) {
          if (retryResponse.ok) {
            return {} as T;
          }
          throw new ApiClientError(
            retryResponse.status,
            { detail: `Failed to parse response: ${parseError instanceof Error ? parseError.message : 'Unknown error'}` }
          );
        }
        if (!retryResponse.ok) {
          throw new ApiClientError(retryResponse.status, retryData);
        }
        return retryData as T;
      } else {
        // Refresh failed, throw 401 error
        throw new ApiClientError(401, { detail: 'Authentication required' });
      }
    }

    // Handle 204 No Content (empty response)
    if (response.status === 204) {
      return {} as T;
    }

    // Handle empty responses (no content-type or empty body)
    const contentType = response.headers.get('content-type');
    const contentLength = response.headers.get('content-length');
    
    // Check if response has no body
    if (contentLength === '0' || !contentType) {
      if (response.ok) {
        return {} as T;
      } else {
        throw new ApiClientError(
          response.status,
          { detail: `HTTP ${response.status}: ${response.statusText}` }
        );
      }
    }

    // Handle non-JSON responses
    if (!contentType?.includes('application/json')) {
      if (!response.ok) {
        throw new ApiClientError(
          response.status,
          { detail: `HTTP ${response.status}: ${response.statusText}` }
        );
      }
      return {} as T;
    }

    // Parse JSON response
    let data;
    try {
      const text = await response.text();
      // If response is empty, return empty object
      if (!text || text.trim() === '') {
        if (response.ok) {
          return {} as T;
        } else {
          throw new ApiClientError(
            response.status,
            { detail: `HTTP ${response.status}: ${response.statusText}` }
          );
        }
      }
      data = JSON.parse(text);
    } catch (parseError) {
      // If JSON parsing fails, it might be an empty response
      if (response.ok) {
        return {} as T;
      }
      throw new ApiClientError(
        response.status,
        { detail: `Failed to parse response: ${parseError instanceof Error ? parseError.message : 'Unknown error'}` }
      );
    }

    if (!response.ok) {
      // Track API errors for analytics
      if (trackApiError) {
        const errorMessage = typeof data.detail === 'string' 
          ? data.detail 
          : (data.detail?.message || 'Unknown error');
        trackApiError(endpoint, response.status, errorMessage);
      }
      
      // Handle structured error responses (from backend)
      if (data.detail && typeof data.detail === 'object' && data.detail.message) {
        // Backend returns structured error with message
        throw new ApiClientError(response.status, {
          detail: data.detail.message,
          message: data.detail.message,
          error_code: data.detail.error_code,
          error_type: data.detail.error_type,
          paddle_error: data.detail.paddle_error,
          documentation_url: data.detail.documentation_url,
          request_id: data.detail.request_id,
        });
      }
      throw new ApiClientError(response.status, data);
    }

    return data as T;
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error;
    }

    // Network or other errors
    throw new ApiClientError(
      0,
      { detail: error instanceof Error ? error.message : 'Network error occurred' }
    );
  }
}

/**
 * GET request
 */
export async function apiGet<T = any>(endpoint: string): Promise<T> {
  return apiRequest<T>(endpoint, { method: 'GET' });
}

/**
 * POST request
 */
export async function apiPost<T = any>(
  endpoint: string,
  body?: any
): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
  });
}

/**
 * PUT request
 */
export async function apiPut<T = any>(
  endpoint: string,
  body?: any
): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: 'PUT',
    body: body ? JSON.stringify(body) : undefined,
  });
}

/**
 * PATCH request
 */
export async function apiPatch<T = any>(
  endpoint: string,
  body?: any
): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: 'PATCH',
    body: body ? JSON.stringify(body) : undefined,
  });
}

/**
 * DELETE request
 */
export async function apiDelete<T = any>(endpoint: string): Promise<T> {
  return apiRequest<T>(endpoint, { method: 'DELETE' });
}


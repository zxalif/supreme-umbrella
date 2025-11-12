/**
 * Authentication API Functions
 * 
 * Centralized authentication API calls
 */

import { 
  apiPost, 
  apiGet, 
  setAuthToken, 
  setRefreshToken,
  getRefreshToken,
  removeAuthToken, 
  removeRefreshToken,
  clearAuthTokens,
  ApiClientError 
} from './client';
import type { User, Subscription } from '@/types/user';

// Re-export ApiClientError for convenience
export { ApiClientError };
// Re-export User type for convenience
export type { User, Subscription };

export interface RegisterRequest {
  email: string;
  full_name: string;
  password: string;
  consent_data_processing: boolean;
  consent_marketing: boolean;
  consent_cookies: boolean;
}

export interface RegisterResponse {
  id: string;
  email: string;
  full_name: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: User;
}

export interface RefreshTokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: User;
}

// User type is now imported from @/types/user

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  new_password: string;
}

/**
 * Register a new user
 */
export async function register(data: RegisterRequest): Promise<RegisterResponse> {
  try {
    const response = await apiPost<RegisterResponse>('/api/v1/auth/register', data);
    return response;
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error;
    }
    throw new ApiClientError(0, { detail: 'Registration failed' });
  }
}

/**
 * Login user and store tokens
 */
export async function login(data: LoginRequest): Promise<LoginResponse> {
  try {
    const response = await apiPost<LoginResponse>('/api/v1/auth/login', data);
    
    // Store tokens automatically
    if (response.access_token) {
      setAuthToken(response.access_token);
    }
    if (response.refresh_token) {
      setRefreshToken(response.refresh_token);
    }
    
    return response;
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error;
    }
    throw new ApiClientError(0, { detail: 'Login failed' });
  }
}

/**
 * Get current user
 */
export async function getCurrentUser(): Promise<User> {
  try {
    const response = await apiGet<User>('/api/v1/users/me');
    return response;
  } catch (error) {
    if (error instanceof ApiClientError) {
      // If unauthorized after refresh attempt, clear all tokens
      if (error.status === 401) {
        clearAuthTokens();
      }
      throw error;
    }
    throw new ApiClientError(0, { detail: 'Failed to get user' });
  }
}

/**
 * Refresh access token using refresh token
 */
export async function refreshToken(): Promise<RefreshTokenResponse> {
  try {
    const response = await apiPost<RefreshTokenResponse>('/api/v1/auth/refresh', {
      refresh_token: getRefreshToken(),
    });
    
    // Store new tokens automatically
    if (response.access_token) {
      setAuthToken(response.access_token);
    }
    if (response.refresh_token) {
      setRefreshToken(response.refresh_token);
    }
    
    return response;
  } catch (error) {
    if (error instanceof ApiClientError) {
      // If refresh fails, clear all tokens
      clearAuthTokens();
      throw error;
    }
    throw new ApiClientError(0, { detail: 'Token refresh failed' });
  }
}

/**
 * Logout user (remove all tokens)
 */
export function logout(): void {
  clearAuthTokens();
}

/**
 * Request password reset
 */
export async function forgotPassword(data: ForgotPasswordRequest): Promise<void> {
  try {
    await apiPost('/api/v1/auth/forgot-password', data);
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error;
    }
    throw new ApiClientError(0, { detail: 'Failed to send password reset email' });
  }
}

/**
 * Reset password with token
 */
export async function resetPassword(data: ResetPasswordRequest): Promise<void> {
  try {
    await apiPost('/api/v1/auth/reset-password', data);
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error;
    }
    throw new ApiClientError(0, { detail: 'Failed to reset password' });
  }
}

export interface VerifyEmailRequest {
  token: string;
  user_id: string;
}

export interface VerifyEmailResponse {
  message: string;
  user: User;
}

export interface ResendVerificationRequest {
  email: string;
}

/**
 * Verify email address with token
 */
export async function verifyEmail(data: VerifyEmailRequest): Promise<VerifyEmailResponse> {
  try {
    const response = await apiPost<VerifyEmailResponse>('/api/v1/auth/verify-email', data);
    return response;
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error;
    }
    throw new ApiClientError(0, { detail: 'Email verification failed' });
  }
}

/**
 * Resend verification email
 */
export async function resendVerificationEmail(data: ResendVerificationRequest): Promise<void> {
  try {
    await apiPost('/api/v1/auth/resend-verification', data);
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error;
    }
    throw new ApiClientError(0, { detail: 'Failed to resend verification email' });
  }
}


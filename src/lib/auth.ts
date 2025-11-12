/**
 * Authentication Utilities
 * 
 * Helper functions for authentication checks and route protection
 */

import { getAuthToken } from './api/client';
import { useAuthStore } from '@/store/authStore';

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return !!getAuthToken();
}

/**
 * Require authentication - redirects to login if not authenticated
 * Use in client components or middleware
 */
export function requireAuth(): boolean {
  if (typeof window === 'undefined') return false;
  
  const token = getAuthToken();
  if (!token) {
    window.location.href = '/login';
    return false;
  }
  
  return true;
}

/**
 * Redirect authenticated users away from auth pages
 * Use in login/register pages
 */
export function redirectIfAuthenticated(): void {
  if (typeof window === 'undefined') return;
  
  const token = getAuthToken();
  if (token) {
    window.location.href = '/dashboard';
  }
}


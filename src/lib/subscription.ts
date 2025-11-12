/**
 * Subscription Utilities
 * 
 * Helper functions for subscription checks and redirects
 */

import { getCurrentSubscription } from './api/subscriptions';
import type { User } from './api/auth';

/**
 * Check if user has an active subscription
 * Includes free plan users (they have active status)
 */
export function hasActiveSubscription(user: User | null): boolean {
  if (!user) return false;
  // Free plan users have active subscription status
  return !!user.subscription && user.subscription.status === 'active';
}

/**
 * Get redirect path based on user subscription status
 * - If no subscription: redirect to /dashboard/subscription
 * - If has subscription: redirect to /dashboard
 */
export function getPostAuthRedirect(user: User | null): string {
  if (!user) {
    return '/login';
  }
  
  if (!hasActiveSubscription(user)) {
    return '/dashboard/subscription';
  }
  
  return '/dashboard';
}


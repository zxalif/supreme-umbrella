/**
 * User Types
 * 
 * TypeScript types for user-related data
 */

export interface User {
  id: string;
  email: string;
  full_name: string;
  is_active: boolean;
  is_verified: boolean;
  subscription?: Subscription;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  plan: 'starter' | 'professional' | 'power';
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
}


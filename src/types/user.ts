/**
 * User Types
 * 
 * TypeScript types for user-related data
 */

import type { Subscription } from './subscription';

// Re-export Subscription for convenience
export type { Subscription };

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


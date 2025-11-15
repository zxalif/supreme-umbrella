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
  subscription?: Subscription;
  email_notifications_enabled?: boolean;
  is_verified?: boolean;  // Included for authenticated users to show verification status
  // Note: is_active, created_at, updated_at are excluded
  // as they are not used by the frontend and are handled server-side
}


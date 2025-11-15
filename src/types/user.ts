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
  // Note: is_active, is_verified, created_at, updated_at are excluded
  // as they are not used by the frontend and are handled server-side
}


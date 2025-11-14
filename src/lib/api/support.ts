import { apiGet, apiPost, extractErrorMessage } from './client';

/**
 * Support Thread Types
 */
export interface SupportThread {
  id: string;
  subject: string;
  status: 'open' | 'closed' | 'pending';
  created_at: string;
  updated_at: string;
  last_message_at?: string;
  unread_count?: number;
}

export interface SupportMessage {
  id: string;
  thread_id: string;
  content: string;
  sender: 'user' | 'support';
  read: boolean;
  created_at: string;
}

export interface CreateThreadRequest {
  subject: string;
  message: string;
}

export interface CreateMessageRequest {
  content: string;
}

/**
 * Get all support threads for the current user
 */
export async function getSupportThreads(): Promise<SupportThread[]> {
  try {
    return await apiGet<SupportThread[]>('/api/v1/support/threads');
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'Failed to fetch support threads'));
  }
}

/**
 * Get a specific support thread with messages
 */
export async function getSupportThread(threadId: string): Promise<{
  thread: SupportThread;
  messages: SupportMessage[];
}> {
  try {
    return await apiGet<{
      thread: SupportThread;
      messages: SupportMessage[];
    }>(`/api/v1/support/threads/${threadId}`);
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'Failed to fetch support thread'));
  }
}

/**
 * Create a new support thread
 */
export async function createSupportThread(
  data: CreateThreadRequest
): Promise<SupportThread> {
  try {
    return await apiPost<SupportThread>(
      '/api/v1/support/threads',
      data
    );
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'Failed to create support thread'));
  }
}

/**
 * Add a message to a support thread
 */
export async function addMessageToThread(
  threadId: string,
  data: CreateMessageRequest
): Promise<SupportMessage> {
  try {
    return await apiPost<SupportMessage>(
      `/api/v1/support/threads/${threadId}/messages`,
      data
    );
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'Failed to send message'));
  }
}

/**
 * Get unread notification count
 * 
 * DISABLED: Notifications feature is not currently in use.
 * This function always returns 0 without making any API calls.
 */
export async function getUnreadNotificationCount(): Promise<number> {
  // Notifications are disabled - always return 0 without making API calls
  return 0;
}

/**
 * Set success page active state
 * 
 * DEPRECATED: No longer needed since notifications are disabled
 */
export function setSuccessPageActive(active: boolean): void {
  // No-op: Notifications are disabled
}


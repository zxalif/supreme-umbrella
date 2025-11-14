/**
 * Payments API Functions
 * 
 * Centralized API calls for payment operations
 */

import { apiPost, ApiClientError } from './client';

export interface VerifyTransactionRequest {
  transaction_id: string;
}

export interface VerifyTransactionResponse {
  status: 'success' | 'already_processed';
  message: string;
  payment_id?: string;
  subscription_id?: string;
  subscription_status?: string;
  plan?: string;
}

/**
 * Verify and complete a Paddle transaction
 */
export async function verifyTransaction(
  transactionId: string
): Promise<VerifyTransactionResponse> {
  try {
    const response = await apiPost<VerifyTransactionResponse>(
      '/api/v1/payments/verify-transaction',
      {
        transaction_id: transactionId,
      }
    );
    return response;
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error;
    }
    throw new ApiClientError(0, {
      detail: 'Failed to verify transaction. Please try again or contact support.',
    });
  }
}

/**
 * Mark a transaction as billed to lock quantity
 * 
 * This is called automatically via eventCallback when checkout is loaded.
 * Marking a transaction as billed prevents customers from changing quantity.
 */
export async function markTransactionBilled(
  transactionId: string
): Promise<{ status: string; message: string }> {
  try {
    const response = await apiPost<{ status: string; message: string }>(
      '/api/v1/payments/mark-transaction-billed',
      {
        transaction_id: transactionId,
      }
    );
    return response;
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error;
    }
    throw new ApiClientError(0, {
      detail: 'Failed to mark transaction as billed.',
    });
  }
}


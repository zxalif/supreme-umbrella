/**
 * Subscriptions API Functions
 * 
 * Centralized API calls for subscription management
 */

import { apiGet, apiPost, ApiClientError } from './client';
import type { Subscription, PlanLimitsResponse, CheckoutCreate, CheckoutResponse } from '@/types/subscription';

/**
 * Get current active subscription
 */
export async function getCurrentSubscription(): Promise<Subscription | null> {
  try {
    const response = await apiGet<Subscription>('/api/v1/subscriptions/current');
    return response;
  } catch (error) {
    if (error instanceof ApiClientError) {
      if (error.status === 404) {
        // No active subscription - return null
        return null;
      }
      throw error;
    }
    throw new ApiClientError(0, { detail: 'Failed to fetch subscription' });
  }
}

/**
 * Get subscription history
 */
export async function getSubscriptionHistory(): Promise<Subscription[]> {
  try {
    const response = await apiGet<Subscription[]>('/api/v1/subscriptions/history');
    return response;
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error;
    }
    throw new ApiClientError(0, { detail: 'Failed to fetch subscription history' });
  }
}

/**
 * Create a subscription (for testing - in production, use checkout)
 */
export async function createSubscription(plan: string): Promise<Subscription> {
  try {
    const response = await apiPost<Subscription>('/api/v1/subscriptions/create', { plan });
    return response;
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error;
    }
    throw new ApiClientError(0, { detail: 'Failed to create subscription' });
  }
}

/**
 * Cancel subscription
 */
export async function cancelSubscription(cancelAtPeriodEnd: boolean = true): Promise<{ message: string; subscription: Subscription }> {
  try {
    const response = await apiPost<{ message: string; subscription: Subscription }>(
      `/api/v1/subscriptions/cancel?cancel_at_period_end=${cancelAtPeriodEnd}`
    );
    return response;
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error;
    }
    throw new ApiClientError(0, { detail: 'Failed to cancel subscription' });
  }
}

/**
 * Get subscription plan limits
 */
export async function getSubscriptionLimits(): Promise<PlanLimitsResponse> {
  try {
    const response = await apiGet<PlanLimitsResponse>('/api/v1/subscriptions/limits');
    return response;
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error;
    }
    throw new ApiClientError(0, { detail: 'Failed to fetch subscription limits' });
  }
}

/**
 * Create checkout session
 * 
 * NOTE: Payment processing is currently not implemented.
 * This function is kept for future use when payment gateway is integrated.
 */
export async function createCheckout(
  plan: string,
  billingPeriod: 'monthly' | 'yearly' = 'monthly'
): Promise<CheckoutResponse> {
  try {
    const response = await apiPost<CheckoutResponse>('/api/v1/payments/paddle/create-checkout', {
      plan,
      billing_period: billingPeriod,
    });
    return response;
  } catch (error) {
    if (error instanceof ApiClientError) {
      // Re-throw with enhanced error information
      throw error;
    }
    throw new ApiClientError(0, { 
      detail: 'Failed to create checkout session. Please try again or contact support.' 
    });
  }
}


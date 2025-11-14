/**
 * Subscription Types
 * 
 * TypeScript types for subscription-related data
 */

export type SubscriptionPlan = 'free' | 'starter' | 'professional' | 'power';
export type SubscriptionStatus = 'active' | 'cancelled' | 'expired' | 'past_due' | 'trialing';

export interface Subscription {
  id: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
  // Removed: user_id, paddle_subscription_id (not needed/not exposed)
}

export interface SubscriptionLimits {
  keyword_searches: number;
  opportunities_per_month: number;
  api_calls_per_month: number;
}

export interface PlanLimitsResponse {
  plan: SubscriptionPlan;
  limits: SubscriptionLimits;
}

export interface CheckoutCreate {
  plan: SubscriptionPlan;
  billing_period?: 'monthly' | 'yearly';
}

export interface CheckoutResponse {
  checkout_url: string;
  transaction_id?: string;
  customer_id?: string;
  price_id?: string;  // Price ID for locking quantity in checkout
}

// Pricing plans configuration
export const PRICING_PLANS = {
  free: {
    name: 'Free',
    price: 0,
    description: '1-month free trial - Full access to validate the platform',
    features: [
      'Unlimited keyword searches',
      'Unlimited opportunities per month',
      'Reddit monitoring',
      'Email notifications',
      'Basic analytics',
      'Full feature access',
    ],
    limits: {
      keyword_searches: 999, // Effectively unlimited
      opportunities_per_month: 999999, // Effectively unlimited
      api_calls_per_month: 0,
    },
  },
  starter: {
    name: 'Starter',
    price: 19,
    yearlyPrice: 190, // 2 months free
    description: 'Perfect for new freelancers',
    features: [
      '2 concurrent keyword searches',
      '5 searches created per month',
      '50 opportunities per month',
      'Basic AI scoring',
      'Email notifications',
      'CSV export',
      '14-day opportunity history',
      'Reddit monitoring',
      'Mobile-responsive dashboard',
      'Basic analytics',
    ],
    limits: {
      keyword_searches: 2,
      opportunities_per_month: 50,
      api_calls_per_month: 0,
    },
  },
  professional: {
    name: 'Professional',
    price: 39,
    yearlyPrice: 390, // 2 months free
    description: 'Most popular for serious freelancers',
    features: [
      '5 concurrent keyword searches',
      '10 searches created per month',
      '200 opportunities per month',
      'Advanced AI scoring + insights',
      'Email notifications',
      'CSV/PDF export',
      '90-day opportunity history',
      'Advanced filtering',
      'Custom date ranges',
      'Saved insights',
      'Analytics dashboard',
      'Budget & location filtering',
      'Priority support (24-48h)',
      'SMS notifications (coming soon)',
    ],
    limits: {
      keyword_searches: 5,
      opportunities_per_month: 200,
      api_calls_per_month: 0,
    },
  },
  power: {
    name: 'Power',
    price: 79,
    yearlyPrice: 790, // 2 months free
    description: 'For power users and agencies',
    features: [
      '10 concurrent keyword searches',
      '20 searches created per month',
      '500 opportunities per month',
      'Premium AI scoring + predictions',
      'Email notifications',
      'Unlimited opportunity history',
      'Advanced filtering',
      'Custom date ranges',
      'Saved insights',
      'Analytics dashboard',
      'Budget & location filtering',
      'CSV/PDF/JSON export',
      'Dedicated support (12-24h)',
      'SMS notifications (coming soon)',
      'Webhook integrations (coming soon)',
      'Full API access (coming soon)',
    ],
    limits: {
      keyword_searches: 10,
      opportunities_per_month: 500,
      api_calls_per_month: 1000,
    },
  },
} as const;


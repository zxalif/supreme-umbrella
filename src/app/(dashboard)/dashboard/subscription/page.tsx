'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { PricingCard } from '@/components/subscription/PricingCard';
import { PlanComparison } from '@/components/subscription/PlanComparison';
import {
  getCurrentSubscription,
  createCheckout,
} from '@/lib/api/subscriptions';
import { PRICING_PLANS } from '@/types/subscription';
import type { SubscriptionPlan, Subscription } from '@/types/subscription';
import { ApiClientError, extractErrorMessage } from '@/lib/api/client';
import { showToast } from '@/components/ui/Toast';
import { usePaddle } from '@/components/providers/PaddleProvider';
import { AlertCircle, CheckCircle, CreditCard, Info } from 'lucide-react';

/**
 * Subscription Page
 * 
 * Select and subscribe to a plan
 */
export default function SubscriptionPage() {
  const router = useRouter();
  const { user, fetchUser } = useAuthStore();
  const { isReady: paddleReady, openCheckout } = usePaddle();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  
  // Check if Paddle is disabled
  const paddleEnabled = process.env.NEXT_PUBLIC_PADDLE_ENABLED !== 'false';

  useEffect(() => {
    loadSubscription();
  }, []);

  const loadSubscription = async () => {
    setIsLoading(true);
    try {
      const sub = await getCurrentSubscription();
      setSubscription(sub);
    } catch (err) {
      console.error('Failed to load subscription:', err);
      showToast.error('Failed to load subscription', extractErrorMessage(err as any, 'Failed to load subscription'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPlan = async (plan: SubscriptionPlan) => {
    // Don't allow selecting free plan (it's auto-assigned)
    if (plan === 'free') {
      setError('The free plan is automatically assigned to new users. Please select a paid plan to upgrade.');
      return;
    }

    // Check if Paddle is disabled (check BEFORE attempting payment)
    if (!paddleEnabled) {
      setError('Payment processing is currently unavailable. Please contact support@clienthunt.app for assistance.');
      showToast.error('Payment Unavailable', 'Payment processing is temporarily disabled. Please contact support for assistance.');
      return;
    }

    // Check if Paddle.js is ready
    if (!paddleReady) {
      setError('Payment system is loading. Please wait a moment and try again.');
      showToast.error('Payment System Loading', 'Paddle.js is still initializing. Please wait a moment.');
      return;
    }

    setError(null);
    setSuccess(null);
    setIsProcessing(plan);

    try {
      // Create Paddle checkout session (transaction) on backend
      const checkout = await createCheckout(plan, billingPeriod);
      
      // Use Paddle.js to open checkout overlay
      // Official Paddle method to lock quantity: deny quantity changes via eventCallback
      // Reference: https://developer.paddle.com/build/checkout/pass-update-checkout-items
      // Note: Cannot use both transactionId and items - must use one or the other
      // Since we create the transaction on the backend, we use transactionId only
      if (checkout.transaction_id) {
        // Use transactionId only (transaction already created on backend with quantity: 1)
        // The eventCallback will deny any quantity change attempts
        openCheckout({
          transactionId: checkout.transaction_id,
          customer: user?.email ? {
            email: user.email,
          } : undefined,
          settings: {
            displayMode: 'overlay',
            theme: 'light',
            locale: 'en',
            successUrl: `${window.location.origin}/dashboard/subscription/success?transaction_id=${checkout.transaction_id}`,
            allowLogout: false,
          },
          // Note: eventCallback with accept: false does NOT prevent quantity changes
          // The official method is to mark transaction as billed when checkout loads
          // This is handled in the global eventCallback in PaddleProvider
          // Reference: https://developer.paddle.com/build/checkout/pass-update-checkout-items
        });
        
        // Reset processing state after opening checkout
        // The checkout overlay will handle the rest
        setIsProcessing(null);
      } else if (checkout.checkout_url) {
        // Fallback: If no transaction_id but we have a checkout_url, redirect
        // This handles cases where Paddle returns a hosted checkout URL
        window.location.href = checkout.checkout_url;
      } else {
        throw new Error('No transaction ID or checkout URL received from server');
      }
    } catch (err: any) {
      if (err instanceof ApiClientError) {
        // Extract user-friendly error message
        let errorMessage = extractErrorMessage(err.data, 'Failed to create checkout session');
        
        // Transform technical error messages to user-friendly ones
        if (errorMessage.includes('Paddle payment gateway is disabled')) {
          errorMessage = 'Payment processing is currently unavailable. Please contact support@clienthunt.app for assistance.';
        } else if (errorMessage.includes('PADDLE_ENABLED') || errorMessage.includes('PADDLE_API_KEY')) {
          // Hide technical details from users
          errorMessage = 'Payment processing is temporarily unavailable. Please contact support@clienthunt.app for assistance.';
        }
        
        // Add additional context for specific error codes
        let displayMessage = errorMessage;
        const errorCode = (err.data as any)?.error_code || 
          (typeof err.data?.detail === 'object' && !Array.isArray(err.data.detail) && 'error_code' in err.data.detail 
            ? (err.data.detail as any).error_code 
            : undefined);
        
        if (errorCode === 'transaction_default_checkout_url_not_set') {
          displayMessage = `${errorMessage}\n\nPlease configure the default checkout URL in your Paddle dashboard under Checkout Settings.`;
        } else if (errorCode === 'paddle_disabled') {
          displayMessage = 'Payment processing is currently unavailable. Please contact support@clienthunt.app for assistance.';
        }
        
        setError(displayMessage);
        showToast.error('Payment Unavailable', displayMessage);
      } else {
        const errorMsg = err.message || 'An unexpected error occurred. Please try again or contact support.';
        // Hide technical messages
        const userFriendlyMsg = errorMsg.includes('Paddle') && errorMsg.includes('disabled')
          ? 'Payment processing is currently unavailable. Please contact support@clienthunt.app for assistance.'
          : errorMsg;
        setError(userFriendlyMsg);
        showToast.error('Payment Error', userFriendlyMsg);
      }
      setIsProcessing(null);
    }
  };

  const currentPlan = subscription?.plan as SubscriptionPlan | null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading subscription plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Choose Your Plan
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
          {subscription?.plan === 'free' 
            ? 'Upgrade to unlock premium features and scale your freelance business.'
            : 'Select the perfect plan for your freelance opportunity needs.'}
        </p>
        
        {/* Billing Period Toggle */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <span className={`text-sm font-medium ${billingPeriod === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
            Monthly
          </span>
          <button
            onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
            className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            role="switch"
            aria-checked={billingPeriod === 'yearly'}
            aria-label="Toggle billing period"
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                billingPeriod === 'yearly' ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <span className={`text-sm font-medium ${billingPeriod === 'yearly' ? 'text-gray-900' : 'text-gray-500'}`}>
            Yearly
            {billingPeriod === 'yearly' && (
              <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                Save 2 months
              </span>
            )}
          </span>
        </div>
        
        <button
          onClick={() => setShowComparison(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm font-medium"
        >
          <Info className="w-4 h-4" />
          Compare All Plans
        </button>
      </div>

      {/* Success Message */}
      {success && (
        <div className="card bg-green-50 border-green-200">
          <div className="flex items-start">
            <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-green-800 mb-1">Success</h3>
              <p className="text-sm text-green-600">{success}</p>
            </div>
          </div>
        </div>
      )}

      {/* Paddle Disabled Notice */}
      {!paddleEnabled && (
        <div className="card bg-yellow-50 border-yellow-200">
          <div className="flex items-start">
            <Info className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-yellow-800 mb-1">Payment Processing Temporarily Unavailable</h3>
              <p className="text-sm text-yellow-700">
                Payment processing is currently disabled. Please contact{' '}
                <a href="mailto:support@clienthunt.app" className="underline font-medium">support@clienthunt.app</a>{' '}
                for assistance with subscriptions.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="card bg-red-50 border-red-200">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-red-800 mb-1">Payment Error</h3>
              <p className="text-sm text-red-600 whitespace-pre-line">{error}</p>
              <p className="text-xs text-red-500 mt-2">
                If this problem persists, please contact support with the error details.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Active Subscription Notice */}
      {subscription && subscription.status === 'active' && (
        <div className={`card ${
          subscription.plan === 'free' 
            ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300' 
            : 'bg-blue-50 border-blue-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CheckCircle className={`w-5 h-5 mr-2 ${
                subscription.plan === 'free' ? 'text-green-600' : 'text-blue-600'
              }`} />
              <div>
                <h3 className={`text-sm font-semibold ${
                  subscription.plan === 'free' ? 'text-green-800' : 'text-blue-800'
                }`}>
                  {subscription.plan === 'free' 
                    ? '🎉 Free Trial Active - Full Access!' 
                    : `Active Subscription: ${PRICING_PLANS[subscription.plan as SubscriptionPlan]?.name || subscription.plan}`}
                </h3>
                <p className={`text-sm ${
                  subscription.plan === 'free' ? 'text-green-700' : 'text-blue-600'
                }`}>
                  {subscription.current_period_end ? (
                    subscription.plan === 'free' ? (
                      <>
                        Free trial expires on{' '}
                        <span className="font-semibold">
                          {new Date(subscription.current_period_end).toLocaleDateString()}
                        </span>
                        {' '}({Math.ceil((new Date(subscription.current_period_end).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days remaining)
                      </>
                    ) : (
                      `Renews on ${new Date(subscription.current_period_end).toLocaleDateString()}`
                    )
                  ) : (
                    'Active subscription'
                  )}
                </p>
                {subscription.plan === 'free' && (
                  <p className="text-xs text-green-600 mt-1">
                    Upgrade to a paid plan anytime to continue after your trial ends
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={() => router.push('/dashboard')}
              className="btn-outline text-sm"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      )}

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
        <PricingCard
          plan="starter"
          currentPlan={currentPlan}
          onSelect={handleSelectPlan}
          isLoading={isProcessing === 'starter'}
          billingPeriod={billingPeriod}
          className="lg:mt-8"
        />
        <PricingCard
          plan="professional"
          isPopular={true}
          currentPlan={currentPlan}
          onSelect={handleSelectPlan}
          isLoading={isProcessing === 'professional'}
          billingPeriod={billingPeriod}
        />
        <PricingCard
          plan="power"
          currentPlan={currentPlan}
          onSelect={handleSelectPlan}
          isLoading={isProcessing === 'power'}
          billingPeriod={billingPeriod}
          className="lg:mt-8"
        />
      </div>

      {/* Trust Indicators */}
      <div className="text-center space-y-6 mt-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-2xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-center p-4 bg-gray-50 rounded-xl">
            <CreditCard className="w-5 h-5 text-blue-600 mb-2 sm:mb-0 sm:mr-3" />
            <span className="text-sm font-medium text-gray-700">Secure Payment</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center p-4 bg-gray-50 rounded-xl">
            <CheckCircle className="w-5 h-5 text-green-600 mb-2 sm:mb-0 sm:mr-3" />
            <span className="text-sm font-medium text-gray-700">1-Month Free Trial</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center p-4 bg-gray-50 rounded-xl">
            <CheckCircle className="w-5 h-5 text-purple-600 mb-2 sm:mb-0 sm:mr-3" />
            <span className="text-sm font-medium text-gray-700">Cancel Anytime</span>
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            {billingPeriod === 'yearly' 
              ? 'Annual plans save you 2 months. You can upgrade, downgrade, or cancel at any time.'
              : 'All plans are billed monthly. You can upgrade, downgrade, or cancel at any time.'}
          </p>
          <p className="text-xs text-gray-500">
            No hidden fees • No setup costs • 30-day money-back guarantee
          </p>
        </div>
      </div>

      {/* Plan Comparison Modal */}
      <PlanComparison
        isOpen={showComparison}
        onClose={() => setShowComparison(false)}
      />
    </div>
  );
}

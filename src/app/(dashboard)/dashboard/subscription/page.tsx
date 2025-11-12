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
import { AlertCircle, CheckCircle, CreditCard, Info } from 'lucide-react';

/**
 * Subscription Page
 * 
 * Select and subscribe to a plan
 */
export default function SubscriptionPage() {
  const router = useRouter();
  const { user, fetchUser } = useAuthStore();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showComparison, setShowComparison] = useState(false);

  useEffect(() => {
    loadSubscription();
  }, []);

  const loadSubscription = async () => {
    setIsLoading(true);
    try {
      const sub = await getCurrentSubscription();
      setSubscription(sub);
      
      // Don't refresh user data on subscription page load to prevent redirect loops
      // The user data is already loaded by DashboardLayout
      // Only refresh if explicitly needed (e.g., after successful payment)
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

    // Early access period - show polished message
    setError(null);
    setSuccess(null);
    setIsProcessing(null);
    
    setSuccess(
      `Thanks for your interest in the ${PRICING_PLANS[plan]?.name || plan} plan! ` +
      `We're currently in our early access phase, so paid plans aren't available yet. ` +
      `You can continue enjoying full access to all features with your free trial. ` +
      `We'll reach out when paid plans launch - stay tuned! 🚀`
    );
    
    // Scroll to success message
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);

    // TODO: Uncomment when payment gateway is ready
    /*
    setIsProcessing(plan);
    setError(null);
    setSuccess(null);

    try {
      // Create Paddle checkout session
      const checkout = await createCheckout(plan);
      
      // Redirect to Paddle checkout
      // The checkout_url from Paddle will be: http://localhost:9100/checkout?_ptxn=transaction_id
      // Our checkout page will use Paddle.js to open the checkout overlay
      if (checkout.checkout_url) {
        window.location.href = checkout.checkout_url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (err: any) {
      if (err instanceof ApiClientError) {
        // Extract user-friendly error message
        const errorMessage = extractErrorMessage(err.data, 'Failed to create checkout session');
        
        // Add additional context for specific error codes
        let displayMessage = errorMessage;
        const errorCode = (err.data as any).error_code || (typeof err.data.detail === 'object' && !Array.isArray(err.data.detail) && 'error_code' in err.data.detail ? (err.data.detail as any).error_code : undefined);
        if (errorCode === 'transaction_default_checkout_url_not_set') {
          displayMessage = `${errorMessage}\n\nPlease configure the default checkout URL in your Paddle dashboard under Checkout Settings.`;
        }
        
        setError(displayMessage);
      } else {
        setError('An unexpected error occurred. Please try again or contact support.');
      }
      setIsProcessing(null);
    }
    */
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
            ? 'You\'re part of our early access program! Explore all features and upgrade when paid plans launch.'
            : 'Select the perfect plan for your freelance opportunity needs. Early access users get full features free!'}
        </p>
        <button
          onClick={() => setShowComparison(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm font-medium"
        >
          <Info className="w-4 h-4" />
          Compare All Plans
        </button>
      </div>

      {/* Early Access Notice - Only show for free plan users */}
      {subscription?.plan === 'free' && (
        <div className="card bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 max-w-4xl mx-auto">
          <div className="flex items-start">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-900 mb-1">
                🎉 You're in our Early Access Program!
              </h3>
              <p className="text-sm text-gray-700 mb-2">
                As an early user, you're enjoying full access to all premium features at no cost. 
                This is our way of saying thank you for being part of our journey.
              </p>
              <p className="text-xs text-gray-600">
                Your early access includes unlimited keyword searches, unlimited opportunities, and all premium features. 
                We'll let you know when paid plans become available, but for now, enjoy everything on us!
              </p>
            </div>
          </div>
        </div>
      )}

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
          className="lg:mt-8"
        />
        <PricingCard
          plan="professional"
          isPopular={true}
          currentPlan={currentPlan}
          onSelect={handleSelectPlan}
          isLoading={isProcessing === 'professional'}
        />
        <PricingCard
          plan="power"
          currentPlan={currentPlan}
          onSelect={handleSelectPlan}
          isLoading={isProcessing === 'power'}
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
            All plans are billed monthly. You can upgrade, downgrade, or cancel at any time.
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


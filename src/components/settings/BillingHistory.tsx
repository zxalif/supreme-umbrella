'use client';

import { useState, useEffect } from 'react';
import { CreditCard, Download, Calendar } from 'lucide-react';
import { getCurrentSubscription } from '@/lib/api/subscriptions';
import type { Subscription } from '@/types/subscription';
import { showToast } from '@/components/ui/Toast';
import { extractErrorMessage } from '@/lib/api/client';

/**
 * Billing History Component
 * 
 * Displays subscription and payment history
 */
export function BillingHistory() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSubscription = async () => {
      setIsLoading(true);
      try {
        const sub = await getCurrentSubscription();
        setSubscription(sub);
      } catch (err: any) {
        showToast.error('Failed to load subscription history', extractErrorMessage(err, 'Failed to load subscription history'));
      } finally {
        setIsLoading(false);
      }
    };
    loadSubscription();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading billing history...</p>
        </div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="card text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CreditCard className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No Subscription Found
        </h3>
        <p className="text-gray-600">
          Unable to load subscription information.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Subscription */}
      {subscription && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Current Subscription</h3>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              subscription.status === 'active'
                ? 'bg-green-100 text-green-700'
                : subscription.status === 'cancelled'
                ? 'bg-red-100 text-red-700'
                : 'bg-gray-100 text-gray-700'
            }`}>
              {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
            </span>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Plan</span>
              <span className="text-sm font-medium text-gray-900">
                {subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)}
              </span>
            </div>
            
            {subscription.current_period_start && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Period Start</span>
                <span className="text-sm font-medium text-gray-900">
                  {new Date(subscription.current_period_start).toLocaleDateString()}
                </span>
              </div>
            )}
            
            {subscription.current_period_end && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {subscription.plan === 'free' ? 'Trial Expires' : 'Next Billing Date'}
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {new Date(subscription.current_period_end).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Payment History - Empty State */}
      <div className="card text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CreditCard className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No Payment History Yet
        </h3>
        <p className="text-gray-600 mb-4 max-w-md mx-auto">
          Payment history will appear here once you upgrade to a paid plan and make your first payment.
        </p>
        <p className="text-sm text-gray-500">
          During our early access period, you're enjoying full features at no cost! 🎉
        </p>
      </div>

      {/* Future: Payment History List */}
      {/* 
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment History</h3>
        <div className="space-y-4">
          {payments.map((payment) => (
            <div key={payment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-4">
                <CreditCard className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{payment.description}</p>
                  <p className="text-xs text-gray-500">{payment.date}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-900">${payment.amount}</span>
                <button className="text-blue-600 hover:text-blue-700">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      */}
    </div>
  );
}


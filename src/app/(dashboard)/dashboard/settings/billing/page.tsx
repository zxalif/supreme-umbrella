'use client';

import { BillingHistory } from '@/components/settings/BillingHistory';

/**
 * Settings Billing Page
 * 
 * View billing history and subscription information
 */
export default function BillingSettingsPage() {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Billing & Subscription</h2>
        <p className="text-sm text-gray-600">
          View your subscription details and payment history.
        </p>
      </div>

      <BillingHistory />
    </div>
  );
}


'use client';

import Link from 'next/link';
import { AlertCircle } from 'lucide-react';

/**
 * Checkout Page
 * 
 * Payment checkout is currently not available.
 * This page will be enabled when payment processing is implemented.
 */
export default function CheckoutPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8">
          <AlertCircle className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Checkout Not Available
          </h2>
          <p className="text-gray-600 mb-6">
            Payment processing is currently not available. We're working on implementing 
            a secure payment solution. Please check back later or contact support for assistance.
          </p>
          <div className="space-y-3">
            <Link
              href="/dashboard/subscription"
              className="inline-block w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Subscription Plans
            </Link>
            <Link
              href="/dashboard"
              className="inline-block w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}


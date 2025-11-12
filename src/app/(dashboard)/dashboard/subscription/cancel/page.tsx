'use client';

import Link from 'next/link';
import { XCircle, ArrowLeft } from 'lucide-react';

/**
 * Payment Cancel Page
 * 
 * Shown when user cancels Paddle checkout
 */
export default function SubscriptionCancelPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="card text-center">
        <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-12 h-12 text-yellow-600" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Payment Cancelled
        </h1>
        
        <p className="text-lg text-gray-600 mb-6">
          Your payment was cancelled. No charges were made to your account.
        </p>

        <p className="text-sm text-gray-500 mb-8">
          If you have any questions or need assistance, please contact our support team.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/dashboard/subscription"
            className="btn-primary inline-flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Plans
          </Link>
          <Link
            href="/dashboard"
            className="btn-outline inline-flex items-center justify-center"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}


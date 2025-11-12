'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';

/**
 * Payment Success Page
 * 
 * Shown after successful Paddle checkout
 */
export default function SubscriptionSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { fetchUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Refresh user data to get updated subscription
    const refreshData = async () => {
      try {
        await fetchUser();
      } catch (error) {
        console.error('Failed to refresh user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    refreshData();
  }, [fetchUser]);

  const transactionId = searchParams.get('transaction_id');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Processing your subscription...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Payment Successful!
        </h1>
        
        <p className="text-lg text-gray-600 mb-6">
          Your subscription has been activated. You can now start finding freelance opportunities!
        </p>

        {transactionId && (
          <p className="text-sm text-gray-500 mb-8">
            Transaction ID: {transactionId}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/dashboard"
            className="btn-primary inline-flex items-center justify-center"
          >
            Go to Dashboard
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
          <Link
            href="/dashboard/keyword-searches"
            className="btn-outline inline-flex items-center justify-center"
          >
            Create Keyword Search
          </Link>
        </div>
      </div>
    </div>
  );
}


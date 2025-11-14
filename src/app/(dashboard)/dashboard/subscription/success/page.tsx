'use client';

import { Suspense, useEffect, useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { verifyTransaction, type VerifyTransactionResponse } from '@/lib/api/payments';
import { ApiClientError } from '@/lib/api/client';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

/**
 * Payment Success Page Content
 * 
 * Verifies the transaction and shows success/error message
 */
function SubscriptionSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const transactionId = searchParams.get('transaction_id');
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState<string>('');
  const [transactionData, setTransactionData] = useState<VerifyTransactionResponse | null>(null);
  const [error, setError] = useState<string>('');
  const hasVerifiedRef = useRef(false);
  const redirectTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Only verify once
    if (hasVerifiedRef.current || !transactionId) {
      if (!transactionId) {
        setStatus('error');
        setError('No transaction ID found in URL');
      }
      return;
    }

    hasVerifiedRef.current = true;

    console.log('[Success Page] Starting transaction verification for:', transactionId);

    // Verify transaction
    const verify = async () => {
      console.log('[Success Page] Calling verifyTransaction API...');
      try {
        const result = await verifyTransaction(transactionId);
        setTransactionData(result);
        setStatus('success');
        setMessage(result.message);
        
        // Redirect to dashboard after 5 seconds
        redirectTimerRef.current = setTimeout(() => {
          router.push('/dashboard');
        }, 5000);
      } catch (err) {
        // Handle 401 Unauthorized - user not authenticated
        if (err instanceof ApiClientError && err.status === 401) {
          // Redirect to login with transaction_id preserved
          const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
          try {
            const url = new URL(currentUrl || 'http://localhost:9100');
            const transactionId = url.searchParams.get('transaction_id');
            
            let redirectUrl = '/dashboard/subscription/success';
            if (transactionId) {
              redirectUrl += `?transaction_id=${encodeURIComponent(transactionId)}`;
            }
            
            console.log('[Success Page] Not authenticated, redirecting to login with:', redirectUrl);
            router.push(`/login?redirect=${encodeURIComponent(redirectUrl)}`);
            return;
          } catch (e) {
            // Fallback if URL parsing fails
            router.push('/login?redirect=/dashboard/subscription/success');
            return;
          }
        }
        
        // Handle 202 Accepted (payment still processing)
        if (err instanceof ApiClientError && err.status === 202) {
          setStatus('success');
          // Extract message from detail - handle string, object, or array
          let detailMessage = 'Payment is being processed. You will receive a confirmation email once your subscription is activated.';
          if (err.data?.detail) {
            if (typeof err.data.detail === 'string') {
              detailMessage = err.data.detail;
            } else if (typeof err.data.detail === 'object' && !Array.isArray(err.data.detail) && 'message' in err.data.detail) {
              detailMessage = (err.data.detail as { message: string }).message;
            }
          }
          setMessage(detailMessage);
          
          // Poll again after 3 seconds to check if payment completed
          const pollTimer = setTimeout(async () => {
            try {
              const result = await verifyTransaction(transactionId);
              setTransactionData(result);
              setMessage(result.message);
              // Redirect after successful verification
              redirectTimerRef.current = setTimeout(() => {
                router.push('/dashboard');
              }, 3000);
            } catch (pollErr) {
              // If still processing, redirect anyway after 8 seconds total
              console.log('Payment still processing, redirecting to dashboard...');
              redirectTimerRef.current = setTimeout(() => {
                router.push('/dashboard');
              }, 5000);
            }
          }, 3000);
          
          // Fallback: redirect after 10 seconds if polling doesn't complete
          redirectTimerRef.current = setTimeout(() => {
            clearTimeout(pollTimer);
            router.push('/dashboard');
          }, 10000);
          return;
        }
        
        setStatus('error');
        if (err instanceof ApiClientError) {
          const detail = err.data?.detail;
          let errorMessage = 'Failed to verify transaction. Please contact support.';
          
          if (typeof detail === 'string') {
            errorMessage = detail;
          } else if (typeof detail === 'object' && !Array.isArray(detail) && detail !== null) {
            if ('message' in detail && typeof detail.message === 'string') {
              errorMessage = detail.message;
            }
          }
          
          setError(errorMessage);
        } else {
          setError('An unexpected error occurred. Please contact support.');
        }
      }
    };

    verify();

    // Cleanup
    return () => {
      if (redirectTimerRef.current) {
        clearTimeout(redirectTimerRef.current);
      }
    };
  }, [transactionId, router]);

  if (status === 'loading') {
    return (
      <div className="max-w-2xl mx-auto p-8">
        <div className="card text-center">
          <Loader2 className="w-16 h-16 text-blue-500 animate-spin mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Verifying Payment...
          </h1>
          <p className="text-gray-600">
            Please wait while we verify your transaction.
          </p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="max-w-2xl mx-auto p-8">
        <div className="card text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Payment Verification Failed
          </h1>
          <p className="text-gray-600 mb-6">
            {error || 'An error occurred while verifying your payment.'}
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/dashboard/subscription"
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Back to Subscription
            </Link>
            <Link
              href="/dashboard"
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="card text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Payment Successful!
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          {message || 'Your subscription has been activated successfully.'}
        </p>

        {transactionData && (
          <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
            <h2 className="font-semibold text-gray-900 mb-4">Subscription Details</h2>
            <div className="space-y-2 text-sm">
              {transactionData.plan && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Plan:</span>
                  <span className="font-medium text-gray-900 capitalize">
                    {transactionData.plan}
                  </span>
                </div>
              )}
              {transactionData.subscription_status && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium text-gray-900 capitalize">
                    {transactionData.subscription_status}
                  </span>
                </div>
              )}
              {transactionData.payment_id && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment ID:</span>
                  <span className="font-mono text-xs text-gray-700">
                    {transactionData.payment_id.substring(0, 8)}...
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            Redirecting to dashboard in a few seconds...
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <Link
            href="/dashboard"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

/**
 * Payment Success Page (with Suspense boundary for useSearchParams)
 */
export default function SubscriptionSuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <SubscriptionSuccessContent />
    </Suspense>
  );
}


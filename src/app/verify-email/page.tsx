'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { verifyEmail, ApiClientError } from '@/lib/api/auth';
import { CheckCircle, XCircle, Loader2, Mail, ArrowRight } from 'lucide-react';

/**
 * Email Verification Page
 * 
 * Handles email verification via token from email link
 */
export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const verify = async () => {
      const token = searchParams?.get('token');
      const userId = searchParams?.get('user_id');

      if (!token || !userId) {
        setStatus('error');
        setMessage('Invalid verification link. Please check your email and try again.');
        setIsVerifying(false);
        return;
      }

      try {
        const response = await verifyEmail({ token, user_id: userId });
        setStatus('success');
        setMessage(response.message || 'Email verified successfully!');
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/login?verified=true');
        }, 3000);
      } catch (error) {
        setStatus('error');
        if (error instanceof ApiClientError) {
          const errorDetail = error.data?.detail || 'Verification failed. The link may have expired.';
          setMessage(errorDetail);
          
          // If token is invalid/expired, suggest resending
          if (error.status === 400 && (errorDetail.includes('expired') || errorDetail.includes('Invalid'))) {
            setMessage(`${errorDetail} You can request a new verification email from the login page.`);
          }
        } else {
          setMessage('An unexpected error occurred. Please try again.');
        }
      } finally {
        setIsVerifying(false);
      }
    };

    verify();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-primary-50/30 to-secondary-50/20 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6 group">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              ClientHunt
            </span>
          </Link>
        </div>

        {/* Verification Card */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200">
          {isVerifying ? (
            <div className="text-center py-8">
              <Loader2 className="w-12 h-12 text-primary-500 animate-spin mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifying Email...</h2>
              <p className="text-gray-600">Please wait while we verify your email address.</p>
            </div>
          ) : status === 'success' ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Verified! 🎉</h2>
              <p className="text-gray-600 mb-6">{message}</p>
              <p className="text-sm text-gray-500 mb-6">
                Redirecting to login page...
              </p>
              <Link
                href="/login?verified=true"
                className="inline-flex items-center justify-center w-full bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white py-3 px-6 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
              >
                Go to Login
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-10 h-10 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h2>
              <p className="text-gray-600 mb-6">{message}</p>
              <div className="space-y-4">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center w-full bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white py-3 px-6 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
                >
                  Go to Login
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    You can request a new verification email from the{' '}
                    <Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium underline">
                      login page
                    </Link>
                    {' '}or{' '}
                    <Link href="/dashboard/support" className="text-primary-600 hover:text-primary-700 font-medium underline">
                      contact support
                    </Link>
                    .
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


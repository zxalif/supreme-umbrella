'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Home, RefreshCw, AlertTriangle, Mail } from 'lucide-react';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';

/**
 * 500 Error Page for Landing Pages
 * 
 * Custom error page that catches errors in the app.
 * This is a client component because error.tsx must be a client component in Next.js.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to error reporting service (e.g., Sentry)
    console.error('Application error:', error);
  }, [error]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-white via-primary-50/30 to-secondary-50/20 flex items-center justify-center px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          {/* 500 Illustration */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-red-100 to-orange-100 rounded-full mb-6">
              <AlertTriangle className="w-16 h-16 text-red-500" />
            </div>
            <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
              500
            </h1>
          </div>

          {/* Error Message */}
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Internal Server Error
          </h2>
          <p className="text-lg text-gray-600 mb-2">
            Oops! Something went wrong on our end.
          </p>
          <p className="text-base text-gray-500 mb-8">
            We're working to fix the issue. Please try again in a few moments.
          </p>

          {/* Error Details (Development Only) */}
          {process.env.NODE_ENV === 'development' && error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
              <p className="text-sm font-semibold text-red-800 mb-2">Error Details (Development Only):</p>
              <p className="text-xs text-red-700 font-mono break-all mb-2">
                {error.message || 'Unknown error'}
              </p>
              {error.digest && (
                <p className="text-xs text-red-600">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <button
              onClick={reset}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Try Again
            </button>
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Home className="w-5 h-5 mr-2" />
              Go to Homepage
            </Link>
          </div>

          {/* Support Link */}
          <div className="pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-4">
              If the problem persists, please contact our support team.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 hover:underline"
            >
              <Mail className="w-4 h-4 mr-2" />
              Contact Support
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}


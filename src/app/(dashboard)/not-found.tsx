'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home, ArrowLeft, Search, HelpCircle } from 'lucide-react';

/**
 * 404 Not Found Page for Dashboard
 * 
 * Custom 404 page for dashboard routes.
 */
export default function DashboardNotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mb-6">
            <Search className="w-16 h-16 text-blue-500" />
          </div>
          <h1 className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
            404
          </h1>
        </div>

        {/* Error Message */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          The page you're looking for doesn't exist in the dashboard.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </button>
          <Link
            href="/dashboard"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Home className="w-5 h-5 mr-2" />
            Go to Dashboard
          </Link>
        </div>

        {/* Helpful Links */}
        <div className="pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">Quick Links:</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/dashboard" 
              className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
            >
              Dashboard
            </Link>
            <Link 
              href="/dashboard/opportunities" 
              className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
            >
              Opportunities
            </Link>
            <Link 
              href="/dashboard/keyword-searches" 
              className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
            >
              Keyword Searches
            </Link>
            <Link 
              href="/dashboard/analytics" 
              className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
            >
              Analytics
            </Link>
            <Link 
              href="/dashboard/support" 
              className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
            >
              Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}


import Link from 'next/link';
import { Home, Search, ArrowLeft } from 'lucide-react';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';

/**
 * 404 Not Found Page for Landing Pages
 * 
 * Custom 404 page for non-dashboard routes.
 */
export default function NotFound() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-white via-primary-50/30 to-secondary-50/20 flex items-center justify-center px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          {/* 404 Illustration */}
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
              404
            </h1>
          </div>

          {/* Error Message */}
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Home className="w-5 h-5 mr-2" />
              Go to Homepage
            </Link>
            <Link
              href="/#features"
              className="inline-flex items-center px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Search className="w-5 h-5 mr-2" />
              Explore Features
            </Link>
          </div>

          {/* Helpful Links */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-4">You might be looking for:</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/login" className="text-sm text-blue-600 hover:text-blue-700 hover:underline">
                Log In
              </Link>
              <Link href="/register" className="text-sm text-blue-600 hover:text-blue-700 hover:underline">
                Sign Up
              </Link>
              <Link href="/#pricing" className="text-sm text-blue-600 hover:text-blue-700 hover:underline">
                Pricing
              </Link>
              <Link href="/#faq" className="text-sm text-blue-600 hover:text-blue-700 hover:underline">
                FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}


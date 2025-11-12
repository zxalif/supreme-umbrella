'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, X, LayoutDashboard } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

/**
 * Navbar Component
 * 
 * Sticky navigation bar with:
 * - Logo
 * - Navigation links
 * - CTA buttons (or "Go to Dashboard" if logged in)
 * - Mobile menu
 */
export function Navbar() {
  const router = useRouter();
  const { isAuthenticated, fetchUser, isLoading } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (token) {
      // Only fetch if not already authenticated
      const { isAuthenticated: currentAuth } = useAuthStore.getState();
      if (!currentAuth) {
        fetchUser().catch(() => {
          // Silently fail - user might not be authenticated
        });
      }
    }
  }, [fetchUser]);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              ClientHunt
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link 
              href="#features" 
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-all duration-200"
            >
              Features
            </Link>
            <Link 
              href="#how-it-works" 
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-all duration-200"
            >
              How It Works
            </Link>
            <Link 
              href="#pricing" 
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-all duration-200"
            >
              Pricing
            </Link>
            <Link 
              href="#faq" 
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-all duration-200"
            >
              FAQ
            </Link>
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <Link 
                href="/dashboard" 
                className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg shadow-md hover:shadow-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center space-x-2"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Go to Dashboard</span>
              </Link>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-all duration-200"
                >
                  Log In
                </Link>
                <Link 
                  href="/register" 
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg shadow-md hover:shadow-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 transform hover:scale-105 active:scale-95"
                >
                  Start Free Trial
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-all duration-200"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-lg">
          <div className="px-4 py-4 space-y-1">
            <Link
              href="#features"
              className="block px-4 py-2.5 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="block px-4 py-2.5 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              How It Works
            </Link>
            <Link
              href="#pricing"
              className="block px-4 py-2.5 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              href="#faq"
              className="block px-4 py-2.5 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              FAQ
            </Link>
            <div className="pt-4 space-y-2 border-t border-gray-200 mt-2">
              {isAuthenticated ? (
                <Link 
                  href="/dashboard" 
                  className="block w-full text-center px-4 py-2.5 text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg shadow-md font-semibold hover:from-blue-600 hover:to-purple-600 transition-all flex items-center justify-center space-x-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Go to Dashboard</span>
                </Link>
              ) : (
                <>
                  <Link 
                    href="/login" 
                    className="block w-full text-center px-4 py-2.5 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all font-semibold"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Log In
                  </Link>
                  <Link 
                    href="/register" 
                    className="block w-full text-center px-4 py-2.5 text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg shadow-md font-semibold hover:from-blue-600 hover:to-purple-600 transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Start Free Trial
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

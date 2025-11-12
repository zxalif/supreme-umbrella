'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { getAuthToken } from '@/lib/api/client';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { QuickSupport } from '@/components/dashboard/QuickSupport';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

/**
 * Dashboard Layout Component
 * 
 * Provides consistent layout for all dashboard pages:
 * - Header with user menu
 * - Sidebar navigation
 * - Main content area
 * - Protected route handling
 */
export function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, fetchUser, isLoading } = useAuthStore();
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasRedirected, setHasRedirected] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Calculate subscription needs (before any early returns)
  // Free plan users have active subscription, so they should have access
  const needsSubscription = user && (
    !user.subscription || 
    user.subscription.status !== 'active'
  );
  const isSubscriptionPage = pathname?.startsWith('/dashboard/subscription');

  // All hooks must be called unconditionally at the top
  useEffect(() => {
    // Check authentication on mount
    const initAuth = async () => {
      const token = getAuthToken();
      if (token && !user) {
        await fetchUser();
      } else if (!token) {
        router.push('/login');
        return;
      }
      setIsInitialized(true);
    };

    // Only run if not already initialized to prevent multiple calls
    if (!isInitialized) {
      initAuth();
    }
  }, [user, fetchUser, router, isInitialized]);

  // Redirect to subscription if needed (but allow access to subscription page and success/cancel pages)
  useEffect(() => {
    // Only redirect if:
    // 1. User is authenticated
    // 2. User data is loaded
    // 3. User needs subscription
    // 4. Not already on subscription page
    // 5. Initialization is complete (to prevent race conditions)
    // 6. Haven't already redirected (to prevent redirect loops)
    if (
      isInitialized && 
      isAuthenticated && 
      user && 
      needsSubscription && 
      !isSubscriptionPage && 
      !hasRedirected
    ) {
      setHasRedirected(true);
      router.push('/dashboard/subscription');
    }
    
    // Reset redirect flag when on subscription page
    if (isSubscriptionPage && hasRedirected) {
      setHasRedirected(false);
    }
  }, [isInitialized, isAuthenticated, user, needsSubscription, isSubscriptionPage, hasRedirected, router]);

  // Show loading state while checking auth
  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated || !user) {
    return null; // Will redirect in useEffect
  }

  // Show loading state if redirecting to subscription
  if (needsSubscription && !isSubscriptionPage) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to subscription...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header 
        user={user} 
        onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      <div className="flex h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <Sidebar 
          currentPath={pathname}
          isMobileOpen={isMobileMenuOpen}
          onMobileClose={() => setIsMobileMenuOpen(false)}
        />

        {/* Main Content */}
        <main className="flex-1 w-full min-w-0 overflow-hidden lg:ml-64">
          <div className="h-full overflow-y-auto">
            <div className="p-3 sm:p-4 md:p-6 lg:p-8 w-full max-w-none">
              {children}
            </div>
          </div>
        </main>
      </div>

      {/* Quick Support Widget */}
      <QuickSupport />
    </div>
  );
}


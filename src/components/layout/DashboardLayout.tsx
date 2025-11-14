'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { getAuthToken } from '@/lib/api/client';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { QuickSupport } from '@/components/dashboard/QuickSupport';
import { TourProvider } from '@/components/tour/TourProvider';
import { HelpButton } from '@/components/help/HelpButton';

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
  // All hooks must be called first (React requirement)
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, fetchUser, isLoading } = useAuthStore();
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasRedirected, setHasRedirected] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Check for success/cancel pages - these need auth but skip subscription checks
  // pathname is available on both server and client in Next.js 15
  const isSubscriptionSuccessPage = pathname === '/dashboard/subscription/success' || pathname?.startsWith('/dashboard/subscription/success');
  const isSubscriptionCancelPage = pathname === '/dashboard/subscription/cancel' || pathname?.startsWith('/dashboard/subscription/cancel');

  // Exclude subscription pages (including success and cancel) from redirects
  const isSubscriptionPage = pathname?.startsWith('/dashboard/subscription');
  
  // Calculate subscription needs (before any early returns)
  // Free plan users have active subscription, so they should have access
  // IMPORTANT: On success/cancel pages, always allow access (don't check subscription)
  // This prevents redirects during payment processing
  const needsSubscription = useMemo(() => {
    // Always allow access to subscription pages (including success/cancel)
    if (isSubscriptionSuccessPage || isSubscriptionCancelPage || isSubscriptionPage) {
      return false;
    }
    if (!user) return false;
    return !user.subscription || user.subscription.status !== 'active';
  }, [user?.subscription?.status, isSubscriptionSuccessPage, isSubscriptionCancelPage, isSubscriptionPage]); // Only recalculate when subscription status changes, not when user object reference changes

  // Auto-accept cookies for authenticated users (they already consented during registration)
  // Use ref to prevent re-running on every user update
  const cookieConsentHandledRef = useRef(false);
  useEffect(() => {
    if (typeof window !== 'undefined' && user && !cookieConsentHandledRef.current) {
      const consent = localStorage.getItem('cookie-consent');
      if (consent !== 'accepted') {
        // User is logged in but hasn't accepted cookies - auto-accept since they consented during registration
        localStorage.setItem('cookie-consent', 'accepted');
        localStorage.setItem('cookie-consent-timestamp', new Date().toISOString());
        window.dispatchEvent(new CustomEvent('cookieConsentChanged', { 
          detail: { consent: 'accepted' } 
        }));
      }
      cookieConsentHandledRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once - don't depend on user to prevent loops

  // All hooks must be called unconditionally at the top
  const initAuthRunRef = useRef(false);
  useEffect(() => {
    // Check authentication on mount (including success/cancel pages)
    // Only run once on mount - don't depend on user to prevent loops
    if (initAuthRunRef.current || isInitialized) {
      return;
    }
    
    initAuthRunRef.current = true;
    
    const initAuth = async () => {
      const token = getAuthToken();
      
      // For success/cancel pages, check auth but skip fetchUser to avoid API calls
      if (isSubscriptionSuccessPage || isSubscriptionCancelPage) {
        if (!token) {
          // No token - redirect to login with transaction_id preserved
          const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
          try {
            const url = new URL(currentUrl || 'http://localhost:9100');
            const transactionId = url.searchParams.get('transaction_id');
            
            let redirectUrl = pathname || '/dashboard/subscription/success';
            if (transactionId) {
              redirectUrl += `?transaction_id=${encodeURIComponent(transactionId)}`;
            }
            
            router.push(`/login?redirect=${encodeURIComponent(redirectUrl)}`);
            return;
          } catch (e) {
            router.push(`/login?redirect=${encodeURIComponent(pathname || '/dashboard/subscription/success')}`);
            return;
          }
        }
        // Token exists - allow page to render (page will handle verification)
        setIsInitialized(true);
        return;
      }
      
      // For other pages, do full auth check
      if (token && !user) {
        console.log('[DashboardLayout] Initializing auth - calling fetchUser');
        await fetchUser();
      } else if (!token) {
        router.push('/login');
        return;
      }
      setIsInitialized(true);
    };

    initAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, isSubscriptionSuccessPage, isSubscriptionCancelPage]); // Include pathname to check on route changes

  // Redirect to subscription if needed (but allow access to subscription page and success/cancel pages)
  // Completely skip redirect logic on success/cancel pages to prevent any re-renders or API calls
  useEffect(() => {
    // Don't run redirect logic at all if on subscription success or cancel pages
    if (isSubscriptionSuccessPage || isSubscriptionCancelPage) {
      return;
    }
    
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialized, isAuthenticated, isSubscriptionPage, isSubscriptionSuccessPage, isSubscriptionCancelPage, hasRedirected, router]);
  // Removed 'user' and 'needsSubscription' from dependencies to prevent re-running when user state updates
  // needsSubscription is memoized and only changes when subscription status actually changes
  // Early return prevents any logic from running on success/cancel pages


  // Show loading state while checking auth
  if (!isInitialized || (isLoading && !isSubscriptionSuccessPage && !isSubscriptionCancelPage)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // For success/cancel pages, render with minimal layout
  // Auth check is handled in useEffect above
  if (isSubscriptionSuccessPage || isSubscriptionCancelPage) {
    // Render success/cancel page with minimal layout
    // Don't check token here to avoid hydration mismatch (check is in useEffect)
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Minimal Header - no sidebar, no help button */}
        <Header 
          user={user || null} 
          onMobileMenuToggle={() => {}}
        />

        {/* Main Content - full width, no sidebar */}
        <main className="w-full">
          <div className="h-full overflow-y-auto">
            <div className="p-3 sm:p-4 md:p-6 lg:p-8 w-full max-w-none">
              {children}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Redirect if not authenticated (for other pages)
  if (!isAuthenticated || !user) {
    return null; // Will redirect in useEffect
  }

  // Show loading state if redirecting to subscription (but not on success/cancel pages)
  if (needsSubscription && !isSubscriptionPage && !isSubscriptionSuccessPage && !isSubscriptionCancelPage) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to subscription...</p>
        </div>
      </div>
    );
  }

  // Don't wrap in TourProvider on success/cancel pages to prevent re-renders
  const shouldShowTour = !isSubscriptionSuccessPage && !isSubscriptionCancelPage;
  
  const content = (
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
        
        {/* Floating Help Button (Mobile only) */}
        <div className="sm:hidden">
          <HelpButton variant="floating" />
        </div>
      </div>
  );
  
  // Only wrap in TourProvider if not on success/cancel pages
  if (shouldShowTour) {
    return <TourProvider autoStart={true}>{content}</TourProvider>;
  }
  
  return content;
}


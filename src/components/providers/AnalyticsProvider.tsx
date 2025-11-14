'use client';

/**
 * Analytics Provider Component
 * 
 * Provides centralized analytics tracking including:
 * - Google Analytics 4
 * - Sentry error tracking
 * - Core Web Vitals
 * - Page view tracking
 * - Server-side page visit tracking (our own analytics)
 */

import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { business, gtag, performance, errors } from '@/lib/analytics';
import { trackPageVisit } from '@/lib/pageTracking';

// Track page views
function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
      
      // Track in Google Analytics
      gtag.pageView(url);
      
      // Track in our own analytics (server-side)
      // Only track the path, not query params (to avoid tracking sensitive data)
      trackPageVisit(pathname);
    }
  }, [pathname, searchParams]);

  return null;
}


// Initialize analytics
export function useAnalytics() {
  useEffect(() => {
    // Track Core Web Vitals
    performance.trackWebVitals();
  }, []);
}

interface AnalyticsProviderProps {
  children: React.ReactNode;
}

export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  useAnalytics();

  return (
    <>
      <Suspense fallback={null}>
        <PageViewTracker />
      </Suspense>
      {children}
    </>
  );
}

// Export tracking functions for use throughout the app
export const track = {
  // Business events
  signup: (method: string = 'email') => {
    business.trackSignup(method);
  },
  
  login: (method: string = 'email') => {
    business.trackLogin(method);
  },
  
  trialStart: () => {
    business.trackTrialStart();
  },
  
  featureUsage: (feature: string) => {
    business.trackFeatureUsage(feature);
  },
  
  // Custom events
  custom: (action: string, category: string, label?: string, value?: number) => {
    gtag.track({ action, category, label, value });
  },
  
  // Errors
  error: (error: Error, context?: string) => {
    errors.trackError(error, context);
  },
  
  apiError: (endpoint: string, status: number, message: string) => {
    errors.trackApiError(endpoint, status, message);
  },
  
  // Interactions
  interaction: (element: string, action: string) => {
    performance.trackInteraction(element, action);
  },
  
  // Page load
  pageLoad: (pageName: string) => {
    performance.trackPageLoad(pageName);
  },
};


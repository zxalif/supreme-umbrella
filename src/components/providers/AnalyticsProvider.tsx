'use client';

/**
 * Analytics Provider Component
 * 
 * Provides centralized analytics tracking including:
 * - Google Analytics 4
 * - Sentry error tracking
 * - Core Web Vitals
 * - Page view tracking
 */

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { business, gtag, performance, errors } from '@/lib/analytics';

// Track page views
export function usePageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
      gtag.pageView(url);
    }
  }, [pathname, searchParams]);
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
  usePageView();
  useAnalytics();

  return <>{children}</>;
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


// Analytics and performance monitoring utilities

export interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

// Google Analytics 4 tracking
export const gtag = {
  track: (event: AnalyticsEvent) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
      });
    }
  },
  
  pageView: (url: string) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      const gaId = process.env.NEXT_PUBLIC_GA_ID || 'G-073BZKPS67';
      (window as any).gtag('config', gaId, {
        page_path: url,
      });
    }
  }
};

// Performance monitoring
export const performance = {
  // Track Core Web Vitals
  trackWebVitals: () => {
    if (typeof window !== 'undefined') {
      try {
        import('web-vitals').then(({ onCLS, onFID, onFCP, onLCP, onTTFB }) => {
          // Track Core Web Vitals and send to Google Analytics
          onCLS((metric) => {
            gtag.track({
              action: 'web_vital',
              category: 'Performance',
              label: 'CLS',
              value: Math.round(metric.value * 1000) / 1000, // Round to 3 decimals
            });
          });
          
          onFID((metric) => {
            gtag.track({
              action: 'web_vital',
              category: 'Performance',
              label: 'FID',
              value: Math.round(metric.value),
            });
          });
          
          onFCP((metric) => {
            gtag.track({
              action: 'web_vital',
              category: 'Performance',
              label: 'FCP',
              value: Math.round(metric.value),
            });
          });
          
          onLCP((metric) => {
            gtag.track({
              action: 'web_vital',
              category: 'Performance',
              label: 'LCP',
              value: Math.round(metric.value),
            });
          });
          
          onTTFB((metric) => {
            gtag.track({
              action: 'web_vital',
              category: 'Performance',
              label: 'TTFB',
              value: Math.round(metric.value),
            });
          });
        }).catch(() => {
          // web-vitals not installed - silently skip
        });
      } catch (e) {
        // web-vitals not available - silently skip
      }
    }
  },
  
  // Track page load time
  trackPageLoad: (pageName: string) => {
    if (typeof window !== 'undefined') {
      window.addEventListener('load', () => {
        const loadTime = window.performance.now();
        gtag.track({
          action: 'page_load_time',
          category: 'Performance',
          label: pageName,
          value: Math.round(loadTime)
        });
      });
    }
  },
  
  // Track user interactions
  trackInteraction: (element: string, action: string) => {
    gtag.track({
      action: action,
      category: 'User Interaction',
      label: element
    });
  }
};

// Business metrics tracking
export const business = {
  trackSignup: (method: string) => {
    gtag.track({
      action: 'sign_up',
      category: 'Conversion',
      label: method
    });
  },
  
  trackLogin: (method: string) => {
    gtag.track({
      action: 'login',
      category: 'Engagement',
      label: method
    });
  },
  
  trackTrialStart: () => {
    gtag.track({
      action: 'trial_start',
      category: 'Conversion',
      label: 'free_trial'
    });
  },
  
  trackFeatureUsage: (feature: string) => {
    gtag.track({
      action: 'feature_use',
      category: 'Product',
      label: feature
    });
  }
};

// Error tracking
export const errors = {
  trackError: (error: Error, context?: string) => {
    // Track in Google Analytics
    gtag.track({
      action: 'javascript_error',
      category: 'Error',
      label: `${error.name}: ${error.message}${context ? ` (${context})` : ''}`
    });
    
    // Track in Sentry if available
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      (window as any).Sentry.captureException(error, {
        contexts: {
          custom: {
            context: context || 'unknown',
          },
        },
      });
    }
    
    // Also log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Tracked error:', error, context);
    }
  },
  
  trackApiError: (endpoint: string, status: number, message: string) => {
    // Track in Google Analytics
    gtag.track({
      action: 'api_error',
      category: 'Error',
      label: `${endpoint} - ${status}: ${message}`,
      value: status
    });
    
    // Track in Sentry if available (only for 5xx errors)
    if (typeof window !== 'undefined' && (window as any).Sentry && status >= 500) {
      (window as any).Sentry.captureException(new Error(`API Error: ${endpoint} - ${status}`), {
        contexts: {
          custom: {
            endpoint,
            status,
            message,
          },
        },
      });
    }
  }
};

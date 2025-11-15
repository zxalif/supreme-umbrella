'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Cookie } from 'lucide-react';

/**
 * Cookie Consent Banner Component
 * 
 * GDPR/CCPA compliant cookie consent banner that appears on first visit.
 * Non-intrusive bottom banner that allows users to browse without forcing acceptance.
 * Stores user preference in localStorage.
 */
export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    // Accept both 'dismissed' (old) and 'rejected' (new) for backward compatibility
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      // Show banner after a short delay for better UX (let page load first)
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 2000); // Increased delay to let users see the page first
      return () => clearTimeout(timer);
    }
    // If user previously dismissed/rejected, treat it as rejected for backward compatibility
    if (consent === 'dismissed') {
      // Migrate old 'dismissed' to 'rejected' for consistency
      localStorage.setItem('cookie-consent', 'rejected');
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    localStorage.setItem('cookie-consent-timestamp', new Date().toISOString());
    setShowBanner(false);
    
    // Trigger custom event so GoogleAnalytics component can detect consent
    // This works better than storage event for same-tab updates
    window.dispatchEvent(new CustomEvent('cookieConsentChanged', { 
      detail: { consent: 'accepted' } 
    }));
  };

  const handleReject = () => {
    // User explicitly rejects cookies
    // They can still browse, but analytics won't load
    // Cookies will be required when they try to register/login
    localStorage.setItem('cookie-consent', 'rejected');
    localStorage.setItem('cookie-consent-timestamp', new Date().toISOString());
    setShowBanner(false);
    
    // Trigger custom event to ensure analytics is not loaded
    window.dispatchEvent(new CustomEvent('cookieConsentChanged', { 
      detail: { consent: 'rejected' } 
    }));
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pointer-events-none">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-2xl border border-gray-200 p-4 md:p-6 pointer-events-auto animate-slide-up">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="flex items-start gap-3 flex-1">
              <Cookie className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="text-sm md:text-base font-semibold text-gray-900 mb-1">
                  We use cookies
                </h3>
                <p className="text-xs md:text-sm text-gray-700 mb-2">
                  We use cookies to enhance your experience, analyze site usage, and assist in our marketing efforts.{' '}
                  <Link href="/cookies" className="text-primary-600 hover:underline font-medium">
                    Learn more in our Cookie Policy
                  </Link>
                  .
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 w-full md:w-auto">
              <button
                onClick={handleReject}
                className="px-4 py-2 text-xs md:text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap"
                aria-label="Reject all cookies"
              >
                Reject All
              </button>
              <button
                onClick={handleAccept}
                className="px-4 md:px-6 py-2 text-xs md:text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors whitespace-nowrap"
                aria-label="Accept all cookies"
              >
                Accept All
              </button>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}


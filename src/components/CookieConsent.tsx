'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Cookie } from 'lucide-react';

/**
 * Cookie Consent Banner Component
 * 
 * GDPR/CCPA compliant cookie consent banner that appears on first visit.
 * Stores user preference in localStorage.
 */
export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      // Show banner after a short delay for better UX
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 1000);
      return () => clearTimeout(timer);
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
    // Rejecting cookies is not allowed - cookies are required for service functionality
    // Show message that cookies are required
    alert('Cookies are required to use ClientHunt. Please accept cookies to continue using our service.');
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full border border-gray-200">
        <div className="p-6">
          <div className="flex items-start gap-3 mb-4">
            <Cookie className="w-6 h-6 text-primary-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Cookies Required
              </h3>
              <p className="text-sm text-gray-700 mb-2">
                <strong>We use cookies</strong> to enhance your experience, analyze site usage, and assist in our marketing efforts. Cookies are required to use ClientHunt.
              </p>
              <p className="text-xs text-gray-600">
                By clicking "Accept All", you consent to our use of cookies. You can learn more in our{' '}
                <Link href="/cookies" className="text-primary-600 hover:underline font-medium">
                  Cookie Policy
                </Link>
                {' '}or{' '}
                <Link href="/privacy" className="text-primary-600 hover:underline font-medium">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={handleAccept}
              className="px-6 py-2.5 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


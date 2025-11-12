'use client';

/**
 * Google Analytics 4 Component
 * 
 * GDPR/CCPA Compliant: Only loads Google Analytics after user consent.
 * Uses the provided GA ID: G-073BZKPS67
 */

import Script from 'next/script';
import { useEffect, useState } from 'react';

export function GoogleAnalytics() {
  // Use environment variable or fallback to provided GA ID
  const gaId = process.env.NEXT_PUBLIC_GA_ID || 'G-073BZKPS67';
  const [consentGiven, setConsentGiven] = useState(false);

  useEffect(() => {
    // Check if user has given consent (client-side only)
    if (typeof window !== 'undefined') {
      const checkConsent = () => {
        const consent = localStorage.getItem('cookie-consent');
        if (consent === 'accepted') {
          setConsentGiven(true);
        }
      };
      
      // Check immediately
      checkConsent();
      
      // Listen for consent changes via custom event (same tab)
      const handleConsentChange = (e: CustomEvent) => {
        if (e.detail?.consent === 'accepted') {
          setConsentGiven(true);
        } else if (e.detail?.consent === 'rejected') {
          setConsentGiven(false);
        }
      };
      
      // Listen for storage events (from other tabs/windows)
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === 'cookie-consent' && e.newValue === 'accepted') {
          setConsentGiven(true);
        } else if (e.key === 'cookie-consent' && e.newValue === 'rejected') {
          setConsentGiven(false);
        }
      };
      
      window.addEventListener('cookieConsentChanged', handleConsentChange as EventListener);
      window.addEventListener('storage', handleStorageChange);
      
      return () => {
        window.removeEventListener('cookieConsentChanged', handleConsentChange as EventListener);
        window.removeEventListener('storage', handleStorageChange);
      };
    }
  }, []);

  // Don't load GA until consent is given (GDPR/CCPA compliance)
  if (!consentGiven) {
    return null;
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}', {
              'anonymize_ip': true
            });
          `,
        }}
      />
    </>
  );
}


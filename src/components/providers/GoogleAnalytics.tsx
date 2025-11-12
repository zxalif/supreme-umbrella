'use client';

/**
 * Google Analytics 4 Component
 * 
 * Loads Google Analytics script and initializes tracking
 * Uses the provided GA ID: G-073BZKPS67
 */

import Script from 'next/script';

export function GoogleAnalytics() {
  // Use environment variable or fallback to provided GA ID
  const gaId = process.env.NEXT_PUBLIC_GA_ID || 'G-073BZKPS67';

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
            gtag('config', '${gaId}');
          `,
        }}
      />
    </>
  );
}


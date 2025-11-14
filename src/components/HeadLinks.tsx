'use client';

/**
 * Head Links Component
 * 
 * Adds preconnect and DNS prefetch links to the document head.
 * This is needed because Next.js App Router doesn't support <head> in layout.
 */
import { useEffect } from 'react';

export function HeadLinks() {
  useEffect(() => {
    // Add preconnect links for performance
    const addLink = (rel: string, href: string, crossOrigin?: string) => {
      if (!document.querySelector(`link[href="${href}"]`)) {
        const link = document.createElement('link');
        link.rel = rel;
        link.href = href;
        if (crossOrigin) {
          link.crossOrigin = crossOrigin;
        }
        document.head.appendChild(link);
      }
    };

    addLink('preconnect', 'https://fonts.googleapis.com');
    addLink('preconnect', 'https://fonts.gstatic.com', 'anonymous');
    addLink('dns-prefetch', 'https://api.clienthunt.app');
  }, []);

  return null;
}


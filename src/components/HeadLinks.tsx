'use client';

/**
 * Head Links Component
 * 
 * Adds preconnect, DNS prefetch, preload, and favicon links to the document head.
 * This is needed because Next.js App Router doesn't support <head> in layout.
 * 
 * Optimized for Core Web Vitals:
 * - Preconnects to critical third-party domains
 * - Preloads critical resources (fonts, images)
 * - DNS prefetch for faster connection establishment
 */
import { useEffect } from 'react';

export function HeadLinks() {
  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://clienthunt.app';
    
    // Add link tags to head
    const addLink = (
      rel: string, 
      href: string, 
      options?: {
        crossOrigin?: string;
        type?: string;
        sizes?: string;
        as?: string;
        fetchPriority?: 'high' | 'low' | 'auto';
      }
    ) => {
      const existing = document.querySelector(`link[rel="${rel}"][href="${href}"]`);
      if (!existing) {
        const link = document.createElement('link');
        link.rel = rel;
        link.href = href;
        if (options?.crossOrigin) {
          link.crossOrigin = options.crossOrigin;
        }
        if (options?.type) {
          link.setAttribute('type', options.type);
        }
        if (options?.sizes) {
          link.setAttribute('sizes', options.sizes);
        }
        if (options?.as) {
          link.setAttribute('as', options.as);
        }
        if (options?.fetchPriority) {
          link.setAttribute('fetchpriority', options.fetchPriority);
        }
        document.head.appendChild(link);
      }
    };

    // Note: Preconnect hints are added via inline script in layout.tsx that runs immediately
    // This ensures connections are established early, saving ~90ms on LCP for Paddle CDN
    
    // DNS prefetch for additional domains (less critical than preconnect)
    // These are added client-side as they're not critical for initial page load
    addLink('dns-prefetch', 'https://www.google-analytics.com');
    addLink('dns-prefetch', 'https://www.googletagmanager.com');
    addLink('dns-prefetch', 'https://public.profitwell.com');
    
    // ===== CRITICAL: Preload fonts for faster FCP and LCP =====
    // Next.js font optimization handles this, but explicit preload ensures consistency
    // Inter font files are loaded by Next.js, but we can preload the font file if needed
    // Note: Next.js already optimizes Inter font loading, so this is optional
    
    // ===== CRITICAL: Preload favicon and icons (improves FCP) =====
    // Using absolute URLs for better search engine compatibility (Yandex requires absolute URLs)
    addLink('preload', `${baseUrl}/favicon.ico`, { 
      as: 'image', 
      type: 'image/x-icon',
      fetchPriority: 'high'
    });
    
    // Favicon links (for better browser/search engine support)
    // Yandex requires absolute URLs for favicon links
    addLink('icon', `${baseUrl}/favicon.ico`, { type: 'image/x-icon' });
    addLink('shortcut icon', `${baseUrl}/favicon.ico`, { type: 'image/x-icon' });
    addLink('apple-touch-icon', `${baseUrl}/apple-touch-icon.png`, { 
      type: 'image/png', 
      sizes: '180x180' 
    });
    
    // Additional meta tags for better SEO
    const addMeta = (name: string, content: string, property?: string) => {
      const selector = property 
        ? `meta[property="${property}"]` 
        : `meta[name="${name}"]`;
      if (!document.querySelector(selector)) {
        const meta = document.createElement('meta');
        if (property) {
          meta.setAttribute('property', property);
        } else {
          meta.setAttribute('name', name);
        }
        meta.setAttribute('content', content);
        document.head.appendChild(meta);
      }
    };
    
    // Additional Open Graph tags for better Facebook/LinkedIn support
    addMeta('og:image:secure_url', `${baseUrl}/og-image.jpg`, 'og:image:secure_url');
    addMeta('og:image:type', 'image/jpeg', 'og:image:type');
    addMeta('theme-color', '#3B82F6'); // Blue theme color
    
    // Search engine verification tags
    // Google Search Console verification
    addMeta('google-site-verification', 'gRyj9XjrccfiMhzCXflJsWapY0e-qD8u5R6a9NWyKG0');
    
    // Bing Webmaster Tools verification (uses 'name' attribute, not 'property')
    addMeta('msvalidate.01', '05DA541C6D203C4512E299A2FD7EECC0');
    
    // Yandex Webmaster verification (uses 'name' attribute, not 'property')
    addMeta('yandex-verification', 'b62e7fb759963944');
  }, []);

  return null;
}


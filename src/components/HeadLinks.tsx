'use client';

/**
 * Head Links Component
 * 
 * Adds preconnect, DNS prefetch, and favicon links to the document head.
 * This is needed because Next.js App Router doesn't support <head> in layout.
 */
import { useEffect } from 'react';

export function HeadLinks() {
  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://clienthunt.app';
    
    // Add preconnect links for performance
    const addLink = (rel: string, href: string, crossOrigin?: string, type?: string, sizes?: string) => {
      const existing = document.querySelector(`link[rel="${rel}"][href="${href}"]`);
      if (!existing) {
        const link = document.createElement('link');
        link.rel = rel;
        link.href = href;
        if (crossOrigin) {
          link.crossOrigin = crossOrigin;
        }
        if (type) {
          link.setAttribute('type', type);
        }
        if (sizes) {
          link.setAttribute('sizes', sizes);
        }
        document.head.appendChild(link);
      }
    };

    // Performance optimizations
    addLink('preconnect', 'https://fonts.googleapis.com');
    addLink('preconnect', 'https://fonts.gstatic.com', 'anonymous');
    addLink('dns-prefetch', 'https://api.clienthunt.app');
    
    // Favicon links (for better browser/search engine support)
    addLink('icon', '/favicon.ico', undefined, 'image/x-icon');
    addLink('shortcut icon', '/favicon.ico', undefined, 'image/x-icon');
    addLink('apple-touch-icon', '/apple-touch-icon.png', undefined, 'image/png', '180x180');
    
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
    // Bing Webmaster Tools verification
    addMeta('msvalidate.01', '05DA541C6D203C4512E299A2FD7EECC0', 'msvalidate.01');
    
    // Yandex Webmaster verification
    addMeta('yandex-verification', 'b62e7fb759963944', 'yandex-verification');
  }, []);

  return null;
}


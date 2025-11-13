import type { NextConfig } from "next";

/**
 * Next.js Configuration
 * 
 * Configured for port 9100 (not default 3000)
 */

const nextConfig: NextConfig = {
  reactStrictMode: true,
  
  // Standalone output for Docker deployment
  output: 'standalone',
  
  // Custom server port is set via CLI: next dev -p 9100
  // See package.json scripts
  
  // SEO & Performance Optimizations
  compress: true,
  
  // Optimize images
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
  
  // Headers for caching and SEO
  async headers() {
    const isDev = process.env.NODE_ENV === 'development';
    
    // CSP for Next.js - allows Next.js to work while maintaining security
    // In dev mode, we need 'unsafe-eval' for HMR (Hot Module Replacement)
    // In production, we can be stricter
    const cspDirectives = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com", // unsafe-eval needed for Next.js HMR in dev
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net", // unsafe-inline needed for styled-jsx, cdn.jsdelivr.net for intro.js CSS
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com http://localhost:7300 https://api.clienthunt.app",
      "frame-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'",
      "upgrade-insecure-requests",
    ];
    
    // In production, remove unsafe-eval for better security
    if (!isDev) {
      const productionCsp = cspDirectives.map(directive => 
        directive.replace(" 'unsafe-eval'", "")
      );
      cspDirectives.splice(0, cspDirectives.length, ...productionCsp);
    }
    
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Content-Security-Policy',
            value: cspDirectives.join('; ')
          },
        ],
      },
      // JavaScript files - ensure correct MIME type
      {
        source: '/_next/static/:path*.js',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/javascript; charset=utf-8',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:all*(svg|jpg|jpeg|png|gif|ico|webp|avif)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
  
  // Environment variables exposed to the browser
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7300',
    NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID || '',
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN || '',
  },
};

export default nextConfig;

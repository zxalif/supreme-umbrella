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
  
  // Modern JavaScript output - target modern browsers to avoid unnecessary polyfills
  // This reduces bundle size by excluding polyfills for Baseline features
  // (Array.at, Array.flat, Object.fromEntries, String.trimStart/trimEnd, etc.)
  // Note: swcMinify is enabled by default in Next.js 15, no need to specify it
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  
  // Transpile only what's necessary for modern browsers
  transpilePackages: [],
  
  // SEO & Performance Optimizations
  compress: true,
  
  // Optimize CSS loading - Next.js automatically optimizes CSS, but we can ensure proper configuration
  // CSS is automatically code-split and loaded on-demand by Next.js
  // Critical CSS is inlined automatically for better FCP/LCP
  
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
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://cdn.paddle.com https://public.profitwell.com", // unsafe-eval needed for Next.js HMR in dev, cdn.paddle.com for Paddle.js, public.profitwell.com for Paddle's ProfitWell integration
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net https://cdn.paddle.com", // unsafe-inline needed for styled-jsx, cdn.jsdelivr.net for intro.js CSS, cdn.paddle.com for Paddle CSS
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com http://localhost:7300 https://api.clienthunt.app https://sandbox-api.paddle.com https://api.paddle.com https://sandbox-checkout.paddle.com https://checkout.paddle.com https://cdn.paddle.com https://public.profitwell.com", // Paddle API and checkout URLs, cdn.paddle.com for source maps, public.profitwell.com for ProfitWell API calls
      "frame-src 'self' https://sandbox-checkout.paddle.com https://checkout.paddle.com https://sandbox-buy.paddle.com https://buy.paddle.com", // Paddle checkout and buy iframes
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'",
    ];
    
    // In production, remove unsafe-eval and add upgrade-insecure-requests
    if (!isDev) {
      const productionCsp = cspDirectives.map(directive => 
        directive.replace(" 'unsafe-eval'", "")
      );
      productionCsp.push("upgrade-insecure-requests");
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
      // CSS files - ensure correct MIME type (multiple patterns for dev/prod)
      {
        source: '/_next/static/css/:path*.css',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/css; charset=utf-8',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*.css',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/css; charset=utf-8',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Font files - ensure correct MIME types
      {
        source: '/_next/static/media/:path*.woff2',
        headers: [
          {
            key: 'Content-Type',
            value: 'font/woff2',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/media/:path*.woff',
        headers: [
          {
            key: 'Content-Type',
            value: 'font/woff',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/media/:path*.ttf',
        headers: [
          {
            key: 'Content-Type',
            value: 'font/ttf',
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

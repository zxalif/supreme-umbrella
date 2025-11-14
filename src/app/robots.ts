import { MetadataRoute } from 'next'

/**
 * Robots.txt for SEO
 * 
 * Next.js 15 automatically generates robots.txt from this file.
 * Access at: https://yourdomain.com/robots.txt
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://clienthunt.app'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Block private routes only
        // Note: We do NOT block /_next/ because:
        // 1. Google needs static assets (CSS, JS, fonts) to render pages
        // 2. Next.js static assets are hashed and don't expose sensitive info
        // 3. Internal routes are already protected by authentication
        disallow: [
          '/dashboard/', 
          '/api/', 
          '/admin/', 
          '/settings/',
          '/search', // Search results page (not indexable)
          '/login',
          '/register',
          '/forgot-password',
          '/reset-password',
          '/verify-email',
          '/checkout', // Private transaction page
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}

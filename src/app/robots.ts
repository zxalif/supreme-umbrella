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
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/', '/api/', '/admin/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}

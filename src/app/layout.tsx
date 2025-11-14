import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { GoogleAnalytics } from "@/components/providers/GoogleAnalytics";
import { AnalyticsProvider } from "@/components/providers/AnalyticsProvider";
import { PaddleProvider } from "@/components/providers/PaddleProvider";
import { CookieConsent } from "@/components/CookieConsent";
import { HeadLinks } from "@/components/HeadLinks";
import { WebSiteSchema } from "@/components/seo/StructuredData";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap', // Optimize font loading
  variable: '--font-inter',
});

/**
 * Root Layout with SEO Metadata
 * 
 * This layout applies to all pages and includes:
 * - SEO metadata (title, description, OG tags)
 * - Font optimization
 * - Global styles
 */
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://clienthunt.app';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  
  title: {
    default: 'ClientHunt - Find Freelance Opportunities on Reddit Automatically',
    template: '%s | ClientHunt'
  },
  
  description: 'Find freelance opportunities on Reddit automatically. AI-powered lead generation monitors Reddit 24/7 for client posts matching your skills. Free 1-month trial, no credit card required. Start finding clients today!',
  
  keywords: [
    'Reddit lead generation',
    'freelance opportunities',
    'Reddit client finder',
    'freelance leads',
    'Reddit opportunity finder',
    'find clients on Reddit',
    'automated lead generation',
    'freelance lead generation tool',
    'Reddit freelance jobs',
    'find freelance work',
    'Reddit job finder',
    'freelance client discovery'
  ],
  
  authors: [{ name: 'ClientHunt' }],
  creator: 'ClientHunt',
  publisher: 'ClientHunt',
  
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  // Open Graph (Facebook, LinkedIn, etc.)
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: baseUrl,
    siteName: 'ClientHunt',
    title: 'ClientHunt - Find Freelance Opportunities on Reddit Automatically',
    description: 'Find freelance opportunities on Reddit automatically. AI-powered lead generation monitors Reddit 24/7 for client posts matching your skills. Free 1-month trial, no credit card required.',
    images: [
      {
        url: `${baseUrl}/og-image.jpg`, // Absolute URL required for Facebook
        // Note: Recommended size is 1200×630px (1.91:1 aspect ratio) for optimal display
        // Current image is 1536×1024px - will work but may be cropped on some platforms
        width: 1536, // Actual image width
        height: 1024, // Actual image height
        alt: 'ClientHunt - AI-Powered Reddit Lead Generation Platform for Freelancers',
        type: 'image/jpeg',
      },
    ],
  },
  
  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'ClientHunt - Find Freelance Opportunities on Reddit',
    description: 'AI-powered lead generation monitors Reddit 24/7 for client posts. Free 1-month trial, no credit card required.',
    images: [`${baseUrl}/twitter-image.jpg`], // Absolute URL
    creator: '@clienthuntapp',
    site: '@clienthuntapp',
  },
  
  // Canonical URL
  alternates: {
    canonical: baseUrl,
  },
  
  // Additional metadata
  category: 'Business',
  classification: 'SaaS',
  
  // Icons and links - Multiple sizes for better compatibility
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.ico', type: 'image/x-icon' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },
  
  // Other metadata
  other: {
    // Search engine verification tags
    'google-site-verification': 'gRyj9XjrccfiMhzCXflJsWapY0e-qD8u5R6a9NWyKG0', // Google Search Console verification
    'msvalidate.01': '05DA541C6D203C4512E299A2FD7EECC0', // Bing Webmaster Tools verification
    'yandex-verification': 'b62e7fb759963944', // Yandex Webmaster verification
  },
  
  // Manifest for PWA support
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://clienthunt.app';
  
  return (
    <html lang="en" className={inter.variable}>
      <body className={inter.className}>
        {/* WebSite Schema for sitelinks search box - appears on all pages */}
        <WebSiteSchema 
          potentialAction={{
            target: `${baseUrl}/search?q={search_term_string}`,
            queryInput: "required name=search_term_string",
          }}
        />
        {/* HeadLinks adds critical resource hints (preconnect, preload) for Core Web Vitals optimization */}
        <HeadLinks />
        <GoogleAnalytics />
        <PaddleProvider>
          <AnalyticsProvider>
            {children}
          </AnalyticsProvider>
        </PaddleProvider>
        <Toaster 
          position="top-right"
          richColors
          closeButton
          expand={false}
          duration={4000}
        />
        <CookieConsent />
      </body>
    </html>
  );
}


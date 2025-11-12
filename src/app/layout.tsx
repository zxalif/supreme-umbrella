import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { GoogleAnalytics } from "@/components/providers/GoogleAnalytics";
import { AnalyticsProvider } from "@/components/providers/AnalyticsProvider";
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
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://clienthunt.app'),
  
  title: {
    default: 'ClientHunt - Find Freelance Opportunities on Reddit',
    template: '%s | ClientHunt'
  },
  
  description: 'Find freelance opportunities on Reddit automatically. AI-powered lead generation tool that monitors Reddit 24/7 for relevant client posts. Get instant notifications for opportunities matching your skills. Free 1-month trial, no credit card required.',
  
  keywords: [
    'Reddit lead generation',
    'freelance opportunities',
    'Reddit client finder',
    'freelance leads',
    'Reddit opportunity finder',
    'find clients on Reddit',
    'automated lead generation',
    'freelance lead generation tool'
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
    url: '/',
    siteName: 'ClientHunt',
    title: 'ClientHunt - Find Freelance Opportunities on Reddit',
    description: 'Find freelance opportunities on Reddit automatically. AI-powered lead generation tool that monitors Reddit 24/7 for relevant client posts. Get instant notifications for opportunities matching your skills.',
    images: [
      {
        url: '/og-image.jpg', // Create this image (1200x630px)
        width: 1200,
        height: 630,
        alt: 'ClientHunt - AI-Powered Reddit Lead Generation Platform for Freelancers',
      },
    ],
  },
  
  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'ClientHunt - Find Freelance Opportunities on Reddit',
    description: 'Find freelance opportunities on Reddit automatically. AI-powered lead generation tool that monitors Reddit 24/7 for relevant client posts.',
    images: ['/twitter-image.jpg'], // Create this image (1200x675px)
    creator: '@clienthunt',
  },
  
  // Canonical URL
  alternates: {
    canonical: '/',
  },
  
  // Additional metadata
  category: 'Business',
  classification: 'SaaS',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* DNS Prefetch for external resources */}
        <link rel="dns-prefetch" href="https://api.clienthunt.app" />
      </head>
      <body className={inter.className}>
        <GoogleAnalytics />
        <AnalyticsProvider>
          {children}
        </AnalyticsProvider>
        <Toaster 
          position="top-right"
          richColors
          closeButton
          expand={false}
          duration={4000}
        />
      </body>
    </html>
  );
}


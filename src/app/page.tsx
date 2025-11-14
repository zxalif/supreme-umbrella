import { OrganizationSchema, SoftwareApplicationSchema, BreadcrumbSchema } from '@/components/seo/StructuredData';
import { Navbar } from '@/components/landing/Navbar';
import { Hero } from '@/components/landing/Hero';
import { Statistics } from '@/components/landing/Statistics';
import { KeywordStats } from '@/components/landing/KeywordStats';
import { Features } from '@/components/landing/Features';
import { UseCases } from '@/components/landing/UseCases';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { Comparison } from '@/components/landing/Comparison';
import { Testimonials } from '@/components/landing/Testimonials';
import { Pricing } from '@/components/landing/Pricing';
import { FAQ } from '@/components/landing/FAQ';
import { TrustBadges } from '@/components/landing/TrustBadges';
import { Footer } from '@/components/landing/Footer';

/**
 * Landing Page
 * 
 * SEO Optimized Landing Page with:
 * - Semantic HTML structure
 * - Structured data (Schema.org)
 * - Optimized meta tags (in layout.tsx)
 * - Fast loading
 * - Mobile responsive
 * - Light theme design
 */
export default function HomePage() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://clienthunt.app';
  
  return (
    <>
      {/* Structured Data for SEO */}
      {/* WebSiteSchema is included in root layout.tsx for all pages */}
      <OrganizationSchema />
      <SoftwareApplicationSchema />
      <BreadcrumbSchema 
        items={[
          { name: 'Home', url: baseUrl },
        ]} 
      />
      
      {/* Navigation */}
      <Navbar />
      
      {/* Main Content - Add padding-top to account for fixed navbar */}
      <main className="pt-16">
        <Hero />
        <Statistics />
        <KeywordStats />
        <TrustBadges />
        <Features />
        <UseCases />
        <HowItWorks />
        <Comparison />
        <Testimonials />
        <Pricing />
        <FAQ />
      </main>
      
      {/* Footer */}
      <Footer />
    </>
  );
}


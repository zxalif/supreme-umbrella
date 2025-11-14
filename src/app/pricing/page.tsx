import type { Metadata } from 'next';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { Pricing } from '@/components/landing/Pricing';
import { BreadcrumbsWrapper } from '@/components/navigation/BreadcrumbsWrapper';
import { BreadcrumbSchema } from '@/components/seo/StructuredData';

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Simple, transparent pricing for ClientHunt. Choose the plan that fits your needs. Start with a 1-month free trial, no credit card required.',
  openGraph: {
    title: 'Pricing - ClientHunt',
    description: 'Simple, transparent pricing for ClientHunt. Choose the plan that fits your needs.',
    type: 'website',
  },
};

export default function PricingPage() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://clienthunt.app';

  return (
    <>
      {/* Structured Data for SEO */}
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: baseUrl },
          { name: 'Pricing', url: `${baseUrl}/pricing` },
        ]}
      />

      <Navbar />
      <div className="min-h-screen bg-gray-50" style={{ paddingTop: '80px' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-12">
          {/* Breadcrumbs */}
          <BreadcrumbsWrapper
            items={[
              { name: 'Home', url: baseUrl },
              { name: 'Pricing', url: `${baseUrl}/pricing` },
            ]}
          />

          {/* Pricing Section */}
          <Pricing />
        </div>
      </div>
      <Footer />
    </>
  );
}


/**
 * Structured Data (Schema.org) Components
 * 
 * These components add structured data to help search engines
 * understand the content and display rich snippets.
 */

interface OrganizationSchemaProps {
  name?: string;
  url?: string;
  logo?: string;
  description?: string;
  socialMedia?: {
    twitter?: string;
    linkedin?: string;
    facebook?: string;
  };
}

/**
 * Organization Schema
 * 
 * Tells search engines about your company/organization
 */
export function OrganizationSchema({
  name = 'ClientHunt',
  url = 'https://clienthunt.app',
  logo = 'https://clienthunt.app/logo.png',
  description = 'Reddit-first lead generation platform for freelancers',
  socialMedia = {
    twitter: '#',
    linkedin: '#',
  },
}: OrganizationSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": name,
    "url": url,
    "logo": logo,
    "description": description,
    ...(Object.keys(socialMedia).length > 0 && {
      "sameAs": Object.values(socialMedia).filter(Boolean),
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface SoftwareApplicationSchemaProps {
  name?: string;
  applicationCategory?: string;
  offers?: {
    price: string;
    priceCurrency: string;
  }[];
  aggregateRating?: {
    ratingValue: string;
    reviewCount: string;
  };
}

/**
 * SoftwareApplication Schema
 * 
 * Tells search engines about your SaaS application
 */
export function SoftwareApplicationSchema({
  name = 'ClientHunt',
  applicationCategory = 'BusinessApplication',
  offers = [
    { price: '19', priceCurrency: 'USD' },
    { price: '39', priceCurrency: 'USD' },
    { price: '79', priceCurrency: 'USD' },
  ],
  aggregateRating,
}: SoftwareApplicationSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": name,
    "applicationCategory": applicationCategory,
    "offers": offers.map(offer => ({
      "@type": "Offer",
      "price": offer.price,
      "priceCurrency": offer.priceCurrency,
    })),
    ...(aggregateRating && {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": aggregateRating.ratingValue,
        "reviewCount": aggregateRating.reviewCount,
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface FAQSchemaProps {
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

/**
 * FAQ Schema
 * 
 * Displays FAQ in search results as rich snippets
 */
export function FAQSchema({ faqs }: FAQSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface BreadcrumbSchemaProps {
  items: Array<{
    name: string;
    url: string;
  }>;
}

/**
 * Breadcrumb Schema
 * 
 * Shows breadcrumb navigation in search results
 */
export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}


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
 * WebSite Schema
 * 
 * Enables sitelinks search box in Google search results
 * This allows users to search your site directly from Google
 */
interface WebSiteSchemaProps {
  url?: string;
  name?: string;
  potentialAction?: {
    target: string;
    queryInput: string;
  };
}

export function WebSiteSchema({
  url = 'https://clienthunt.app',
  name = 'ClientHunt',
  potentialAction,
}: WebSiteSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": name,
    "url": url,
    "description": "AI-powered lead generation platform that helps freelancers find opportunities on Reddit automatically",
    "publisher": {
      "@type": "Organization",
      "name": "ClientHunt",
      "url": url,
    },
    ...(potentialAction && {
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": potentialAction.target,
        },
        "query-input": potentialAction.queryInput,
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
    twitter: 'https://twitter.com/clienthuntapp',
    linkedin: 'https://www.linkedin.com/company/clienthuntapp/',
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
  applicationSubCategory?: string;
  operatingSystem?: string;
  url?: string;
  description?: string;
  screenshot?: string;
  featureList?: string[];
  softwareVersion?: string;
  offers?: {
    price: string;
    priceCurrency: string;
    availability?: string;
    url?: string;
    priceValidUntil?: string;
    priceSpecification?: {
      priceType?: string;
      billingDuration?: string;
    };
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
 * Required fields: name, applicationCategory, offers
 * Recommended: operatingSystem, url, description, screenshot, provider
 */
export function SoftwareApplicationSchema({
  name = 'ClientHunt',
  applicationCategory = 'BusinessApplication',
  applicationSubCategory = 'LeadGenerationSoftware',
  operatingSystem = 'Web',
  url = 'https://clienthunt.app',
  description = 'AI-powered lead generation platform that helps freelancers find opportunities on Reddit automatically',
  screenshot = 'https://clienthunt.app/og-image.jpg',
  featureList = [
    'AI-powered opportunity scoring',
    'Reddit monitoring and alerts',
    'Keyword-based search',
    'Email notifications',
    'Analytics dashboard',
    'CSV/PDF export',
  ],
  softwareVersion = '1.0',
  offers = [
    // Most popular plan (Professional) - monthly
    // Note: Individual plans are handled by ProductSchema in Pricing component
    { 
      price: '39', 
      priceCurrency: 'USD', 
      availability: 'https://schema.org/InStock', 
      url: 'https://clienthunt.app/pricing',
      priceSpecification: {
        priceType: 'https://schema.org/Subscription',
        billingDuration: 'P1M', // 1 month
      },
    },
  ],
  aggregateRating,
}: SoftwareApplicationSchemaProps) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://clienthunt.app';
  const fullScreenshot = screenshot?.startsWith('http') ? screenshot : `${baseUrl}${screenshot || '/og-image.jpg'}`;
  
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": name,
    "applicationCategory": applicationCategory,
    ...(applicationSubCategory && { "applicationSubCategory": applicationSubCategory }),
    "operatingSystem": operatingSystem,
    "url": url,
    "description": description,
    "screenshot": fullScreenshot,
    ...(featureList && featureList.length > 0 && { "featureList": featureList }),
    ...(softwareVersion && { "softwareVersion": softwareVersion }),
    "provider": {
      "@type": "Organization",
      "name": "ClientHunt",
      "url": baseUrl,
    },
    "offers": offers.map(offer => {
      const offerObj: any = {
        "@type": "Offer",
        "price": offer.price,
        "priceCurrency": offer.priceCurrency,
        "availability": offer.availability || "https://schema.org/InStock",
      };
      
      if (offer.url) {
        offerObj.url = offer.url;
      }
      
      if (offer.priceValidUntil) {
        offerObj.priceValidUntil = offer.priceValidUntil;
      }
      
      // Add billing duration as a simple property if specified
      if (offer.priceSpecification?.billingDuration) {
        // For monthly subscriptions, add priceType
        if (offer.priceSpecification.billingDuration === 'P1M') {
          offerObj.priceType = "https://schema.org/Subscription";
        } else if (offer.priceSpecification.billingDuration === 'P1Y') {
          offerObj.priceType = "https://schema.org/Subscription";
        }
      }
      
      return offerObj;
    }),
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

interface ArticleSchemaProps {
  title: string;
  description: string;
  author: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
  url: string;
  category?: string;
  publisher?: {
    name: string;
    logo: string;
  };
}

/**
 * Article Schema
 * 
 * For blog posts and articles - enables rich snippets in search results
 */
export function ArticleSchema({
  title,
  description,
  author,
  datePublished,
  dateModified,
  image,
  url,
  category,
  publisher = {
    name: 'ClientHunt',
    logo: 'https://clienthunt.app/logo.png',
  },
}: ArticleSchemaProps) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://clienthunt.app';
  const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;
  const fullImage = image?.startsWith('http') ? image : `${baseUrl}${image || '/og-image.jpg'}`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "image": fullImage,
    "datePublished": datePublished,
    "dateModified": dateModified || datePublished,
    "author": {
      "@type": "Person",
      "name": author,
    },
    "publisher": {
      "@type": "Organization",
      "name": publisher.name,
      "logo": {
        "@type": "ImageObject",
        "url": publisher.logo,
      },
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": fullUrl,
    },
    ...(category && { "articleSection": category }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface HowToSchemaProps {
  name: string;
  description: string;
  steps: Array<{
    name: string;
    text: string;
    image?: string;
    url?: string;
  }>;
  totalTime?: string;
  image?: string;
}

/**
 * HowTo Schema
 * 
 * For step-by-step guides - enables rich snippets with steps in search results
 */
export function HowToSchema({
  name,
  description,
  steps,
  totalTime,
  image,
}: HowToSchemaProps) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://clienthunt.app';
  const fullImage = image?.startsWith('http') ? image : `${baseUrl}${image || '/og-image.jpg'}`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": name,
    "description": description,
    "image": fullImage,
    ...(totalTime && { "totalTime": totalTime }),
    "step": steps.map((step, index) => ({
      "@type": "HowToStep",
      "position": index + 1,
      "name": step.name,
      "text": step.text,
      ...(step.image && {
        "image": step.image.startsWith('http') ? step.image : `${baseUrl}${step.image}`,
      }),
      ...(step.url && {
        "url": step.url.startsWith('http') ? step.url : `${baseUrl}${step.url}`,
      }),
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface ReviewSchemaProps {
  itemReviewed: {
    name: string;
    type?: string;
  };
  reviews: Array<{
    author: string;
    datePublished: string;
    reviewBody: string;
    reviewRating: {
      ratingValue: number;
      bestRating?: number;
      worstRating?: number;
    };
  }>;
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
    bestRating?: number;
    worstRating?: number;
  };
}

/**
 * Review Schema
 * 
 * For product/service reviews - enables star ratings in search results
 */
export function ReviewSchema({
  itemReviewed,
  reviews,
  aggregateRating,
}: ReviewSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": itemReviewed.type || "Product",
    "name": itemReviewed.name,
    "review": reviews.map(review => ({
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": review.author,
      },
      "datePublished": review.datePublished,
      "reviewBody": review.reviewBody,
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": review.reviewRating.ratingValue,
        "bestRating": review.reviewRating.bestRating || 5,
        "worstRating": review.reviewRating.worstRating || 1,
      },
    })),
    ...(aggregateRating && {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": aggregateRating.ratingValue,
        "reviewCount": aggregateRating.reviewCount,
        "bestRating": aggregateRating.bestRating || 5,
        "worstRating": aggregateRating.worstRating || 1,
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

interface ProductSchemaProps {
  name: string;
  description: string;
  image?: string;
  brand?: string;
  offers: Array<{
    price: string;
    priceCurrency: string;
    availability?: string;
    url?: string;
    priceValidUntil?: string;
  }>;
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
  };
  category?: string;
}

/**
 * Product Schema
 * 
 * For pricing plans - enables rich snippets with pricing in search results
 */
export function ProductSchema({
  name,
  description,
  image,
  brand = 'ClientHunt',
  offers,
  aggregateRating,
  category,
}: ProductSchemaProps) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://clienthunt.app';
  const fullImage = image?.startsWith('http') ? image : `${baseUrl}${image || '/og-image.jpg'}`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": name,
    "description": description,
    "image": fullImage,
    "brand": {
      "@type": "Brand",
      "name": brand,
    },
    ...(category && { "category": category }),
    "offers": offers.map(offer => ({
      "@type": "Offer",
      "price": offer.price,
      "priceCurrency": offer.priceCurrency,
      "availability": offer.availability || "https://schema.org/InStock",
      "url": offer.url || `${baseUrl}/pricing`,
      ...(offer.priceValidUntil && { "priceValidUntil": offer.priceValidUntil }),
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

interface VideoObjectSchemaProps {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  duration?: string;
  contentUrl?: string;
  embedUrl?: string;
}

/**
 * VideoObject Schema
 * 
 * For video content - enables video rich snippets in search results
 */
export function VideoObjectSchema({
  name,
  description,
  thumbnailUrl,
  uploadDate,
  duration,
  contentUrl,
  embedUrl,
}: VideoObjectSchemaProps) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://clienthunt.app';
  const fullThumbnail = thumbnailUrl.startsWith('http') ? thumbnailUrl : `${baseUrl}${thumbnailUrl}`;
  const fullContentUrl = contentUrl?.startsWith('http') ? contentUrl : contentUrl ? `${baseUrl}${contentUrl}` : undefined;
  const fullEmbedUrl = embedUrl?.startsWith('http') ? embedUrl : embedUrl ? `${baseUrl}${embedUrl}` : undefined;

  const schema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": name,
    "description": description,
    "thumbnailUrl": fullThumbnail,
    "uploadDate": uploadDate,
    ...(duration && { "duration": duration }),
    ...(fullContentUrl && { "contentUrl": fullContentUrl }),
    ...(fullEmbedUrl && { "embedUrl": fullEmbedUrl }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}


'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

/**
 * Breadcrumb Item
 */
export interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

/**
 * Breadcrumbs Component
 * 
 * Visible breadcrumb navigation for better UX and SEO.
 * Should be used alongside BreadcrumbSchema for structured data.
 */
export function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <nav 
      aria-label="Breadcrumb" 
      className={`flex items-center space-x-2 text-sm mb-6 py-3 px-2 bg-gray-50 rounded-lg border border-gray-200 ${className}`}
      style={{ minHeight: '40px' }}
    >
      <ol className="flex items-center space-x-2 flex-wrap list-none m-0 p-0" itemScope itemType="https://schema.org/BreadcrumbList">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isFirst = index === 0;

          return (
            <li
              key={`${item.url}-${index}`}
              className="flex items-center"
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              {isFirst ? (
                <Link
                  href={item.url}
                  className="flex items-center text-gray-700 hover:text-blue-600 transition-colors font-medium"
                  itemProp="item"
                  title={item.name}
                >
                  <Home className="w-4 h-4 mr-1.5" aria-hidden="true" />
                  <span className="sr-only" itemProp="name">{item.name}</span>
                </Link>
              ) : isLast ? (
                <span className="text-gray-900 font-semibold" itemProp="name">
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.url}
                  className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                  itemProp="item"
                >
                  <span itemProp="name">{item.name}</span>
                </Link>
              )}
              <meta itemProp="position" content={String(index + 1)} />
              {!isLast && (
                <ChevronRight className="w-4 h-4 text-gray-400 mx-2 flex-shrink-0" aria-hidden="true" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}


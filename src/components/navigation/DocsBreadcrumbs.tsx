'use client';

import { Breadcrumbs } from './Breadcrumbs';
import { usePathname } from 'next/navigation';

/**
 * Docs Breadcrumbs Component
 * 
 * Automatically generates breadcrumbs for documentation pages
 */
export function DocsBreadcrumbs() {
  const pathname = usePathname();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://clienthunt.app';

  // Map paths to breadcrumb labels
  const pathLabels: Record<string, string> = {
    '/docs': 'Documentation',
    '/docs/getting-started': 'Getting Started',
    '/docs/keyword-searches': 'Keyword Searches',
    '/docs/opportunities': 'Opportunities',
    '/docs/analytics': 'Analytics',
    '/docs/faq': 'FAQ',
  };

  // Build breadcrumb items
  const items = [
    { name: 'Home', url: baseUrl },
    { name: 'Documentation', url: `${baseUrl}/docs` },
  ];

  // Add current page if not the docs overview
  if (pathname && pathname !== '/docs') {
    const label = pathLabels[pathname] || pathname.split('/').pop()?.replace(/-/g, ' ') || 'Page';
    items.push({
      name: label,
      url: `${baseUrl}${pathname}`,
    });
  }

  return <Breadcrumbs items={items} />;
}


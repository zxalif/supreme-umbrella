'use client';

import { Breadcrumbs } from './Breadcrumbs';
import { usePathname } from 'next/navigation';

/**
 * Docs Breadcrumbs Component
 * 
 * Automatically generates breadcrumbs for documentation pages
 * Uses relative paths for internal navigation (works in dev, staging, and production)
 */
export function DocsBreadcrumbs() {
  const pathname = usePathname();

  // Map paths to breadcrumb labels
  const pathLabels: Record<string, string> = {
    '/docs': 'Documentation',
    '/docs/getting-started': 'Getting Started',
    '/docs/keyword-searches': 'Keyword Searches',
    '/docs/opportunities': 'Opportunities',
    '/docs/analytics': 'Analytics',
    '/docs/faq': 'FAQ',
  };

  // Build breadcrumb items using relative paths
  const items = [
    { name: 'Home', url: '/' },
    { name: 'Documentation', url: '/docs' },
  ];

  // Add current page if not the docs overview
  if (pathname && pathname !== '/docs') {
    const label = pathLabels[pathname] || pathname.split('/').pop()?.replace(/-/g, ' ') || 'Page';
    items.push({
      name: label,
      url: pathname, // Use relative path
    });
  }

  return <Breadcrumbs items={items} />;
}


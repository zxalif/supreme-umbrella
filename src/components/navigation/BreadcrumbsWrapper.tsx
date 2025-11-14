'use client';

import { Breadcrumbs, type BreadcrumbItem } from './Breadcrumbs';

/**
 * Breadcrumbs Wrapper Component
 * 
 * Wrapper to ensure breadcrumbs render correctly in server components
 */
interface BreadcrumbsWrapperProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function BreadcrumbsWrapper({ items, className }: BreadcrumbsWrapperProps) {
  return <Breadcrumbs items={items} className={className} />;
}


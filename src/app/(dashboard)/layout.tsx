'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';

/**
 * Dashboard Layout
 * 
 * Wraps all dashboard pages with:
 * - Header
 * - Sidebar
 * - Authentication protection
 * 
 * All pages including success/cancel pages use DashboardLayout for consistent auth handling
 */
export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}


'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';

/**
 * Dashboard Layout
 * 
 * Wraps all dashboard pages with:
 * - Header
 * - Sidebar
 * - Authentication protection
 */
export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}


'use client';

import { ErrorBoundary } from '@/components/errors/ErrorBoundary';

interface ErrorBoundaryProviderProps {
  children: React.ReactNode;
}

/**
 * Error Boundary Provider
 * 
 * Wraps the application with error boundary
 * Use this in client components
 */
export function ErrorBoundaryProvider({ children }: ErrorBoundaryProviderProps) {
  return <ErrorBoundary>{children}</ErrorBoundary>;
}


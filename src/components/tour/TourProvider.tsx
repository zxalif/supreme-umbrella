'use client';

import { createContext, useContext, useEffect, useState, useRef, useMemo, useCallback, ReactNode } from 'react';
import { tourService } from '@/lib/tour/tourService';
import { usePathname } from 'next/navigation';

interface TourContextType {
  startTour: () => void;
  hasCompletedTour: boolean;
  resetTour: () => void;
  isTourActive: boolean;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

export function useTour() {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error('useTour must be used within TourProvider');
  }
  return context;
}

interface TourProviderProps {
  children: ReactNode;
  autoStart?: boolean; // Auto-start tour for first-time users
}

/**
 * Tour Provider
 * 
 * DISABLED: Tour functionality is currently disabled.
 * This component now just returns children without any tour logic.
 */
export function TourProvider({ children, autoStart = true }: TourProviderProps) {
  // Tour is disabled - just return children without any logic
  // Provide a minimal context to prevent errors in components that use useTour()
  const contextValue = useMemo(
    () => ({
      startTour: () => {}, // No-op
      hasCompletedTour: true, // Always mark as completed
      resetTour: () => {}, // No-op
      isTourActive: false, // Never active
    }),
    []
  );

  return (
    <TourContext.Provider value={contextValue}>
      {children}
    </TourContext.Provider>
  );
}


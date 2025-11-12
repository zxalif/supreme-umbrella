'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
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
 * Provides tour functionality throughout the app
 * - Manages tour state
 * - Auto-starts tour for first-time users
 * - Provides tour controls
 */
export function TourProvider({ children, autoStart = true }: TourProviderProps) {
  const [hasCompletedTour, setHasCompletedTour] = useState(false);
  const [isTourActive, setIsTourActive] = useState(false);
  const pathname = usePathname();

  // Check if tour has been completed on mount
  useEffect(() => {
    setHasCompletedTour(tourService.hasCompletedTour());
  }, []);

  // Check if page tour has been shown
  const hasPageTourShown = (page: string): boolean => {
    if (typeof window === 'undefined') return false;
    const key = `clienthunt_tour_page_${page}`;
    return localStorage.getItem(key) === 'shown';
  };

  // Mark page tour as shown
  const markPageTourShown = (page: string): void => {
    if (typeof window === 'undefined') return;
    const key = `clienthunt_tour_page_${page}`;
    localStorage.setItem(key, 'shown');
  };

  const startTour = async () => {
    if (isTourActive) return;

    setIsTourActive(true);
    await tourService.startTour(
      () => {
        // On complete - mark this page's tour as shown
        if (pathname) {
          markPageTourShown(pathname);
        }
        setIsTourActive(false);
      },
      () => {
        // On exit
        setIsTourActive(false);
      }
    );
  };

  // Auto-start tour when pathname changes
  useEffect(() => {
    if (hasCompletedTour) return;

    // Define pages that have tours
    const pagesWithTours = [
      '/dashboard',
      '/dashboard/keyword-searches',
      '/dashboard/opportunities',
    ];

    // Normalize pathname (remove trailing slash)
    const normalizedPathname = pathname?.replace(/\/$/, '') || '';
    
    if (normalizedPathname && pagesWithTours.includes(normalizedPathname)) {
      // Check if this page's tour has been shown
      const pageTourShown = hasPageTourShown(normalizedPathname);
      console.log('[TourProvider] Page:', normalizedPathname, 'Tour shown:', pageTourShown, 'isTourActive:', isTourActive);
      
      if (!pageTourShown) {
        // Reset tour active state when navigating to a new page
        setIsTourActive(false);
        
        console.log('[TourProvider] Starting tour for page:', normalizedPathname);
        
        // Small delay to ensure page is fully rendered and DOM is ready
        const timer = setTimeout(() => {
          console.log('[TourProvider] Timer fired, calling startTour. isTourActive:', isTourActive);
          startTour();
        }, 1500);

        return () => clearTimeout(timer);
      } else {
        console.log('[TourProvider] Tour already shown for page:', normalizedPathname);
      }
    } else {
      console.log('[TourProvider] Page not in tour list:', normalizedPathname);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasCompletedTour, pathname]);

  const resetTour = () => {
    tourService.resetTour();
    setHasCompletedTour(false);
  };

  return (
    <TourContext.Provider
      value={{
        startTour,
        hasCompletedTour,
        resetTour,
        isTourActive,
      }}
    >
      {children}
    </TourContext.Provider>
  );
}


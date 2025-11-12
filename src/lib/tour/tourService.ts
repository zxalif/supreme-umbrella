/**
 * Tour Service
 * 
 * Manages the onboarding tour state and functionality
 * Uses dynamic imports to avoid SSR issues
 */

import { 
  TOUR_STEPS, 
  DASHBOARD_TOUR_STEPS,
  KEYWORD_SEARCHES_TOUR_STEPS,
  OPPORTUNITIES_TOUR_STEPS,
  TOUR_OPTIONS, 
  TOUR_STORAGE_KEY, 
  TOUR_STORAGE_VERSION, 
  TOUR_PROGRESS_KEY 
} from './config';
import type { TourStep } from './config';

export interface TourState {
  completed: boolean;
  version: string;
  completedAt?: string;
}

// Dynamic import type for intro.js
type IntroJs = typeof import('intro.js').default;
type IntroJsTour = ReturnType<IntroJs['tour']>;

class TourService {
  private introInstance: IntroJsTour | null = null;
  private introJsModule: IntroJs | null = null;
  private currentStepIndex: number = 0;
  private cssLoaded = false;

  /**
   * Check if user has completed the tour
   */
  hasCompletedTour(): boolean {
    if (typeof window === 'undefined') return false;
    
    try {
      const stored = localStorage.getItem(TOUR_STORAGE_KEY);
      if (!stored) return false;
      
      const state: TourState = JSON.parse(stored);
      // Check if version matches (allows resetting tour on updates)
      return state.completed && state.version === TOUR_STORAGE_VERSION;
    } catch (error) {
      console.error('Error reading tour state:', error);
      return false;
    }
  }

  /**
   * Mark tour as completed (for entire app)
   */
  markTourCompleted(): void {
    if (typeof window === 'undefined') return;
    
    try {
      const state: TourState = {
        completed: true,
        version: TOUR_STORAGE_VERSION,
        completedAt: new Date().toISOString(),
      };
      localStorage.setItem(TOUR_STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Error saving tour state:', error);
    }
  }

  /**
   * Mark a specific page's tour as shown
   */
  markPageTourShown(page: string): void {
    if (typeof window === 'undefined') return;
    try {
      const key = `clienthunt_tour_page_${page}`;
      localStorage.setItem(key, 'shown');
    } catch (error) {
      console.error('Error marking page tour as shown:', error);
    }
  }

  /**
   * Reset tour (for testing or re-taking)
   */
  resetTour(): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(TOUR_STORAGE_KEY);
      localStorage.removeItem(TOUR_PROGRESS_KEY);
      
      // Clear all page tour markers
      const pages = ['/dashboard', '/dashboard/keyword-searches', '/dashboard/opportunities'];
      pages.forEach(page => {
        localStorage.removeItem(`clienthunt_tour_page_${page}`);
      });
      
      // Also expose to window for console access in dev
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Tour reset! You can now start it again.');
      }
    } catch (error) {
      console.error('Error resetting tour:', error);
    }
  }

  /**
   * Load intro.js dynamically (client-side only)
   */
  private async loadIntroJs(): Promise<IntroJs> {
    if (this.introJsModule) {
      return this.introJsModule;
    }

    if (typeof window === 'undefined') {
      throw new Error('Cannot load intro.js on server side');
    }

    // Load CSS dynamically
    if (!this.cssLoaded) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/intro.js@8.3.2/minified/introjs.min.css';
      document.head.appendChild(link);
      this.cssLoaded = true;
    }

    // Dynamically import intro.js
    const introJsModule = await import('intro.js');
    this.introJsModule = introJsModule.default;
    return this.introJsModule;
  }

  /**
   * Get current page path
   */
  private getCurrentPath(): string {
    if (typeof window === 'undefined') return '';
    return window.location.pathname;
  }

  /**
   * Get steps for current page
   */
  private getStepsForCurrentPage(): TourStep[] {
    const currentPath = this.getCurrentPath();
    
    // Return page-specific tour steps
    if (currentPath === '/dashboard') {
      return DASHBOARD_TOUR_STEPS;
    } else if (currentPath === '/dashboard/keyword-searches') {
      return KEYWORD_SEARCHES_TOUR_STEPS;
    } else if (currentPath === '/dashboard/opportunities') {
      return OPPORTUNITIES_TOUR_STEPS;
    }
    
    // Default: no steps for other pages
    return [];
  }

  /**
   * Save tour progress
   */
  private saveProgress(stepIndex: number): void {
    if (typeof window === 'undefined') return;
    try {
      const currentPath = this.getCurrentPath();
      const progress = {
        page: currentPath,
        stepIndex: stepIndex,
      };
      localStorage.setItem(TOUR_PROGRESS_KEY, JSON.stringify(progress));
    } catch (error) {
      console.error('Error saving tour progress:', error);
    }
  }

  /**
   * Get saved tour progress
   */
  private getSavedProgress(): number | null {
    if (typeof window === 'undefined') return null;
    try {
      const saved = localStorage.getItem(TOUR_PROGRESS_KEY);
      if (!saved) return null;
      
      const progress = JSON.parse(saved);
      const currentPath = this.getCurrentPath();
      
      // Only return progress if it's for the current page
      if (progress.page === currentPath) {
        return progress.stepIndex ?? null;
      }
      
      return null;
    } catch (error) {
      // Fallback to old format (just a number)
      try {
        const saved = localStorage.getItem(TOUR_PROGRESS_KEY);
        return saved ? parseInt(saved, 10) : null;
      } catch {
        return null;
      }
    }
  }

  /**
   * Clear tour progress
   */
  private clearProgress(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(TOUR_PROGRESS_KEY);
    } catch (error) {
      console.error('Error clearing tour progress:', error);
    }
  }

  /**
   * Start the tour
   */
  async startTour(onComplete?: () => void, onExit?: () => void, startFromStep?: number): Promise<void> {
    if (typeof window === 'undefined') return;

    try {
      // Load intro.js dynamically
      const introJs = await this.loadIntroJs();

      // Get steps for current page
      const currentPageSteps = this.getStepsForCurrentPage();
      const currentPath = this.getCurrentPath();
      
      console.log('[Tour] Starting tour for page:', currentPath);
      console.log('[Tour] Available steps:', currentPageSteps.length);
      
      // Find the starting step index
      let startIndex = startFromStep ?? 0;
      if (startFromStep === undefined) {
        const savedProgress = this.getSavedProgress();
        if (savedProgress !== null && savedProgress < currentPageSteps.length) {
          startIndex = savedProgress;
        }
      }

      // Convert our step format to intro.js format
      // Filter out steps where elements don't exist
      const introSteps = currentPageSteps
        .map((step: TourStep) => {
          // Check if element exists (if element is specified)
          if (step.element) {
            let elementSelector = step.element;
            
            // Handle responsive navbar element - use mobile menu button on mobile
            if (step.id === 'navbar-explanation') {
              const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024; // lg breakpoint
              if (isMobile) {
                // On mobile, target the mobile menu button instead of sidebar
                elementSelector = '[data-tour="mobile-menu-button"]';
                const mobileButton = document.querySelector(elementSelector);
                if (mobileButton) {
                  console.log(`[Tour] Step "${step.id}": Using mobile menu button`);
                } else {
                  console.warn(`[Tour] Step "${step.id}": Mobile menu button not found`);
                }
              } else {
                // On desktop, use the sidebar navbar
                elementSelector = step.element;
              }
            }
            
            const element = document.querySelector(elementSelector);
            if (!element) {
              console.warn(`[Tour] Step "${step.id}": Element "${elementSelector}" not found, skipping`);
              return null;
            }
            console.log(`[Tour] Step "${step.id}": Element found (${elementSelector})`);
            
            return {
              element: elementSelector,
              intro: `<h3>${step.title}</h3><p>${step.intro}</p>`,
              position: step.position || 'auto',
              tooltipClass: step.tooltipClass || TOUR_OPTIONS.tooltipClass,
              highlightClass: step.highlightClass || TOUR_OPTIONS.highlightClass,
              // Store step metadata for navigation
              _stepId: step.id,
              _allowClick: step.allowClick || false,
            };
          } else {
            console.log(`[Tour] Step "${step.id}": No element (welcome step)`);
            return {
              element: step.element,
              intro: `<h3>${step.title}</h3><p>${step.intro}</p>`,
              position: step.position || 'auto',
              tooltipClass: step.tooltipClass || TOUR_OPTIONS.tooltipClass,
              highlightClass: step.highlightClass || TOUR_OPTIONS.highlightClass,
              // Store step metadata for navigation
              _stepId: step.id,
              _allowClick: step.allowClick || false,
            };
          }
        })
        .filter((step): step is {
          element: string | undefined;
          intro: string;
          position: 'auto' | 'top' | 'left' | 'bottom' | 'right';
          tooltipClass: string;
          highlightClass: string;
          _stepId: string;
          _allowClick: boolean;
        } => step !== null);

      console.log('[Tour] Valid steps after filtering:', introSteps.length);

      if (introSteps.length === 0) {
        console.warn('[Tour] No tour steps available for current page:', currentPath);
        if (onExit) onExit();
        return;
      }

      // Initialize intro.js (use tour() instead of deprecated introJs())
      this.introInstance = introJs.tour();
      
      // Set options
      // Cast steps to any to avoid type mismatch - intro.js accepts 'auto' for position
      // even though the types don't reflect it
      this.introInstance.setOptions({
        ...TOUR_OPTIONS,
        steps: introSteps as any,
        disableInteraction: false, // Allow clicking elements
        // Make sure we can interact with elements
        exitOnOverlayClick: false,
        showButtons: true,
        keyboardNavigation: true,
      });

      // No longer forcing navigation - tours are page-specific

      // Handle step change to save progress and attach navigation listeners
      this.introInstance.onchange((targetElement: HTMLElement) => {
        const currentStep = this.introInstance?.currentStep();
        if (currentStep !== undefined && currentStep < introSteps.length) {
          const stepData = introSteps[currentStep];
          if (!stepData) return;
          
          if (stepData._stepId) {
            // Save progress with page context
            const progress = {
              page: this.getCurrentPath(),
              stepIndex: currentStep,
            };
            if (typeof window !== 'undefined') {
              localStorage.setItem(TOUR_PROGRESS_KEY, JSON.stringify(progress));
            }
          }
          
          // If we're on the keyword search page and showing the create button,
          // watch for the form to appear and exit the tour
          if (stepData._stepId === 'create-search-button') {
            let formCheckInterval: NodeJS.Timeout | null = null;
            let formCheckTimeout: NodeJS.Timeout | null = null;
            
            const exitTourForForm = () => {
              if (formCheckInterval) {
                clearInterval(formCheckInterval);
                formCheckInterval = null;
              }
              if (formCheckTimeout) {
                clearTimeout(formCheckTimeout);
                formCheckTimeout = null;
              }
              
              if (this.introInstance) {
                console.log('[Tour] Form detected, exiting tour');
                // Mark this page's tour as shown since user clicked the button
                const currentPath = this.getCurrentPath();
                if (typeof window !== 'undefined') {
                  const key = `clienthunt_tour_page_${currentPath}`;
                  localStorage.setItem(key, 'shown');
                }
                this.introInstance.exit(false);
                if (onExit) onExit();
              }
            };
            
            const checkForForm = () => {
              const form = document.querySelector('[data-tour="keyword-search-form"]');
              if (form) {
                exitTourForForm();
              }
            };
            
            // Check immediately and then periodically
            checkForForm();
            formCheckInterval = setInterval(checkForForm, 200);
            
            // Stop checking after 5 seconds
            formCheckTimeout = setTimeout(() => {
              if (formCheckInterval) {
                clearInterval(formCheckInterval);
                formCheckInterval = null;
              }
            }, 5000);
            
            // Also attach click listener to the button to exit immediately
            const button = document.querySelector('[data-tour="create-search-button"]');
            if (button) {
              const handleButtonClick = () => {
                console.log('[Tour] Create button clicked, exiting tour');
                // Small delay to let the form render
                setTimeout(exitTourForForm, 100);
              };
              button.addEventListener('click', handleButtonClick, { once: true });
            }
          }
        }
      });

      // Handle tour exit
      this.introInstance.onexit(() => {
        this.introInstance = null;
        // Clear progress when exiting (each page has its own tour)
        this.clearProgress();
        if (onExit) onExit();
      });

      this.introInstance.oncomplete(() => {
        // Check if the last step was a navigation step
        const lastStepIndex = introSteps.length - 1;
        const lastStep = introSteps[lastStepIndex];
        
        // Normal completion - mark this page's tour as complete
        // Don't mark entire tour as complete, as user might visit other pages
        this.clearProgress();
        this.introInstance = null;
        if (onComplete) onComplete();
      });



      // Start the tour from the saved or specified step
      console.log('[Tour] Starting intro.js with', introSteps.length, 'steps, starting at index', startIndex);
      this.introInstance.start();
      console.log('[Tour] Tour started successfully');
      if (startIndex > 0 && startIndex < introSteps.length) {
        // Navigate to the saved step
        for (let i = 0; i < startIndex; i++) {
          this.introInstance?.nextStep();
        }
      }
    } catch (error) {
      console.error('Failed to start tour:', error);
      if (onExit) onExit();
    }
  }

  /**
   * Exit the tour
   */
  exitTour(): void {
    if (this.introInstance) {
      this.introInstance.exit(true);
      this.introInstance = null;
    }
  }

  /**
   * Check if tour is currently running
   */
  isTourActive(): boolean {
    return this.introInstance !== null;
  }
}

// Export singleton instance
export const tourService = new TourService();

// Expose tour service to window in development for easy console access
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).__tourService = tourService;
  console.log(
    '%c🎯 Tour Service Available',
    'color: #3b82f6; font-weight: bold; font-size: 14px;',
    '\nUse these commands in the console:\n',
    '  __tourService.resetTour() - Reset the tour\n',
    '  __tourService.hasCompletedTour() - Check if tour is completed\n',
    '  __tourService.startTour() - Start the tour manually'
  );
}


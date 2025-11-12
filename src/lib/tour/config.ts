/**
 * Tour Configuration
 * 
 * Defines the onboarding tour steps and settings
 */

export interface TourStep {
  id: string;
  element?: string; // CSS selector
  title: string;
  intro: string;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'auto';
  tooltipClass?: string;
  highlightClass?: string;
  page?: string; // Page path where this step should be shown (e.g., '/dashboard/keyword-searches')
  allowClick?: boolean; // Allow clicking the element during tour (for navigation)
}

// Dashboard tour steps (shown when user first lands)
export const DASHBOARD_TOUR_STEPS: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to ClientHunt! 🎉',
    intro: 'Let\'s take a quick tour to help you get started finding freelance opportunities on Reddit.',
    position: 'auto',
  },
  {
    id: 'dashboard-overview',
    element: '[data-tour="dashboard-header"]',
    title: 'Your Dashboard',
    intro: 'This is your dashboard. Here you can see an overview of your keyword searches and opportunities.',
    position: 'bottom',
  },
  {
    id: 'navbar-explanation',
    element: '[data-tour="navbar"]', // Desktop: sidebar, Mobile: will be replaced with mobile-menu-button
    title: 'Navigation',
    intro: 'Use the menu to navigate between pages. On mobile, tap the menu icon to open the sidebar. Click on "Keyword Searches" to create searches, or "Opportunities" to generate leads. Each page has its own tour to guide you!',
    position: 'right',
  },
];

// Keyword Searches page tour steps
export const KEYWORD_SEARCHES_TOUR_STEPS: TourStep[] = [
  {
    id: 'create-search-button',
    element: '[data-tour="create-search-button"]',
    title: 'Create Your First Search',
    intro: 'Click the "Create Search" button to add keywords for the skills or services you want to find. For example: "react developer", "python", "web designer". You can add multiple keywords to one search.',
    position: 'left',
  },
];

// Opportunities page tour steps
export const OPPORTUNITIES_TOUR_STEPS: TourStep[] = [
  {
    id: 'keyword-search-select',
    element: '[data-tour="keyword-search-select"]',
    title: 'Generate Your First Opportunities',
    intro: 'Select a keyword search from the cards above. Each card shows the search name, number of keywords, and status. After selecting a search, click "Generate Opportunities" to start finding leads. The system will search Reddit and analyze posts for you.',
    position: 'top',
  },
];

// Legacy: Keep for backward compatibility
export const TOUR_STEPS: TourStep[] = [
  ...DASHBOARD_TOUR_STEPS,
  ...KEYWORD_SEARCHES_TOUR_STEPS,
  ...OPPORTUNITIES_TOUR_STEPS,
];

export const TOUR_OPTIONS = {
  nextLabel: 'Next →',
  prevLabel: '← Back',
  skipLabel: '×', // Use cross icon instead of text
  doneLabel: 'Got it!',
  showProgress: true,
  showBullets: true,
  exitOnOverlayClick: false,
  exitOnEsc: true,
  tooltipClass: 'customTooltip',
  highlightClass: 'customHighlight',
  scrollToElement: true,
  scrollPadding: 20,
  disableInteraction: false, // Allow clicking elements during tour
  helperElementPadding: 10,
};

export const TOUR_STORAGE_KEY = 'clienthunt_tour_completed';
export const TOUR_STORAGE_VERSION = '1.0';
export const TOUR_PROGRESS_KEY = 'clienthunt_tour_progress'; // Store current step index


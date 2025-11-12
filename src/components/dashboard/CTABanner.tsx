'use client';

import { X, RefreshCw, Search as SearchIcon, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';

interface CTABannerProps {
  hasSearches: boolean;
  hasOpportunities: boolean;
  selectedSearchId: string;
  onGenerate?: () => void;
  onDismiss?: () => void;
}

/**
 * Prominent CTA Banner Component
 * 
 * Shows when user has searches but hasn't generated opportunities yet,
 * or when no opportunities exist.
 */
export function CTABanner({
  hasSearches,
  hasOpportunities,
  selectedSearchId,
  onGenerate,
  onDismiss,
}: CTABannerProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  // Check localStorage for dismissed state
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const dismissed = localStorage.getItem('ctaBannerDismissed');
      setIsDismissed(dismissed === 'true');
    }
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('ctaBannerDismissed', 'true');
    }
    onDismiss?.();
  };

  // Don't show if:
  // - No searches exist (empty state handles this)
  // - Already has opportunities
  // - User dismissed it
  // - Search is selected and opportunities exist
  if (!hasSearches || hasOpportunities || isDismissed) {
    return null;
  }

  // Show banner when:
  // - User has searches but no opportunities
  // - Search is selected but not generated
  const shouldShow = hasSearches && !hasOpportunities;

  if (!shouldShow) {
    return null;
  }

  return (
    <div className="card bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 relative">
      <button
        onClick={handleDismiss}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="Dismiss banner"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="pr-8">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <RefreshCw className="w-6 h-6 text-blue-600" />
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Ready to Find Opportunities?
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {selectedSearchId === 'all'
                ? 'Select a keyword search above and click "Generate Opportunities" to start finding leads on Reddit.'
                : 'Click "Generate Opportunities" to start finding leads from your selected keyword search.'}
            </p>

            <div className="flex flex-wrap gap-2">
              {selectedSearchId === 'all' ? (
                <a
                  href="/dashboard/keyword-searches"
                  className="btn-primary inline-flex items-center text-sm"
                >
                  <SearchIcon className="w-4 h-4 mr-2" />
                  View Keyword Searches
                  <ArrowRight className="w-4 h-4 ml-2" />
                </a>
              ) : (
                <button
                  onClick={onGenerate}
                  className="btn-primary inline-flex items-center text-sm"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Generate Opportunities
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


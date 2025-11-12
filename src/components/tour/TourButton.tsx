'use client';

import { PlayCircle, RotateCcw } from 'lucide-react';
import { useTour } from './TourProvider';
import { useState } from 'react';

interface TourButtonProps {
  variant?: 'default' | 'sidebar' | 'header';
  className?: string;
  showReset?: boolean; // Show reset button in dev mode
}

/**
 * Tour Button Component
 * 
 * Button to manually trigger the onboarding tour
 */
export function TourButton({ variant = 'default', className = '', showReset = false }: TourButtonProps) {
  const { startTour, isTourActive, resetTour, hasCompletedTour } = useTour();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const baseStyles = 'flex items-center space-x-2 transition-colors';
  
  const variantStyles = {
    default: 'px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700',
    sidebar: 'w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors',
    header: 'px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-lg',
  };

  const handleReset = () => {
    if (showResetConfirm) {
      resetTour();
      setShowResetConfirm(false);
      // Auto-start tour after reset
      setTimeout(() => startTour(), 100);
    } else {
      setShowResetConfirm(true);
      setTimeout(() => setShowResetConfirm(false), 3000);
    }
  };

  return (
    <div className="space-y-2">
      <button
        onClick={startTour}
        disabled={isTourActive}
        className={`${baseStyles} ${variantStyles[variant]} ${className} ${
          isTourActive ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        aria-label="Start tour"
      >
        <PlayCircle className="w-4 h-4" />
        <span>{isTourActive ? 'Tour in progress...' : hasCompletedTour ? 'Retake Tour' : 'Take Tour'}</span>
      </button>
      
      {/* Reset button for dev/testing */}
      {showReset && (
        <button
          onClick={handleReset}
          className={`${baseStyles} ${variantStyles.sidebar} text-xs text-orange-600 hover:text-orange-700 hover:bg-orange-50`}
          title="Reset tour (dev only)"
        >
          <RotateCcw className="w-3 h-3" />
          <span>{showResetConfirm ? 'Click again to reset' : 'Reset Tour'}</span>
        </button>
      )}
    </div>
  );
}


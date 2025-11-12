'use client';

import { useState } from 'react';
import { HelpCircle, X } from 'lucide-react';
import { HelpModal } from './HelpModal';

interface HelpButtonProps {
  variant?: 'floating' | 'header';
  className?: string;
}

/**
 * HelpButton Component
 * 
 * Floating or header help button that opens contextual help
 */
export function HelpButton({ variant = 'floating', className = '' }: HelpButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (variant === 'header') {
    return (
      <>
        <button
          onClick={() => setIsOpen(true)}
          className={`inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors ${className}`}
          aria-label="Help"
        >
          <HelpCircle className="w-4 h-4 mr-2" />
          Need help?
        </button>
        <HelpModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </>
    );
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 left-6 sm:left-auto sm:right-6 z-[100] w-14 h-14 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center touch-manipulation ${className}`}
        aria-label="Help"
      >
        <HelpCircle className="w-6 h-6" />
      </button>
      <HelpModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}


'use client';

import { CheckCircle2, ArrowRight, X } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

interface SuccessMessageProps {
  title: string;
  message: string;
  nextStep?: {
    label: string;
    href: string;
    onClick?: () => void;
  };
  onDismiss?: () => void;
  dismissible?: boolean;
  className?: string;
}

/**
 * SuccessMessage Component
 * 
 * Displays success messages with optional next step actions
 */
export function SuccessMessage({
  title,
  message,
  nextStep,
  onDismiss,
  dismissible = true,
  className = '',
}: SuccessMessageProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  return (
    <div
      className={`bg-green-50 border border-green-200 rounded-lg p-4 ${className}`}
      role="alert"
    >
      <div className="flex items-start">
        <CheckCircle2 className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-green-900 mb-1">{title}</h4>
          <p className="text-sm text-green-800 mb-3">{message}</p>
          {nextStep && (
            <Link
              href={nextStep.href}
              onClick={nextStep.onClick}
              className="inline-flex items-center text-sm font-medium text-green-700 hover:text-green-900 transition-colors"
            >
              {nextStep.label}
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          )}
        </div>
        {dismissible && (
          <button
            onClick={handleDismiss}
            className="ml-3 text-green-600 hover:text-green-800 transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}


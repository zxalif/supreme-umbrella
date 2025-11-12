'use client';

import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * Button Component - Centralized Design System
 * 
 * Uses the new Soft Blue palette and design tokens.
 * All button styles are defined here for consistency.
 */

const buttonVariants = cva(
  // Base styles (applied to all buttons)
  "inline-flex items-center justify-center rounded-button font-medium transition-all duration-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // Primary - Main CTA button (Soft Blue)
        primary: "bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 shadow-button hover:shadow-card-hover",
        
        // Secondary - Alternative action (Purple)
        secondary: "bg-secondary-500 text-white hover:bg-secondary-600 active:bg-secondary-700 shadow-button hover:shadow-card-hover",
        
        // Outline - Subtle action
        outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400 active:bg-gray-100",
        
        // Ghost - Minimal action
        ghost: "text-gray-700 hover:bg-gray-100 active:bg-gray-200",
        
        // Success - Positive action (Green)
        success: "bg-accent-500 text-white hover:bg-accent-600 active:bg-accent-700 shadow-button hover:shadow-card-hover",
        
        // Danger - Destructive action (Red)
        danger: "bg-error-500 text-white hover:bg-error-600 active:bg-error-700 shadow-button hover:shadow-card-hover",
      },
      size: {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base",
        xl: "h-14 px-8 text-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };

'use client';

import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * Input Component - Centralized Design System
 * 
 * Uses the new Soft Blue palette and design tokens.
 * All input styles are defined here for consistency.
 */

const inputVariants = cva(
  // Base styles (applied to all inputs)
  "flex w-full rounded-input border bg-white px-3 py-2 text-sm transition-all duration-default placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        // Default - Standard input
        default: "border-gray-300 focus-visible:border-primary-500 focus-visible:ring-primary-500",
        
        // Success - Valid state
        success: "border-success-500 focus-visible:border-success-500 focus-visible:ring-success-500",
        
        // Error - Invalid state
        error: "border-error-500 focus-visible:border-error-500 focus-visible:ring-error-500",
        
        // Ghost - Minimal styling
        ghost: "border-transparent bg-gray-50 focus-visible:bg-white focus-visible:border-primary-500 focus-visible:ring-primary-500",
      },
      size: {
        sm: "h-8 px-2 text-xs",
        md: "h-10 px-3 text-sm",
        lg: "h-12 px-4 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, size, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

// Label component for better form composition
const Label = forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "text-sm font-medium leading-none text-gray-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className
    )}
    {...props}
  />
));
Label.displayName = "Label";

// Helper text component
const HelperText = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & {
    variant?: 'default' | 'error' | 'success';
  }
>(({ className, variant = 'default', ...props }, ref) => {
  const variantStyles = {
    default: 'text-gray-600',
    error: 'text-error-500',
    success: 'text-success-500',
  };

  return (
    <p
      ref={ref}
      className={cn("text-xs mt-1", variantStyles[variant], className)}
      {...props}
    />
  );
});
HelperText.displayName = "HelperText";

export { Input, Label, HelperText, inputVariants };

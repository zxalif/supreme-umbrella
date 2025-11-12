/**
 * Utility Functions
 * 
 * Common utility functions used throughout the application.
 */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS classes with proper precedence.
 * 
 * This function combines clsx and tailwind-merge to handle:
 * - Conditional classes
 * - Class name conflicts (last one wins)
 * - Proper Tailwind class merging
 * 
 * @param inputs - Class names to merge
 * @returns Merged class string
 * 
 * @example
 * ```tsx
 * cn("px-4 py-2", isActive && "bg-primary-500", className)
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format currency value.
 * 
 * @param amount - Amount in cents
 * @param currency - Currency code (default: USD)
 * @returns Formatted currency string
 * 
 * @example
 * ```tsx
 * formatCurrency(1900) // "$19.00"
 * ```
 */
export function formatCurrency(amount: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount / 100);
}

/**
 * Format date to readable string.
 * 
 * @param date - Date to format
 * @param options - Intl.DateTimeFormat options
 * @returns Formatted date string
 * 
 * @example
 * ```tsx
 * formatDate(new Date()) // "Jan 15, 2024"
 * ```
 */
export function formatDate(
  date: Date | string,
  options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  }
): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", options).format(dateObj);
}

/**
 * Truncate text to specified length.
 * 
 * @param text - Text to truncate
 * @param length - Maximum length
 * @param suffix - Suffix to add (default: "...")
 * @returns Truncated text
 * 
 * @example
 * ```tsx
 * truncate("Long text here", 10) // "Long text..."
 * ```
 */
export function truncate(text: string, length: number, suffix: string = "..."): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + suffix;
}

/**
 * Debounce function execution.
 * 
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 * 
 * @example
 * ```tsx
 * const debouncedSearch = debounce(handleSearch, 300);
 * ```
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

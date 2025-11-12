'use client';

import { toast } from 'sonner';

// Re-export toast functions for easy use throughout the app
export const showToast = {
  success: (message: string, description?: string) => {
    toast.success(message, { description });
  },
  error: (message: string, description?: string) => {
    toast.error(message, { description });
  },
  warning: (message: string, description?: string) => {
    toast.warning(message, { description });
  },
  info: (message: string, description?: string) => {
    toast.info(message, { description });
  },
  message: (message: string, description?: string) => {
    toast(message, { description });
  },
  promise: <T,>(
    promise: Promise<T>,
    {
      loading,
      success,
      error,
    }: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    }
  ) => {
    return toast.promise(promise, {
      loading,
      success,
      error,
    });
  },
};

// Legacy hook for backward compatibility
export function useToast() {
  return {
    success: showToast.success,
    error: showToast.error,
    warning: showToast.warning,
    info: showToast.info,
    message: showToast.message,
    promise: showToast.promise,
  };
}

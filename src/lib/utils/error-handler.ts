/**
 * Error Handler Utilities
 * 
 * Helper functions to safely extract error messages from various error formats
 */

/**
 * Safely extract error message from error object
 * Handles various error formats:
 * - String errors
 * - ApiClientError with data.detail
 * - Validation error objects (Zod/Pydantic format)
 * - Standard Error objects
 */
export function extractErrorMessage(error: any, fallback: string = 'An error occurred'): string {
  // Handle null/undefined
  if (!error) {
    return fallback;
  }

  // If it's already a string, return it
  if (typeof error === 'string') {
    return error;
  }

  // Handle ApiClientError format
  if (error?.data?.detail) {
    const detail = error.data.detail;
    
    // If detail is a string, return it
    if (typeof detail === 'string') {
      return detail;
    }
    
    // If detail is an object (validation error), extract message
    if (typeof detail === 'object') {
      // Try common error message properties
      if (detail.message) {
        return String(detail.message);
      }
      if (detail.msg) {
        return String(detail.msg);
      }
      // If it's an array of errors, get the first one
      if (Array.isArray(detail) && detail.length > 0) {
        const firstError = detail[0];
        if (typeof firstError === 'string') {
          return firstError;
        }
        if (firstError?.msg) {
          return String(firstError.msg);
        }
        if (firstError?.message) {
          return String(firstError.message);
        }
      }
      // Last resort: convert to string
      return String(detail);
    }
  }

  // Handle standard Error object
  if (error?.message) {
    return String(error.message);
  }

  // Handle validation errors object (Zod/Pydantic format)
  if (error?.type && error?.msg) {
    return String(error.msg);
  }

  // Fallback: convert to string
  return String(error);
}

/**
 * Extract field-specific errors from validation error response
 * Returns a record of field names to error messages (strings)
 */
export function extractFieldErrors(errors: any): Record<string, string> {
  const fieldErrors: Record<string, string> = {};

  if (!errors || typeof errors !== 'object') {
    return fieldErrors;
  }

  Object.entries(errors).forEach(([field, messages]) => {
    if (Array.isArray(messages)) {
      // Get first message and ensure it's a string
      const firstMessage = messages[0];
      if (typeof firstMessage === 'string') {
        fieldErrors[field] = firstMessage;
      } else if (firstMessage?.msg) {
        fieldErrors[field] = String(firstMessage.msg);
      } else if (firstMessage?.message) {
        fieldErrors[field] = String(firstMessage.message);
      } else {
        fieldErrors[field] = String(firstMessage);
      }
    } else if (typeof messages === 'string') {
      fieldErrors[field] = messages;
    } else if (messages?.msg) {
      fieldErrors[field] = String(messages.msg);
    } else if (messages?.message) {
      fieldErrors[field] = String(messages.message);
    } else {
      fieldErrors[field] = String(messages);
    }
  });

  return fieldErrors;
}


/**
 * Text Sanitization Utilities
 * 
 * Provides functions to safely render user-generated content.
 * Note: React automatically escapes text in JSX, but these utilities
 * provide additional safety and proper formatting.
 */

import React from 'react';

/**
 * Format text with newlines preserved (safe for React rendering).
 * React automatically escapes HTML, so this is safe from XSS.
 * 
 * @param text - Text to format
 * @returns Array of React nodes with newlines converted to <br />
 */
export function formatTextWithNewlines(text: string): React.ReactNode[] {
  if (!text) {
    return [];
  }
  
  const result: React.ReactNode[] = [];
  const lines = text.split('\n');
  
  lines.forEach((line, index) => {
    result.push(line);
    if (index < lines.length - 1) {
      result.push(React.createElement('br', { key: `br-${index}` }));
    }
  });
  
  return result;
}

/**
 * Escape HTML entities in text (defense in depth).
 * React already does this, but this provides explicit protection.
 * 
 * @param text - Text to escape
 * @returns Escaped text
 */
export function escapeHtml(text: string): string {
  if (!text) return '';
  
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  
  return text.replace(/[&<>"']/g, (char) => map[char]);
}


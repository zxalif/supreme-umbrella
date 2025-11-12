'use client';

import { DollarSign } from 'lucide-react';
import type { ExtractedInfo } from '@/types/opportunity';

interface BudgetDisplayProps {
  extractedInfo: ExtractedInfo | null;
  content?: string;
  className?: string;
  variant?: 'card' | 'inline' | 'compact';
}

// Enhanced budget extraction from content
const extractBudgetFromContent = (content: string): string | null => {
  if (!content) return null;
  
  // Common budget patterns
  const patterns = [
    // $1000-2000, $1,000-$2,000, $1k-2k
    /\$[\d,]+(?:k|K)?\s*[-–—]\s*\$?[\d,]+(?:k|K)?/g,
    // Budget: $1000, Budget $1000
    /budget:?\s*\$[\d,]+(?:k|K)?/gi,
    // $1000+, $1000 or more
    /\$[\d,]+(?:k|K)?\+?(?:\s+or\s+more)?/g,
    // 1000-2000 USD/EUR/GBP
    /[\d,]+\s*[-–—]\s*[\d,]+\s*(?:USD|EUR|GBP|usd|eur|gbp)/gi,
    // Budget of $1000
    /budget\s+of\s+\$[\d,]+(?:k|K)?/gi,
  ];

  for (const pattern of patterns) {
    const matches = content.match(pattern);
    if (matches && matches.length > 0) {
      // Return the first match, cleaned up
      let budget = matches[0].trim();
      
      // Convert k/K to proper format
      budget = budget.replace(/(\d)k/gi, '$1,000');
      budget = budget.replace(/(\d)K/gi, '$1,000');
      
      return budget;
    }
  }
  
  return null;
};

const formatBudget = (extractedInfo: ExtractedInfo | null, content?: string): string | null => {
  // Helper to strip dollar signs and format number
  const formatNumber = (value: number | string | null): string | null => {
    if (value === null || value === undefined) return null;
    
    let num: number;
    if (typeof value === 'string') {
      // Strip currency symbols and clean
      const cleaned = value.replace(/[$€£,]/g, '').trim();
      num = parseFloat(cleaned);
      if (isNaN(num)) return null;
    } else {
      num = value;
    }
    
    return num.toLocaleString();
  };
  
  // First try extracted_info
  if (extractedInfo) {
    if (extractedInfo.budget !== null && extractedInfo.budget !== undefined) {
      const formatted = formatNumber(extractedInfo.budget);
      if (formatted) {
        const currency = extractedInfo.budget_currency || '$';
        return `${currency}${formatted}`;
      }
    }
    
    // Check for budget range (ensure both are valid numbers)
    if (extractedInfo.budget_min !== null && extractedInfo.budget_min !== undefined && 
        extractedInfo.budget_max !== null && extractedInfo.budget_max !== undefined) {
      // Ensure both are numbers (not strings with dollar signs)
      const minNum = typeof extractedInfo.budget_min === 'string' 
        ? parseFloat(extractedInfo.budget_min.replace(/[$€£,]/g, '')) 
        : extractedInfo.budget_min;
      const maxNum = typeof extractedInfo.budget_max === 'string'
        ? parseFloat(extractedInfo.budget_max.replace(/[$€£,]/g, ''))
        : extractedInfo.budget_max;
      
      // Validate both numbers are valid and max > min
      if (!isNaN(minNum) && !isNaN(maxNum) && minNum > 0 && maxNum > 0 && maxNum >= minNum) {
        const minFormatted = formatNumber(minNum);
        const maxFormatted = formatNumber(maxNum);
        if (minFormatted && maxFormatted) {
          const currency = extractedInfo.budget_currency || '$';
          return `${currency}${minFormatted} - ${currency}${maxFormatted}`;
        }
      }
    }
    
    // Fallback: Check if budget is a string range (e.g., "$1K–$1.5K" or "$1,000-$1,500")
    if (extractedInfo.budget && typeof extractedInfo.budget === 'string') {
      const budgetStr = extractedInfo.budget;
      // Try to extract range from string like "$1K–$1.5K" or "$1,000-$1,500"
      const rangeMatch = budgetStr.match(/(?:[\$€£]?)([\d,]+(?:\.\d+)?)(?:K|M)?\s*[-–—]\s*(?:[\$€£]?)([\d,]+(?:\.\d+)?)(?:K|M)?/i);
      if (rangeMatch) {
        const minStr = rangeMatch[1].replace(/,/g, '');
        const maxStr = rangeMatch[2].replace(/,/g, '');
        const minNum = parseFloat(minStr);
        const maxNum = parseFloat(maxStr);
        
        // Check if it's K or M
        const hasK = budgetStr.toUpperCase().includes('K');
        const hasM = budgetStr.toUpperCase().includes('M');
        const multiplier = hasM ? 1000000 : (hasK ? 1000 : 1);
        
        if (!isNaN(minNum) && !isNaN(maxNum) && minNum > 0 && maxNum > 0 && maxNum >= minNum) {
          const minFormatted = formatNumber(minNum * multiplier);
          const maxFormatted = formatNumber(maxNum * multiplier);
          if (minFormatted && maxFormatted) {
            const currency = extractedInfo.budget_currency || '$';
            return `${currency}${minFormatted} - ${currency}${maxFormatted}`;
          }
        }
      }
    }
    
    // Check for minimum budget only
    if (extractedInfo.budget_min !== null && extractedInfo.budget_min !== undefined) {
      const formatted = formatNumber(extractedInfo.budget_min);
      if (formatted) {
        const currency = extractedInfo.budget_currency || '$';
        return `${currency}${formatted}+`;
      }
    }
  }
  
  // Fallback: try to extract from content
  if (content) {
    const contentBudget = extractBudgetFromContent(content);
    if (contentBudget) {
      // Strip dollar signs from extracted content budget
      const cleaned = contentBudget.replace(/[$€£]/g, '').trim();
      const currency = extractedInfo?.budget_currency || '$';
      return `${currency}${cleaned}`;
    }
  }
  
  return null;
};

export function BudgetDisplay({ extractedInfo, content, className = '', variant = 'card' }: BudgetDisplayProps) {
  const budget = formatBudget(extractedInfo, content);

  if (variant === 'inline') {
    return budget ? (
      <span className={`text-green-600 font-medium ${className}`}>
        {budget}
      </span>
    ) : null;
  }

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        <DollarSign className="w-4 h-4 text-green-600" />
        <span className="text-sm font-medium text-green-600">
          {budget || 'Not specified'}
        </span>
      </div>
    );
  }

  // Card variant (default)
  return budget ? (
    <div className={`bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-200 hover:border-green-400 transition-all duration-200 hover:shadow-md ${className}`}>
      <div className="flex items-center justify-center mb-2">
        <DollarSign className="w-5 h-5 text-green-600" />
      </div>
      <p className="text-xl font-bold text-green-700 text-center line-clamp-1 mb-1">{budget}</p>
      <p className="text-xs text-gray-600 text-center font-medium">Budget</p>
    </div>
  ) : (
    <div className={`bg-gray-50 rounded-xl p-4 border-2 border-gray-200 ${className}`}>
      <div className="flex items-center justify-center mb-2">
        <DollarSign className="w-5 h-5 text-gray-400" />
      </div>
      <p className="text-sm text-gray-500 text-center">Not specified</p>
      <p className="text-xs text-gray-400 text-center font-medium">Budget</p>
    </div>
  );
}

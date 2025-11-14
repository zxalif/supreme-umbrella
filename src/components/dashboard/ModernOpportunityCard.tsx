'use client';

import { useState, useEffect } from 'react';
import { OpportunityModal } from './OpportunityModal';
import { BudgetDisplay } from './BudgetDisplay';
import { showToast } from '@/components/ui/Toast';
import { Portal } from '@/components/ui/Portal';
import { 
  ExternalLink, 
  Tag, 
  TrendingUp, 
  Clock, 
  DollarSign,
  Calendar,
  MapPin,
  Briefcase,
  User,
  ChevronDown,
  ChevronUp,
  Sparkles,
  CheckCircle,
  Flame,
  Star,
  X,
  Eye,
  Mail,
  FileText,
  StickyNote,
  MoreHorizontal,
  Copy,
  Share2,
  Snowflake,
  ThermometerSun
} from 'lucide-react';
import type { Opportunity, OpportunityStatus, ExtractedInfo } from '@/types/opportunity';

interface ModernOpportunityCardProps {
  opportunity: Opportunity;
  onUpdate: (id: string, status: OpportunityStatus, notes?: string) => void;
  viewMode?: 'card' | 'compact' | 'list';
}

const statusColors: Record<OpportunityStatus, { bg: string; text: string; border: string; gradient: string; icon: typeof Sparkles }> = {
  new: { 
    bg: 'bg-gradient-to-r from-primary-500 to-primary-600', 
    text: 'text-white', 
    border: 'border-primary-300',
    gradient: 'from-primary-500 to-primary-600',
    icon: Clock
  },
  viewed: { 
    bg: 'bg-gradient-to-r from-secondary-500 to-secondary-600', 
    text: 'text-white', 
    border: 'border-secondary-300',
    gradient: 'from-secondary-500 to-secondary-600',
    icon: Eye
  },
  contacted: { 
    bg: 'bg-gradient-to-r from-warning-500 to-warning-600', 
    text: 'text-white', 
    border: 'border-warning-300',
    gradient: 'from-warning-500 to-warning-600',
    icon: Mail
  },
  applied: { 
    bg: 'bg-gradient-to-r from-info-500 to-info-600', 
    text: 'text-white', 
    border: 'border-info-300',
    gradient: 'from-info-500 to-info-600',
    icon: FileText
  },
  rejected: { 
    bg: 'bg-gradient-to-r from-error-500 to-error-600', 
    text: 'text-white', 
    border: 'border-error-300',
    gradient: 'from-error-500 to-error-600',
    icon: X
  },
  won: { 
    bg: 'bg-gradient-to-r from-accent-500 to-accent-600', 
    text: 'text-white', 
    border: 'border-accent-300',
    gradient: 'from-accent-500 to-accent-600',
    icon: CheckCircle
  },
  lost: { 
    bg: 'bg-gradient-to-r from-gray-400 to-gray-600', 
    text: 'text-white', 
    border: 'border-gray-300',
    gradient: 'from-gray-400 to-gray-600',
    icon: X
  },
};

// Get border color and glow based on score
const getScoreVisuals = (score: number) => {
  if (score >= 0.8) return {
    border: 'border-l-red-500',
    glow: 'shadow-lg shadow-red-500/20 hover:shadow-red-500/30',
    temperature: { label: 'HOT', icon: Flame, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' }
  };
  if (score >= 0.6) return {
    border: 'border-l-orange-500',
    glow: 'shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30',
    temperature: { label: 'WARM', icon: ThermometerSun, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' }
  };
  return {
    border: 'border-l-blue-400',
    glow: 'shadow-md hover:shadow-lg',
    temperature: { label: 'COLD', icon: Snowflake, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' }
  };
};

// Get progress percentage based on status
const getProgressPercentage = (status: OpportunityStatus): number => {
  const progressMap: Record<OpportunityStatus, number> = {
    new: 0,
    viewed: 20,
    contacted: 40,
    applied: 60,
    rejected: 100,
    won: 100,
    lost: 100,
  };
  return progressMap[status];
};

const formatBudget = (extractedInfo: ExtractedInfo | null): string | null => {
  if (!extractedInfo) return null;
  
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
  
  // Check for budget field first
  if (extractedInfo.budget !== null && extractedInfo.budget !== undefined) {
    const budget = extractedInfo.budget;
    const formatted = formatNumber(budget);
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
  
  // Debug: Log the extracted_info to see what's available
  if (process.env.NODE_ENV === 'development') {
    console.log('Budget not found in extracted_info:', extractedInfo);
  }
  
  return null;
};

const formatRelevanceScore = (score: number): string => {
  return `${Math.round(score * 100)}%`;
};

const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return date.toLocaleDateString();
};

/**
 * Modern Opportunity Card Component
 * 
 * Enhanced lead card with:
 * - Temperature indicator (Hot/Warm/Cold)
 * - Quick action bar
 * - Progress indicator
 * - Enhanced visual hierarchy
 * - Multiple view modes
 */
export function ModernOpportunityCard({ opportunity, onUpdate, viewMode = 'card' }: ModernOpportunityCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteText, setNoteText] = useState(opportunity.notes || '');
  
  // Sync noteText only when modal opens (not while typing)
  useEffect(() => {
    if (showNoteModal) {
      // Only sync when modal first opens, not on every opportunity.notes change
      setNoteText(opportunity.notes || '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showNoteModal]); // Only depend on showNoteModal, not opportunity.notes

  const handleStatusChange = async (newStatus: OpportunityStatus) => {
    setIsUpdating(true);
    try {
      await onUpdate(opportunity.id, newStatus);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(opportunity.url);
      showToast.success('Link copied to clipboard');
    } catch (error) {
      showToast.error('Failed to copy link');
    }
  };

  const handleSaveNote = async () => {
    try {
      setIsUpdating(true);
      await onUpdate(opportunity.id, opportunity.status, noteText);
      setShowNoteModal(false);
      // Ensure scroll is restored immediately when closing modal
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      showToast.success('Note saved successfully');
    } catch (error) {
      showToast.error('Failed to save note');
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleCloseNoteModal = () => {
    setShowNoteModal(false);
    // Ensure scroll is restored immediately when closing modal
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  };

  // Handle note modal behavior (scroll lock and escape key)
  useEffect(() => {
    if (showNoteModal) {
      // Store original overflow style
      const originalOverflow = document.body.style.overflow || '';
      const originalPaddingRight = document.body.style.paddingRight || '';
      
      // Calculate scrollbar width to prevent layout shift
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      
      // Lock body scroll
      document.body.style.overflow = 'hidden';
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
      
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          handleCloseNoteModal();
        }
      };
      
      document.addEventListener('keydown', handleEscape);
      
      return () => {
        document.removeEventListener('keydown', handleEscape);
        // Always restore scroll - use 'unset' or empty string to ensure it's restored
        document.body.style.overflow = originalOverflow || '';
        document.body.style.paddingRight = originalPaddingRight || '';
      };
    } else {
      // Ensure scroll is restored when modal is closed (defensive cleanup)
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
  }, [showNoteModal]);

  const budget = formatBudget(opportunity.extracted_info);
  const relevancePercent = formatRelevanceScore(opportunity.relevance_score);
  const urgencyPercent = formatRelevanceScore(opportunity.urgency_score);
  const totalScorePercent = formatRelevanceScore(opportunity.total_score);
  const timeAgo = formatTimeAgo(opportunity.created_at);
  
  // Ensure score is a valid number
  const validScore = typeof opportunity.total_score === 'number' && !isNaN(opportunity.total_score) 
    ? opportunity.total_score 
    : 0;
  
  const scoreVisuals = getScoreVisuals(validScore);
  const statusConfig = statusColors[opportunity.status];
  const StatusIcon = statusConfig.icon;
  const TemperatureIcon = scoreVisuals.temperature.icon;
  const progress = getProgressPercentage(opportunity.status);

  // Compact List View
  if (viewMode === 'list') {
    return (
      <div className={`group relative bg-white rounded-lg border-l-4 ${scoreVisuals.border} p-3 sm:p-4 hover:shadow-md transition-all duration-200 w-full`}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          {/* Mobile: Stacked Layout */}
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* Score Badge */}
            <div className="flex-shrink-0">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex flex-col items-center justify-center text-white shadow-md">
                <Star className="w-3 h-3 sm:w-4 sm:h-4 mb-0.5" />
                <span className="text-xs sm:text-sm font-bold">{Math.round(validScore * 100)}</span>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* Title and Temperature */}
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-3 mb-2">
                <h3 className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-2 flex-1">
                  {opportunity.title || 'Untitled Opportunity'}
                </h3>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium ${scoreVisuals.temperature.bg} ${scoreVisuals.temperature.color} border ${scoreVisuals.temperature.border} self-start`}>
                  <TemperatureIcon className="w-3 h-3 mr-1" />
                  <span className="hidden sm:inline">{scoreVisuals.temperature.label}</span>
                  <span className="sm:hidden">{scoreVisuals.temperature.label.charAt(0)}</span>
                </span>
              </div>
              
              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-3 text-[11px] sm:text-xs text-gray-600 mb-2 sm:mb-0">
                <span className="whitespace-nowrap">{opportunity.source}</span>
                <span className="text-gray-400">•</span>
                <span className="whitespace-nowrap">{timeAgo}</span>
                <span className="text-gray-400">•</span>
                <BudgetDisplay 
                  extractedInfo={opportunity.extracted_info} 
                  content={opportunity.content}
                  variant="inline" 
                  className="whitespace-nowrap"
                />
              </div>
            </div>
          </div>

          {/* Status & Actions - Mobile: Full width row, Desktop: Right aligned */}
          <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3 flex-shrink-0 w-full sm:w-auto">
            <span className={`px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold ${statusConfig.bg} ${statusConfig.text} shadow-sm flex items-center gap-1 whitespace-nowrap`}>
              <StatusIcon className="w-3 h-3 flex-shrink-0" />
              <span className="hidden xs:inline sm:inline">{opportunity.status.charAt(0).toUpperCase() + opportunity.status.slice(1)}</span>
              <span className="xs:hidden sm:hidden">{opportunity.status.charAt(0).toUpperCase()}</span>
            </span>
            <a
              href={opportunity.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 sm:p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors flex-shrink-0"
              aria-label="Open in new tab"
            >
              <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Compact Card View
  if (viewMode === 'compact') {
    return (
      <div className={`group relative bg-white rounded-xl border-l-4 ${scoreVisuals.border} p-4 sm:p-5 ${scoreVisuals.glow} transition-all duration-300 hover:scale-[1.01]`}>
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className={`px-2 py-1 rounded-lg text-[10px] sm:text-xs font-bold ${scoreVisuals.temperature.bg} ${scoreVisuals.temperature.color} border ${scoreVisuals.temperature.border} flex items-center gap-1 whitespace-nowrap`}>
              <TemperatureIcon className="w-3 h-3" />
              <span className="hidden sm:inline">{scoreVisuals.temperature.label}</span>
              <span className="sm:hidden">{scoreVisuals.temperature.label.charAt(0)}</span>
            </span>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex flex-col items-center justify-center text-white shadow-md">
              <Star className="w-3 h-3 sm:w-4 sm:h-4 mb-0.5" />
              <span className="text-[10px] sm:text-xs font-bold">{Math.round(validScore * 100)}</span>
            </div>
          </div>
          <a
            href={opportunity.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 sm:p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors flex-shrink-0"
          >
            <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </a>
        </div>

        {/* Title */}
        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 line-clamp-2">
          {opportunity.title || 'Untitled Opportunity'}
        </h3>

        {/* Meta */}
        <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600 mb-3 flex-wrap">
          <span className="whitespace-nowrap">{opportunity.source}</span>
          <span className="text-gray-400">•</span>
          <span className="whitespace-nowrap">{timeAgo}</span>
        </div>

        {/* Keywords */}
        {opportunity.matched_keywords.length > 0 && (
          <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-3">
            {opportunity.matched_keywords.slice(0, 3).map((keyword, idx) => (
              <span
                key={idx}
                className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-md text-[10px] sm:text-xs font-medium shadow-sm"
              >
                {keyword}
              </span>
            ))}
            {opportunity.matched_keywords.length > 3 && (
              <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-gray-100 text-gray-600 rounded-md text-[10px] sm:text-xs">
                +{opportunity.matched_keywords.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Status */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200 gap-2">
          <span className={`px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold ${statusConfig.bg} ${statusConfig.text} shadow-sm flex items-center gap-1 ${opportunity.status === 'new' ? 'animate-pulse' : ''} whitespace-nowrap`}>
            <StatusIcon className="w-3 h-3" />
            <span className="hidden xs:inline">{opportunity.status.charAt(0).toUpperCase() + opportunity.status.slice(1)}</span>
            <span className="xs:hidden">{opportunity.status.charAt(0).toUpperCase()}</span>
          </span>
          <div className="flex-1 min-w-0">
            <BudgetDisplay 
              extractedInfo={opportunity.extracted_info} 
              content={opportunity.content}
              variant="compact" 
            />
          </div>
        </div>
      </div>
    );
  }

  // Full Card View
  return (
    <div className={`group relative bg-white rounded-xl border-l-4 sm:border-l-8 ${scoreVisuals.border} p-4 sm:p-6 ${scoreVisuals.glow} transition-all duration-300 hover:scale-[1.01]`}>
      {/* Temperature & Score Badge */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs sm:text-sm font-bold ${scoreVisuals.temperature.bg} ${scoreVisuals.temperature.color} border ${scoreVisuals.temperature.border} flex items-center gap-1 shadow-sm`}>
            <TemperatureIcon className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">{scoreVisuals.temperature.label}</span>
            <span className="sm:hidden">{scoreVisuals.temperature.label.charAt(0)}</span>
          </span>
        </div>
        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex flex-col items-center justify-center text-white shadow-lg">
          <Star className="w-4 h-4 sm:w-5 sm:h-5 mb-0.5" />
          <span className="text-xs sm:text-sm font-bold">{Math.round(validScore * 100)}</span>
        </div>
      </div>

      {/* Title & Meta */}
      <div className="mb-4">
        <h3 className="text-lg sm:text-2xl font-bold text-gray-900 mb-2 line-clamp-2">
          {opportunity.title || 'Untitled Opportunity'}
        </h3>
        <div className="flex items-center flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <User className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="truncate max-w-[100px] sm:max-w-none">{opportunity.author}</span>
          </span>
          <span className="hidden sm:inline">•</span>
          <span className="flex items-center gap-1">
            <Tag className="w-3 h-3 sm:w-4 sm:h-4" />
            {opportunity.source}
          </span>
          <span className="hidden sm:inline">•</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
            {timeAgo}
          </span>
        </div>
      </div>

      {/* Keywords */}
      {opportunity.matched_keywords.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Tag className="w-4 h-4 text-gray-500" />
            <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Matched Keywords</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {opportunity.matched_keywords.map((keyword, idx) => (
              <span
                key={idx}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-lg text-sm font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer"
                title={`Keyword: ${keyword}`}
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 mb-4">
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border-2 border-blue-200 hover:border-blue-400 transition-all duration-200 hover:shadow-md">
          <div className="flex items-center justify-center mb-1 sm:mb-2">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
          </div>
          <p className="text-lg sm:text-2xl font-bold text-blue-700 text-center mb-0.5 sm:mb-1">{relevancePercent}</p>
          <p className="text-[10px] sm:text-xs text-gray-600 text-center font-medium">Relevance</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border-2 border-purple-200 hover:border-purple-400 transition-all duration-200 hover:shadow-md">
          <div className="flex items-center justify-center mb-1 sm:mb-2">
            <Star className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
          </div>
          <p className="text-lg sm:text-2xl font-bold text-purple-700 text-center mb-0.5 sm:mb-1">{totalScorePercent}</p>
          <p className="text-[10px] sm:text-xs text-gray-600 text-center font-medium">Total Score</p>
        </div>

        <BudgetDisplay 
          extractedInfo={opportunity.extracted_info} 
          content={opportunity.content}
          variant="card" 
        />

        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border-2 border-orange-200 hover:border-orange-400 transition-all duration-200 hover:shadow-md">
          <div className="flex items-center justify-center mb-1 sm:mb-2">
            <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
          </div>
          <p className="text-lg sm:text-2xl font-bold text-orange-700 text-center mb-0.5 sm:mb-1">{urgencyPercent}</p>
          <p className="text-[10px] sm:text-xs text-gray-600 text-center font-medium">Urgency</p>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
          <span className="font-medium">Pipeline Progress</span>
          <span className="font-semibold">{progress}%</span>
        </div>
        <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`absolute top-0 left-0 h-full bg-gradient-to-r ${statusConfig.gradient} transition-all duration-500 rounded-full`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
          <span>New</span>
          <span>Viewed</span>
          <span>Contacted</span>
          <span>Applied</span>
          <span>Won</span>
        </div>
      </div>

      {/* Content Preview */}
      <p className="text-sm text-gray-700 mb-4 line-clamp-2">
        {opportunity.content}
      </p>

      {/* Quick Actions Bar */}
      <div className="mb-4 pb-4 border-b border-gray-200">
        {/* Mobile: Grid layout for better visibility */}
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-row sm:items-center sm:gap-2">
          <button
            onClick={() => setShowModal(true)}
            className="col-span-2 sm:flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-md hover:shadow-lg text-sm min-h-[2.75rem]"
          >
            <FileText className="w-4 h-4 flex-shrink-0" />
            <span>View Details</span>
          </button>
          <a
            href={opportunity.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-medium hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-md hover:shadow-lg text-sm min-h-[2.75rem]"
            title="Open in new tab"
          >
            <ExternalLink className="w-4 h-4 flex-shrink-0" />
            <span className="hidden sm:inline">Open</span>
            <span className="sm:hidden">View</span>
          </a>
          <button
            onClick={handleCopyLink}
            className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-400 transition-colors text-sm min-h-[2.75rem] shadow-sm"
            title="Copy link"
          >
            <Copy className="w-4 h-4 flex-shrink-0" />
            <span className="hidden sm:inline">Copy</span>
            <span className="sm:hidden">Copy</span>
          </button>
          {/* Note button */}
          <button
            onClick={() => setShowNoteModal(true)}
            className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-400 transition-colors text-sm min-h-[2.75rem] shadow-sm relative"
            title="Add note"
          >
            <StickyNote className="w-4 h-4 flex-shrink-0" />
            <span className="hidden sm:inline">Note</span>
            <span className="sm:hidden">Note</span>
            {opportunity.notes && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full"></span>
            )}
          </button>
        </div>
      </div>

      {/* Status and Change */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <span className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold ${statusConfig.bg} ${statusConfig.text} shadow-md flex items-center justify-center gap-2 ${opportunity.status === 'new' ? 'animate-pulse' : ''}`}>
          <StatusIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
          {opportunity.status.charAt(0).toUpperCase() + opportunity.status.slice(1)}
        </span>
        <select
          value={opportunity.status}
          onChange={(e) => handleStatusChange(e.target.value as OpportunityStatus)}
          disabled={isUpdating}
          className="text-sm border-2 border-gray-300 rounded-lg px-3 sm:px-4 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 hover:border-gray-400 transition-colors w-full sm:w-auto"
        >
          <option value="new">New</option>
          <option value="viewed">Viewed</option>
          <option value="contacted">Contacted</option>
          <option value="applied">Applied</option>
          <option value="rejected">Rejected</option>
          <option value="won">Won</option>
          <option value="lost">Lost</option>
        </select>
      </div>

      {/* Expandable Details */}
      {opportunity.extracted_info && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            {isExpanded ? 'Hide' : 'Show'} Additional Information
          </button>
          
          {isExpanded && (
            <div className="mt-3 bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg p-4 border border-gray-200 space-y-3">
              {opportunity.extracted_info.timeline && (
                <div className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-xs font-semibold text-gray-700">Timeline: </span>
                    <span className="text-sm text-gray-600">{opportunity.extracted_info.timeline}</span>
                  </div>
                </div>
              )}
              {opportunity.extracted_info.location && (
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-xs font-semibold text-gray-700">Location: </span>
                    <span className="text-sm text-gray-600">{opportunity.extracted_info.location}</span>
                    {opportunity.extracted_info.remote && (
                      <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">Remote</span>
                    )}
                  </div>
                </div>
              )}
              {opportunity.extracted_info.skills && opportunity.extracted_info.skills.length > 0 && (
                <div className="flex items-start gap-2">
                  <Briefcase className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-xs font-semibold text-gray-700">Skills: </span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {opportunity.extracted_info.skills.map((skill, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      
      {/* Modal */}
      <OpportunityModal
        opportunity={opportunity}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onUpdate={onUpdate}
      />

      {/* Note Modal */}
      {showNoteModal && (
        <Portal>
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
            style={{ 
              zIndex: 9999,
              pointerEvents: 'auto',
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              overflow: 'hidden'
            }}
            onClick={(e) => {
              // Close modal when clicking on backdrop (not on modal content)
              // Check if the click target is the backdrop itself
              if (e.target === e.currentTarget) {
                handleCloseNoteModal();
              }
            }}
            onMouseDown={(e) => {
              // Also handle mousedown on backdrop to ensure clicks work
              if (e.target === e.currentTarget) {
                // Allow the click to proceed normally
              }
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="note-modal-title"
          >
            <div 
              className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl transform transition-all duration-200 scale-100 relative z-10 max-h-[90vh] overflow-y-auto"
              onClick={(e) => {
                // Prevent clicks inside modal from closing it
                e.stopPropagation();
              }}
              onKeyDown={(e) => {
                // Prevent Escape key from bubbling to backdrop
                if (e.key === 'Escape') {
                  e.stopPropagation();
                  handleCloseNoteModal();
                }
              }}
              onWheel={(e) => {
                // Prevent wheel events from reaching backdrop
                e.stopPropagation();
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 id="note-modal-title" className="text-lg font-semibold text-gray-900">
                  {opportunity.notes ? 'Edit Note' : 'Add Note'}
                </h3>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCloseNoteModal();
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
                  aria-label="Close modal"
                  type="button"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Note for "{opportunity.title || 'Untitled Opportunity'}"
                </label>
                <textarea
                  value={noteText}
                  onChange={(e) => {
                    e.stopPropagation();
                    setNoteText(e.target.value);
                  }}
                  onClick={(e) => {
                    // Ensure textarea is clickable and gets focus
                    e.stopPropagation();
                  }}
                  onMouseDown={(e) => {
                    // Prevent backdrop from receiving mousedown
                    e.stopPropagation();
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={4}
                  placeholder="Add your notes about this opportunity..."
                  autoFocus
                />
              </div>
              
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCloseNoteModal();
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  disabled={isUpdating}
                  type="button"
                >
                  Cancel
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSaveNote();
                  }}
                  disabled={isUpdating}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  type="button"
                >
                  {isUpdating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    'Save Note'
                  )}
                </button>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';
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
  X
} from 'lucide-react';
import type { Opportunity, OpportunityStatus, ExtractedInfo } from '@/types/opportunity';

interface OpportunityCardProps {
  opportunity: Opportunity;
  onUpdate: (id: string, status: OpportunityStatus, notes?: string) => void;
  viewMode?: 'card' | 'compact';
}

const statusColors: Record<OpportunityStatus, { bg: string; text: string; border: string; gradient: string; icon: typeof Sparkles }> = {
  new: { 
    bg: 'bg-gradient-to-r from-blue-500 to-cyan-500', 
    text: 'text-white', 
    border: 'border-blue-400',
    gradient: 'from-blue-500 to-cyan-500',
    icon: Sparkles
  },
  viewed: { 
    bg: 'bg-gradient-to-r from-gray-400 to-gray-500', 
    text: 'text-white', 
    border: 'border-gray-300',
    gradient: 'from-gray-400 to-gray-500',
    icon: Clock
  },
  contacted: { 
    bg: 'bg-gradient-to-r from-yellow-400 to-orange-500', 
    text: 'text-white', 
    border: 'border-yellow-300',
    gradient: 'from-yellow-400 to-orange-500',
    icon: User
  },
  applied: { 
    bg: 'bg-gradient-to-r from-purple-500 to-pink-500', 
    text: 'text-white', 
    border: 'border-purple-300',
    gradient: 'from-purple-500 to-pink-500',
    icon: Briefcase
  },
  rejected: { 
    bg: 'bg-gradient-to-r from-red-400 to-red-600', 
    text: 'text-white', 
    border: 'border-red-300',
    gradient: 'from-red-400 to-red-600',
    icon: X
  },
  won: { 
    bg: 'bg-gradient-to-r from-green-500 to-emerald-500', 
    text: 'text-white', 
    border: 'border-green-300',
    gradient: 'from-green-500 to-emerald-500',
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

// Get border color based on score
const getScoreBorderColor = (score: number): string => {
  if (score >= 0.8) return 'border-l-green-500'; // High score - green
  if (score >= 0.6) return 'border-l-blue-500'; // Medium score - blue
  if (score >= 0.4) return 'border-l-yellow-500'; // Low-medium - yellow
  return 'border-l-orange-500'; // Low score - orange
};

// Get glow effect based on score
const getScoreGlow = (score: number): string => {
  if (score >= 0.8) return 'shadow-lg shadow-green-500/20'; // High score - green glow
  if (score >= 0.6) return 'shadow-lg shadow-blue-500/20'; // Medium score - blue glow
  return 'shadow-md'; // Lower scores - subtle shadow
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
  
  if (extractedInfo.budget !== null && extractedInfo.budget !== undefined) {
    const formatted = formatNumber(extractedInfo.budget);
    if (formatted) {
      const currency = extractedInfo.budget_currency || '$';
      return `${currency}${formatted}`;
    }
  }
  
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
  
  if (extractedInfo.budget_min !== null && extractedInfo.budget_min !== undefined) {
    const formatted = formatNumber(extractedInfo.budget_min);
    if (formatted) {
      const currency = extractedInfo.budget_currency || '$';
      return `${currency}${formatted}+`;
    }
  }
  
  return null;
};

const formatRelevanceScore = (score: number): string => {
  return `${Math.round(score * 100)}%`;
};

/**
 * Professional Opportunity Card Component
 * 
 * Displays an opportunity with:
 * - Keywords prominently displayed
 * - Relevance score
 * - Budget information
 * - Additional extracted information
 * - Professional layout
 */
export function OpportunityCard({ opportunity, onUpdate, viewMode = 'card' }: OpportunityCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleStatusChange = async (newStatus: OpportunityStatus) => {
    setIsUpdating(true);
    try {
      await onUpdate(opportunity.id, newStatus);
    } finally {
      setIsUpdating(false);
    }
  };

  const budget = formatBudget(opportunity.extracted_info);
  const relevancePercent = formatRelevanceScore(opportunity.relevance_score);
  const urgencyPercent = formatRelevanceScore(opportunity.urgency_score);
  const totalScorePercent = formatRelevanceScore(opportunity.total_score);

  if (viewMode === 'compact') {
    return (
      <div className="card-hover border-l-4 border-l-blue-500">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-base font-semibold text-gray-900 line-clamp-1 flex-1">
                {opportunity.title || 'Untitled Opportunity'}
              </h3>
              <a
                href={opportunity.url}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 p-1.5 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors flex-shrink-0"
                title="Open in new tab"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
            
            <div className="flex items-center flex-wrap gap-3 text-sm text-gray-600 mb-2">
              <span className="flex items-center">
                <Tag className="w-3.5 h-3.5 mr-1" />
                {opportunity.source}
              </span>
              <span className="flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1" />
                {new Date(opportunity.created_at).toLocaleDateString()}
              </span>
              {budget && (
                <span className="flex items-center text-green-700 font-medium">
                  <DollarSign className="w-3.5 h-3.5 mr-1" />
                  {budget}
                </span>
              )}
              <span className="flex items-center font-medium">
                <TrendingUp className="w-3.5 h-3.5 mr-1" />
                {relevancePercent} relevant
              </span>
            </div>

            {opportunity.matched_keywords.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {opportunity.matched_keywords.slice(0, 5).map((keyword, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-medium"
                  >
                    {keyword}
                  </span>
                ))}
                {opportunity.matched_keywords.length > 5 && (
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                    +{opportunity.matched_keywords.length - 5}
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="ml-4 flex items-center space-x-2">
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[opportunity.status]}`}>
              {opportunity.status.charAt(0).toUpperCase() + opportunity.status.slice(1)}
            </span>
            <select
              value={opportunity.status}
              onChange={(e) => handleStatusChange(e.target.value as OpportunityStatus)}
              disabled={isUpdating}
              className="text-xs border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
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
        </div>
      </div>
    );
  }

  const scoreBorderColor = getScoreBorderColor(opportunity.total_score);
  const scoreGlow = getScoreGlow(opportunity.total_score);
  const statusConfig = statusColors[opportunity.status];
  const StatusIcon = statusConfig.icon;

  return (
    <div className={`card-hover border-l-8 ${scoreBorderColor} ${scoreGlow} transition-all duration-300 hover:scale-[1.02] hover:shadow-xl`}>
      {/* Header Section */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-2xl font-bold text-gray-900 mb-2 line-clamp-2">
                {opportunity.title || 'Untitled Opportunity'}
              </h3>
              <div className="flex items-center flex-wrap gap-3 text-sm text-gray-600">
                <span className="flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  {opportunity.author}
                </span>
                <span className="flex items-center">
                  <Tag className="w-4 h-4 mr-1" />
                  {opportunity.source}
                </span>
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {new Date(opportunity.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
            <a
              href={opportunity.url}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-3 p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors flex-shrink-0"
              title="Open in new tab"
            >
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>

          {/* Keywords - Prominently Displayed */}
          {opportunity.matched_keywords.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <Tag className="w-4 h-4 text-gray-500 mr-1.5" />
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

          {/* Key Metrics Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {/* Relevance Score */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border-2 border-blue-200 hover:border-blue-400 transition-all duration-200 hover:shadow-md">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-blue-700 text-center mb-1">{relevancePercent}</p>
              <p className="text-xs text-gray-600 text-center font-medium">Relevance</p>
            </div>

            {/* Total Score */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border-2 border-purple-200 hover:border-purple-400 transition-all duration-200 hover:shadow-md">
              <div className="flex items-center justify-center mb-2">
                <Star className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-purple-700 text-center mb-1">{totalScorePercent}</p>
              <p className="text-xs text-gray-600 text-center font-medium">Total Score</p>
            </div>

            {/* Budget */}
            {budget ? (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-200 hover:border-green-400 transition-all duration-200 hover:shadow-md">
                <div className="flex items-center justify-center mb-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-xl font-bold text-green-700 text-center line-clamp-1 mb-1">{budget}</p>
                <p className="text-xs text-gray-600 text-center font-medium">Budget</p>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
                <div className="flex items-center justify-center mb-2">
                  <DollarSign className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500 text-center">Not specified</p>
              </div>
            )}

            {/* Urgency Score */}
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4 border-2 border-orange-200 hover:border-orange-400 transition-all duration-200 hover:shadow-md">
              <div className="flex items-center justify-center mb-2">
                <Flame className="w-5 h-5 text-orange-600" />
              </div>
              <p className="text-2xl font-bold text-orange-700 text-center mb-1">{urgencyPercent}</p>
              <p className="text-xs text-gray-600 text-center font-medium">Urgency</p>
            </div>
          </div>

          {/* Content Preview */}
          <p className="text-sm text-gray-700 mb-4 line-clamp-3">
            {opportunity.content}
          </p>

          {/* Additional Information */}
          {opportunity.extracted_info && (
            <div className="mb-4">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium mb-2"
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="w-4 h-4 mr-1" />
                    Hide Additional Information
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4 mr-1" />
                    Show Additional Information
                  </>
                )}
              </button>
              
              {isExpanded && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 space-y-2">
                  {opportunity.extracted_info.timeline && (
                    <div className="flex items-start">
                      <Calendar className="w-4 h-4 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="text-xs font-semibold text-gray-700">Timeline: </span>
                        <span className="text-sm text-gray-600">{opportunity.extracted_info.timeline}</span>
                      </div>
                    </div>
                  )}
                  {opportunity.extracted_info.deadline && (
                    <div className="flex items-start">
                      <Clock className="w-4 h-4 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="text-xs font-semibold text-gray-700">Deadline: </span>
                        <span className="text-sm text-gray-600">{opportunity.extracted_info.deadline}</span>
                      </div>
                    </div>
                  )}
                  {opportunity.extracted_info.location && (
                    <div className="flex items-start">
                      <MapPin className="w-4 h-4 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="text-xs font-semibold text-gray-700">Location: </span>
                        <span className="text-sm text-gray-600">{opportunity.extracted_info.location}</span>
                        {opportunity.extracted_info.remote && (
                          <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">Remote</span>
                        )}
                      </div>
                    </div>
                  )}
                  {opportunity.extracted_info.skills && opportunity.extracted_info.skills.length > 0 && (
                    <div className="flex items-start">
                      <Briefcase className="w-4 h-4 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="text-xs font-semibold text-gray-700">Skills: </span>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {opportunity.extracted_info.skills.map((skill, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded text-xs">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  {opportunity.extracted_info.requirements && opportunity.extracted_info.requirements.length > 0 && (
                    <div className="flex items-start">
                      <Tag className="w-4 h-4 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="text-xs font-semibold text-gray-700">Requirements: </span>
                        <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                          {opportunity.extracted_info.requirements.map((req, idx) => (
                            <li key={idx}>{req}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                  {opportunity.opportunity_type && (
                    <div className="flex items-center">
                      <span className="text-xs font-semibold text-gray-700 mr-2">Type: </span>
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                        {opportunity.opportunity_type}
                      </span>
                      {opportunity.opportunity_subtype && (
                        <span className="ml-2 px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs">
                          {opportunity.opportunity_subtype}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Status and Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <span className={`px-4 py-2 rounded-full text-sm font-semibold ${statusConfig.bg} ${statusConfig.text} shadow-md flex items-center space-x-1.5 ${opportunity.status === 'new' ? 'animate-pulse' : ''}`}>
            <StatusIcon className="w-4 h-4" />
            <span>{opportunity.status.charAt(0).toUpperCase() + opportunity.status.slice(1)}</span>
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={opportunity.status}
            onChange={(e) => handleStatusChange(e.target.value as OpportunityStatus)}
            disabled={isUpdating}
            className="text-sm border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
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
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { Bookmark, BookmarkCheck, X, Lightbulb } from 'lucide-react';
import type { Opportunity } from '@/types/opportunity';
import type { KeywordSearch } from '@/types/keyword-search';

export interface Insight {
  id: string;
  type: 'success' | 'warning' | 'info' | 'tip';
  title: string;
  description: string;
  timestamp: Date;
  data?: {
    opportunities?: Opportunity[];
    keywordSearches?: KeywordSearch[];
  };
}

interface SavedInsightsProps {
  insights: Insight[];
  onRemove?: (id: string) => void;
  className?: string;
}

/**
 * Saved Insights Component
 * 
 * Displays bookmarked insights that users want to remember
 */
export function SavedInsights({ 
  insights, 
  onRemove,
  className = '' 
}: SavedInsightsProps) {
  if (insights.length === 0) {
    return null;
  }

  const iconColors = {
    success: 'text-green-600 bg-green-50',
    warning: 'text-yellow-600 bg-yellow-50',
    info: 'text-blue-600 bg-blue-50',
    tip: 'text-purple-600 bg-purple-50',
  };

  return (
    <div className={`card ${className}`}>
      <div className="flex items-center space-x-2 mb-4">
        <BookmarkCheck className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Saved Insights</h3>
        <span className="ml-auto text-sm text-gray-500">{insights.length} saved</span>
      </div>

      <div className="space-y-3">
        {insights.map((insight) => {
          const Icon = Lightbulb;
          return (
            <div
              key={insight.id}
              className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${iconColors[insight.type]}`}>
                <Icon className="w-5 h-5" />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 mb-1">
                  {insight.title}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  {insight.description}
                </p>
                <p className="text-xs text-gray-400">
                  Saved {insight.timestamp.toLocaleDateString()}
                </p>
              </div>

              {onRemove && (
                <button
                  onClick={() => onRemove(insight.id)}
                  className="text-gray-400 hover:text-red-600 transition-colors"
                  title="Remove insight"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Hook for managing saved insights in localStorage
 */
export function useSavedInsights() {
  const [savedInsights, setSavedInsights] = useState<Insight[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('savedInsights');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Convert timestamp strings back to Date objects
        const insights = parsed.map((insight: any) => ({
          ...insight,
          timestamp: new Date(insight.timestamp),
        }));
        setSavedInsights(insights);
      } catch (e) {
        console.error('Failed to load saved insights:', e);
      }
    }
  }, []);

  // Save to localStorage whenever insights change
  useEffect(() => {
    if (savedInsights.length > 0) {
      localStorage.setItem('savedInsights', JSON.stringify(savedInsights));
    } else {
      localStorage.removeItem('savedInsights');
    }
  }, [savedInsights]);

  const saveInsight = (insight: Insight) => {
    setSavedInsights(prev => {
      // Check if already saved
      if (prev.some(i => i.id === insight.id)) {
        return prev;
      }
      return [...prev, insight];
    });
  };

  const removeInsight = (id: string) => {
    setSavedInsights(prev => prev.filter(i => i.id !== id));
  };

  const clearAll = () => {
    setSavedInsights([]);
  };

  return {
    savedInsights,
    saveInsight,
    removeInsight,
    clearAll,
  };
}

/**
 * Bookmark button component
 */
interface BookmarkButtonProps {
  insight: Insight;
  isSaved: boolean;
  onToggle: (insight: Insight) => void;
}

export function BookmarkButton({ insight, isSaved, onToggle }: BookmarkButtonProps) {
  return (
    <button
      onClick={() => onToggle(insight)}
      className={`p-2 rounded-lg transition-colors ${
        isSaved
          ? 'text-blue-600 bg-blue-50 hover:bg-blue-100'
          : 'text-gray-400 hover:text-blue-600 hover:bg-gray-50'
      }`}
      title={isSaved ? 'Remove bookmark' : 'Save insight'}
    >
      {isSaved ? (
        <BookmarkCheck className="w-4 h-4" />
      ) : (
        <Bookmark className="w-4 h-4" />
      )}
    </button>
  );
}


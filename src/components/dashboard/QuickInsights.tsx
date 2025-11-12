'use client';

import { useMemo } from 'react';
import { 
  Lightbulb, 
  TrendingUp, 
  Target, 
  AlertCircle,
  CheckCircle,
  Zap
} from 'lucide-react';
import { BookmarkButton, useSavedInsights, type Insight as SavedInsight } from './SavedInsights';
import type { Opportunity } from '@/types/opportunity';
import type { KeywordSearch } from '@/types/keyword-search';

interface QuickInsightsProps {
  opportunities: Opportunity[];
  keywordSearches: KeywordSearch[];
}

interface Insight {
  id: string;
  type: 'success' | 'warning' | 'info' | 'tip';
  icon: typeof Lightbulb;
  title: string;
  description: string;
  action?: {
    label: string;
    href: string;
  };
}

/**
 * Quick Insights Component
 * 
 * Displays AI-generated insights and recommendations with bookmarking
 */
export function QuickInsights({ 
  opportunities, 
  keywordSearches 
}: QuickInsightsProps) {
  const { savedInsights, saveInsight, removeInsight } = useSavedInsights();
  
  const insights = useMemo(() => {
    const items: Insight[] = [];

    // Calculate metrics
    const totalOpps = opportunities.length;
    const newOpps = opportunities.filter(o => o.status === 'new').length;
    const wonOpps = opportunities.filter(o => o.status === 'won').length;
    const activeSearches = keywordSearches.filter(s => s.enabled).length;
    const pausedSearches = keywordSearches.filter(s => !s.enabled).length;

    // Insight: New opportunities
    if (newOpps > 0) {
      items.push({
        id: 'new-opps',
        type: 'info',
        icon: Zap,
        title: `${newOpps} new ${newOpps === 1 ? 'opportunity' : 'opportunities'} waiting`,
        description: 'Review and take action on your latest opportunities to increase your response rate.',
        action: {
          label: 'Review now',
          href: '/dashboard/opportunities?status=new',
        },
      });
    }

    // Insight: No active searches
    if (activeSearches === 0 && keywordSearches.length > 0) {
      items.push({
        id: 'no-active-searches',
        type: 'warning',
        icon: AlertCircle,
        title: 'All keyword searches are paused',
        description: 'Enable at least one keyword search to start finding new opportunities automatically.',
        action: {
          label: 'Enable searches',
          href: '/dashboard/keyword-searches',
        },
      });
    }

    // Insight: No searches at all
    if (keywordSearches.length === 0) {
      items.push({
        id: 'no-searches',
        type: 'warning',
        icon: AlertCircle,
        title: 'Get started with keyword searches',
        description: 'Create your first keyword search to automatically discover relevant opportunities.',
        action: {
          label: 'Create search',
          href: '/dashboard/keyword-searches?new=true',
        },
      });
    }

    // Insight: Good performance
    if (wonOpps > 0) {
      const winRate = totalOpps > 0 ? ((wonOpps / totalOpps) * 100).toFixed(0) : 0;
      items.push({
        id: 'good-performance',
        type: 'success',
        icon: CheckCircle,
        title: `${winRate}% win rate - Great job!`,
        description: `You've won ${wonOpps} ${wonOpps === 1 ? 'opportunity' : 'opportunities'}. Keep up the excellent work!`,
      });
    }

    // Insight: Paused searches
    if (pausedSearches > 0 && activeSearches > 0) {
      items.push({
        id: 'paused-searches',
        type: 'tip',
        icon: Lightbulb,
        title: `${pausedSearches} ${pausedSearches === 1 ? 'search is' : 'searches are'} paused`,
        description: 'Consider enabling paused searches to discover more opportunities.',
        action: {
          label: 'Manage searches',
          href: '/dashboard/keyword-searches',
        },
      });
    }

    // Insight: High activity
    const recentOpps = opportunities.filter(o => {
      const dayAgo = new Date();
      dayAgo.setDate(dayAgo.getDate() - 1);
      return new Date(o.created_at) >= dayAgo;
    }).length;

    if (recentOpps > 5) {
      items.push({
        id: 'high-activity',
        type: 'info',
        icon: TrendingUp,
        title: 'High activity detected',
        description: `${recentOpps} opportunities found in the last 24 hours. Your searches are performing well!`,
      });
    }

    // Insight: Response rate tip
    const respondedOpps = opportunities.filter(o => 
      o.status !== 'new' && o.status !== 'viewed'
    ).length;
    const responseRate = totalOpps > 0 ? (respondedOpps / totalOpps) * 100 : 0;

    if (responseRate < 20 && totalOpps > 10) {
      items.push({
        id: 'low-response',
        type: 'tip',
        icon: Target,
        title: 'Improve your response rate',
        description: 'Responding to opportunities quickly increases your chances of success. Try to review new opportunities daily.',
        action: {
          label: 'View opportunities',
          href: '/dashboard/opportunities',
        },
      });
    }

    // Return top 3 insights (keep original format for display)
    return items.slice(0, 3);
  }, [opportunities, keywordSearches]);

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
    <div className="card bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-100">
      <div className="flex items-center space-x-2 mb-4">
        <Lightbulb className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Quick Insights</h3>
      </div>

      <div className="space-y-3">
        {insights.map((insight) => {
          const Icon = insight.icon;
          const isSaved = savedInsights.some(s => s.id === insight.id);
          
          return (
            <div
              key={insight.id}
              className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-gray-200"
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${iconColors[insight.type]}`}>
                <Icon className="w-5 h-5" />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 mb-1">
                  {insight.title}
                </p>
                <p className="text-sm text-gray-600">
                  {insight.description}
                </p>
                {insight.action && (
                  <a
                    href={insight.action.href}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium mt-2 inline-block"
                  >
                    {insight.action.label} →
                  </a>
                )}
              </div>
              
              <BookmarkButton
                insight={{
                  id: insight.id,
                  type: insight.type,
                  title: insight.title,
                  description: insight.description,
                  timestamp: new Date(),
                  data: {
                    opportunities,
                    keywordSearches,
                  },
                }}
                isSaved={isSaved}
                onToggle={(savedInsight) => {
                  if (isSaved) {
                    removeInsight(savedInsight.id);
                  } else {
                    saveInsight(savedInsight);
                  }
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

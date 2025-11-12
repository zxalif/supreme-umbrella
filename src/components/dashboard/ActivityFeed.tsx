'use client';

import { useMemo } from 'react';
import { 
  Briefcase, 
  Search, 
  CheckCircle, 
  XCircle, 
  Eye,
  Mail,
  FileText,
  Clock,
  TrendingUp
} from 'lucide-react';
import Link from 'next/link';
import type { Opportunity } from '@/types/opportunity';
import type { KeywordSearch } from '@/types/keyword-search';

interface ActivityFeedProps {
  opportunities: Opportunity[];
  keywordSearches: KeywordSearch[];
  maxItems?: number;
}

interface ActivityItem {
  id: string;
  type: 'opportunity_new' | 'opportunity_updated' | 'search_created' | 'search_enabled' | 'search_disabled';
  title: string;
  description: string;
  timestamp: Date;
  icon: typeof Briefcase;
  iconColor: string;
  link?: string;
}

/**
 * Activity Feed Component
 * 
 * Shows recent activity and updates across the dashboard
 */
export function ActivityFeed({ 
  opportunities, 
  keywordSearches,
  maxItems = 10 
}: ActivityFeedProps) {
  
  const activities = useMemo(() => {
    const items: ActivityItem[] = [];

    // Add opportunity activities
    opportunities.forEach(opp => {
      // New opportunity
      const oppTitle = opp.title || 'Untitled opportunity';
      items.push({
        id: `opp-new-${opp.id}`,
        type: 'opportunity_new',
        title: 'New opportunity found',
        description: oppTitle.substring(0, 60) + (oppTitle.length > 60 ? '...' : ''),
        timestamp: new Date(opp.created_at),
        icon: Briefcase,
        iconColor: 'text-blue-600 bg-blue-50',
        link: `/dashboard/opportunities?id=${opp.id}`,
      });

      // Status updates
      if (opp.status !== 'new' && opp.updated_at !== opp.created_at) {
        const statusIcons = {
          viewed: Eye,
          contacted: Mail,
          applied: FileText,
          rejected: XCircle,
          won: CheckCircle,
          lost: XCircle,
        };

        const statusColors = {
          viewed: 'text-purple-600 bg-purple-50',
          contacted: 'text-yellow-600 bg-yellow-50',
          applied: 'text-blue-600 bg-blue-50',
          rejected: 'text-red-600 bg-red-50',
          won: 'text-green-600 bg-green-50',
          lost: 'text-gray-600 bg-gray-50',
        };

        const updateTitle = opp.title || 'Untitled opportunity';
        items.push({
          id: `opp-update-${opp.id}`,
          type: 'opportunity_updated',
          title: `Opportunity marked as ${opp.status}`,
          description: updateTitle.substring(0, 60) + (updateTitle.length > 60 ? '...' : ''),
          timestamp: new Date(opp.updated_at),
          icon: statusIcons[opp.status as keyof typeof statusIcons] || Briefcase,
          iconColor: statusColors[opp.status as keyof typeof statusColors] || 'text-gray-600 bg-gray-50',
          link: `/dashboard/opportunities?id=${opp.id}`,
        });
      }
    });

    // Add keyword search activities
    keywordSearches.forEach(search => {
      items.push({
        id: `search-${search.id}`,
        type: search.enabled ? 'search_enabled' : 'search_disabled',
        title: search.enabled ? 'Keyword search active' : 'Keyword search paused',
        description: `${search.name} - ${search.keywords.length} keywords`,
        timestamp: new Date(search.updated_at || search.created_at),
        icon: Search,
        iconColor: search.enabled ? 'text-green-600 bg-green-50' : 'text-gray-600 bg-gray-50',
        link: `/dashboard/keyword-searches`,
      });
    });

    // Sort by timestamp (most recent first)
    return items
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, maxItems);
  }, [opportunities, keywordSearches, maxItems]);

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (activities.length === 0) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No recent activity</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card max-h-[600px] lg:max-h-none overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">Recent Activity</h3>
        <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
      </div>

      <div className="space-y-2 sm:space-y-3 max-h-[450px] lg:max-h-none overflow-y-auto">
        {activities.map((activity) => {
          const Icon = activity.icon;
          
          return (
            <div
              key={activity.id}
              className="flex items-start space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${activity.iconColor}`}>
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-900 line-clamp-1">
                  {activity.title}
                </p>
                <p className="text-xs sm:text-sm text-gray-600 truncate">
                  {activity.description}
                </p>
                <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5 sm:mt-1">
                  {formatTimestamp(activity.timestamp)}
                </p>
              </div>

              {activity.link && (
                <Link
                  href={activity.link}
                  className="text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-medium flex-shrink-0 hidden sm:block"
                >
                  View
                </Link>
              )}
            </div>
          );
        })}
      </div>

      {activities.length >= maxItems && (
        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200 text-center sticky bottom-0 bg-white">
          <Link
            href="/dashboard/opportunities"
            className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium inline-block"
          >
            View all activity →
          </Link>
        </div>
      )}
    </div>
  );
}

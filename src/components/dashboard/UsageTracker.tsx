'use client';

import { useEffect, useState } from 'react';
import { 
  Search, 
  Briefcase, 
  Code, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { getUsage, type UsageResponse } from '@/lib/api/usage';
import { extractErrorMessage } from '@/lib/api/client';
import { showToast } from '@/components/ui/Toast';
import Link from 'next/link';

interface UsageTrackerProps {
  className?: string;
  showHeader?: boolean;
  compact?: boolean;
}

/**
 * Usage Tracker Component
 * 
 * Displays current usage vs limits for:
 * - Keyword searches
 * - Opportunities per month
 * - API calls per month
 * 
 * Features:
 * - Real-time usage tracking
 * - Visual progress indicators
 * - Warning states when approaching limits
 * - Mobile-friendly design
 */
export function UsageTracker({ 
  className = '', 
  showHeader = true,
  compact = false 
}: UsageTrackerProps) {
  const [usage, setUsage] = useState<UsageResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUsage();
  }, []);

  const loadUsage = async () => {
    try {
      setIsLoading(true);
      const data = await getUsage();
      setUsage(data);
    } catch (err: any) {
      showToast.error('Failed to load usage data', extractErrorMessage(err, 'Failed to load usage data'));
    } finally {
      setIsLoading(false);
    }
  };

  const getUsagePercentage = (current: number, limit: number): number => {
    if (limit === 0) return 0; // Unlimited
    return Math.min(100, (current / limit) * 100);
  };

  const getUsageColor = (percentage: number, allowed: boolean): string => {
    if (!allowed) return 'bg-red-500';
    if (percentage >= 90) return 'bg-yellow-500';
    if (percentage >= 75) return 'bg-orange-500';
    return 'bg-green-500';
  };

  const getUsageStatus = (metric: { current: number; limit: number; allowed: boolean; remaining: number }) => {
    const percentage = getUsagePercentage(metric.current, metric.limit);
    const isUnlimited = metric.limit === 0 || metric.limit >= 999999;
    
    if (!metric.allowed) {
      return { text: 'Limit Reached', color: 'text-red-600', icon: AlertCircle };
    }
    if (isUnlimited) {
      return { text: 'Unlimited', color: 'text-green-600', icon: CheckCircle };
    }
    if (percentage >= 90) {
      return { text: 'Almost Full', color: 'text-yellow-600', icon: AlertCircle };
    }
    if (percentage >= 75) {
      return { text: 'Getting Full', color: 'text-orange-600', icon: TrendingUp };
    }
    return { text: 'Healthy', color: 'text-green-600', icon: CheckCircle };
  };

  if (isLoading) {
    return (
      <div className={`card ${className}`}>
        {showHeader && (
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Usage Tracking</h3>
          </div>
        )}
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
        </div>
      </div>
    );
  }

  if (!usage) {
    return (
      <div className={`card ${className}`}>
        {showHeader && (
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Usage Tracking</h3>
          </div>
        )}
        <div className="text-center py-4 text-gray-500 text-sm">
          No usage data available
        </div>
      </div>
    );
  }

  const metrics = [
    {
      key: 'keyword_searches' as const,
      label: 'Keyword Searches',
      icon: Search,
      description: 'Active searches',
    },
    {
      key: 'opportunities_per_month' as const,
      label: 'Opportunities',
      icon: Briefcase,
      description: 'This month',
    },
    {
      key: 'api_calls_per_month' as const,
      label: 'API Calls',
      icon: Code,
      description: 'This month',
    },
  ];

  return (
    <div className={`card ${className}`}>
      {showHeader && (
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Usage Tracking</h3>
            <p className="text-sm text-gray-600 mt-1">Monitor your plan usage and limits</p>
          </div>
          <Link
            href="/dashboard/subscription"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            View Plan →
          </Link>
        </div>
      )}

      <div className={`space-y-4 ${compact ? 'space-y-3' : ''}`}>
        {metrics.map((metric) => {
          const usageData = usage[metric.key];
          const percentage = getUsagePercentage(usageData.current, usageData.limit);
          const isUnlimited = usageData.limit === 0 || usageData.limit >= 999999;
          const status = getUsageStatus(usageData);
          const StatusIcon = status.icon;
          const Icon = metric.icon;

          return (
            <div
              key={metric.key}
              className={`bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border-2 ${
                !usageData.allowed
                  ? 'border-red-200 bg-red-50'
                  : percentage >= 90
                  ? 'border-yellow-200 bg-yellow-50'
                  : percentage >= 75
                  ? 'border-orange-200 bg-orange-50'
                  : 'border-gray-200'
              } transition-all duration-200 hover:shadow-md`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    !usageData.allowed
                      ? 'bg-red-100'
                      : percentage >= 90
                      ? 'bg-yellow-100'
                      : percentage >= 75
                      ? 'bg-orange-100'
                      : 'bg-blue-100'
                  }`}>
                    <Icon className={`w-5 h-5 ${
                      !usageData.allowed
                        ? 'text-red-600'
                        : percentage >= 90
                        ? 'text-yellow-600'
                        : percentage >= 75
                        ? 'text-orange-600'
                        : 'text-blue-600'
                    }`} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{metric.label}</h4>
                    <p className="text-xs text-gray-500">{metric.description}</p>
                  </div>
                </div>
                <div className={`flex items-center space-x-1.5 ${status.color}`}>
                  <StatusIcon className="w-4 h-4" />
                  <span className="text-xs font-medium">{status.text}</span>
                </div>
              </div>

              {/* Progress Bar */}
              {!isUnlimited && (
                <>
                  <div className="mb-2">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="font-semibold text-gray-900">
                        {usageData.current.toLocaleString()} / {usageData.limit.toLocaleString()}
                      </span>
                      <span className={`font-medium ${
                        !usageData.allowed
                          ? 'text-red-600'
                          : percentage >= 90
                          ? 'text-yellow-600'
                          : percentage >= 75
                          ? 'text-orange-600'
                          : 'text-gray-600'
                      }`}>
                        {Math.round(percentage)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${getUsageColor(percentage, usageData.allowed)}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                  {usageData.remaining > 0 && (
                    <p className="text-xs text-gray-600">
                      {usageData.remaining.toLocaleString()} remaining
                    </p>
                  )}
                </>
              )}

              {/* Unlimited Display */}
              {isUnlimited && (
                <div className="flex items-center space-x-2 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {usageData.current.toLocaleString()} used (Unlimited)
                  </span>
                </div>
              )}

              {/* Limit Reached Warning */}
              {!usageData.allowed && (
                <div className="mt-2 p-2 bg-red-100 rounded-lg">
                  <p className="text-xs text-red-700 font-medium">
                    Limit reached. Upgrade your plan to continue.
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Upgrade CTA (if any limit is reached or close) */}
      {(Object.values(usage).some(m => !m.allowed || getUsagePercentage(m.current, m.limit) >= 75)) && (
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-2 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Need More?</h4>
              <p className="text-sm text-gray-600">
                Upgrade your plan to increase limits and unlock more features.
              </p>
            </div>
            <Link
              href="/dashboard/subscription"
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all shadow-md hover:shadow-lg whitespace-nowrap"
            >
              Upgrade Plan
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}


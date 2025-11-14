'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
// import { motion } from 'framer-motion'; // TODO: Add animations in future iteration
import { useAuthStore } from '@/store/authStore';
import { 
  TrendingUp, 
  Search, 
  Briefcase, 
  Zap,
  ArrowRight,
  Plus,
  RefreshCw,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';
import { listOpportunities } from '@/lib/api/opportunities';
import { listKeywordSearches } from '@/lib/api/keyword-searches';
import { extractErrorMessage } from '@/lib/api/client';
import { showToast } from '@/components/ui/Toast';
import { ModernOpportunityCard } from '@/components/dashboard/ModernOpportunityCard';
import { updateOpportunity } from '@/lib/api/opportunities';
import { EnhancedStatCard } from '@/components/dashboard/EnhancedStatCard';
import { QuickInsights } from '@/components/dashboard/QuickInsights';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { SavedInsights, useSavedInsights } from '@/components/dashboard/SavedInsights';
import { getLastNDaysTrend, comparePeriods } from '@/lib/utils/historical-data';
import { UsageTracker } from '@/components/dashboard/UsageTracker';
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import type { Opportunity, OpportunityStatus } from '@/types/opportunity';
import type { KeywordSearch } from '@/types/keyword-search';

/**
 * Dashboard Home Page
 * 
 * Main dashboard with:
 * - Real-time statistics from API
 * - Quick actions
 * - Recent opportunities
 * - Keyword search status
 * - Auto-refresh capability
 */
export default function DashboardPage() {
  const { user, fetchUser } = useAuthStore();
  const router = useRouter();
  const { savedInsights, removeInsight } = useSavedInsights();
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Data state
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [keywordSearches, setKeywordSearches] = useState<KeywordSearch[]>([]);
  const [allOpportunities, setAllOpportunities] = useState<Opportunity[]>([]); // For trend calculation
  const [stats, setStats] = useState({
    totalOpportunities: 0,
    previousTotalOpportunities: 0,
    activeSearches: 0,
    thisMonth: 0,
    responseRate: 0,
  });

  // Load data
  const loadData = useCallback(async (showRefreshing = false) => {
    try {
      if (showRefreshing) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      // Load user if needed
      if (!user) {
        await fetchUser();
      }

      // Fetch data in parallel
      // Get more opportunities for trend calculation (up to 100)
      const [opportunitiesResponse, searchesData] = await Promise.all([
        listOpportunities({ limit: 100, offset: 0 }),
        listKeywordSearches(),
      ]);

      const opportunitiesData = opportunitiesResponse.items;
      setAllOpportunities(opportunitiesData);
      setOpportunities(opportunitiesData.slice(0, 10)); // Show first 10 in recent section
      setKeywordSearches(searchesData);

      // Calculate stats
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      
      const thisMonthOpps = opportunitiesData.filter(
        opp => new Date(opp.created_at) >= startOfMonth
      );
      
      const lastMonthOpps = opportunitiesData.filter(
        opp => {
          const oppDate = new Date(opp.created_at);
          return oppDate >= startOfLastMonth && oppDate < startOfMonth;
        }
      );

      const activeSearches = searchesData.filter(s => s.enabled).length;
      
      // Calculate response rate (opportunities with status beyond 'new')
      const respondedOpps = opportunitiesData.filter(
        opp => opp.status !== 'new'
      );
      const responseRate = opportunitiesData.length > 0
        ? Math.round((respondedOpps.length / opportunitiesData.length) * 100)
        : 0;

      setStats({
        totalOpportunities: opportunitiesData.length,
        previousTotalOpportunities: lastMonthOpps.length,
        activeSearches,
        thisMonth: thisMonthOpps.length,
        responseRate,
      });
    } catch (err: any) {
      console.error('Failed to load dashboard data:', err);
      showToast.error('Failed to load dashboard data', extractErrorMessage(err) || 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount - don't depend on user/fetchUser to prevent loops

  // Initial load - use ref to prevent re-running
  const hasLoadedRef = useRef(false);
  useEffect(() => {
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      loadData(true);
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [loadData]);

  // Handle opportunity update
  const handleOpportunityUpdate = async (
    id: string,
    status: OpportunityStatus,
    notes?: string
  ) => {
    try {
      const updated = await updateOpportunity(id, { status, notes });
      setOpportunities(prev =>
        prev.map(opp => opp.id === id ? updated : opp)
      );
      
      // Recalculate stats
      const respondedOpps = opportunities.filter(
        opp => opp.id === id ? status !== 'new' : opp.status !== 'new'
      );
      const responseRate = opportunities.length > 0
        ? Math.round((respondedOpps.length / opportunities.length) * 100)
        : 0;
      
      setStats(prev => ({ ...prev, responseRate }));
    } catch (err: any) {
      console.error('Failed to update opportunity:', err);
      throw err;
    }
  };

  // Calculate last 7 days trend using historical data utility
  const last7DaysTrend = useMemo(() => {
    return getLastNDaysTrend(allOpportunities, 7);
  }, [allOpportunities]);

  // Calculate period comparison for better trend accuracy
  const periodComparison = useMemo(() => {
    return comparePeriods(allOpportunities, 30, 30);
  }, [allOpportunities]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-full overflow-x-hidden">
      {/* Header with Refresh */}
      <div className="space-y-4" data-tour="dashboard-header">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.full_name?.split(' ')[0] || 'there'}! 👋
            </h1>
            <p className="text-sm text-gray-600">
              Here's what's happening with your opportunities today.
            </p>
          </div>
          <button
            onClick={() => loadData(true)}
            disabled={isRefreshing}
            className="flex items-center justify-center space-x-2 px-3 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            title="Refresh data"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Quick Insights */}
      <QuickInsights 
        opportunities={allOpportunities}
        keywordSearches={keywordSearches}
      />

      {/* Saved Insights */}
      {savedInsights.length > 0 && (
        <SavedInsights 
          insights={savedInsights}
          onRemove={removeInsight}
        />
      )}

      {/* KPI Section - Like Databox: Clear metrics at top */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <EnhancedStatCard
          icon={Briefcase}
          label="Total Leads"
          value={stats.totalOpportunities}
          previousValue={stats.previousTotalOpportunities}
          change={`+${stats.thisMonth} this month`}
          bgGradient="from-primary-500 to-primary-600"
          trend={last7DaysTrend}
          onClick={() => router.push('/dashboard/opportunities')}
          loading={isLoading}
        />
        
        <EnhancedStatCard
          icon={TrendingUp}
          label="This Month"
          value={stats.thisMonth}
          change={stats.thisMonth > 0 ? `+${stats.thisMonth} new leads` : 'No new this month'}
          bgGradient="from-secondary-500 to-secondary-600"
          onClick={() => router.push('/dashboard/opportunities')}
          loading={isLoading}
        />
        
        <EnhancedStatCard
          icon={CheckCircle2}
          label="Response Rate"
          value={`${stats.responseRate}%`}
          change={stats.responseRate > 0 ? `${Math.round(stats.responseRate * stats.totalOpportunities / 100)} responded` : 'Start responding'}
          bgGradient="from-accent-500 to-accent-600"
          onClick={() => router.push('/dashboard/opportunities')}
          loading={isLoading}
        />
        
        <EnhancedStatCard
          icon={Search}
          label="Active Searches"
          value={stats.activeSearches}
          change={`${keywordSearches.length - stats.activeSearches} paused`}
          bgGradient="from-warning-500 to-warning-600"
          onClick={() => router.push('/dashboard/keyword-searches')}
          loading={isLoading}
        />
      </div>

      {/* Today's Hot Leads Section - Like Geckoboard: Real-time clarity */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-error-500 to-warning-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">🔥 Today's Hot Leads</h2>
              <p className="text-sm text-gray-600">Top scoring opportunities from the last 24 hours</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-accent-500 rounded-full animate-pulse"></div>
            <span>Live</span>
          </div>
        </div>

        {opportunities.length > 0 ? (
          <div className="space-y-4">
            {opportunities
              .filter(opp => {
                const oppDate = new Date(opp.created_at);
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                return oppDate >= yesterday;
              })
              .sort((a, b) => (b.total_score || 0) - (a.total_score || 0))
              .slice(0, 3)
              .map((opportunity, index) => (
                <div key={opportunity.id} className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-sm font-bold mt-2">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <ModernOpportunityCard
                      opportunity={opportunity}
                      onUpdate={handleOpportunityUpdate}
                      viewMode="compact"
                    />
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-primary-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No hot leads today</h3>
            <p className="text-gray-600 mb-4">Check back later or create more keyword searches</p>
            <Link
              href="/dashboard/keyword-searches"
              className="btn-primary inline-flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add More Searches
            </Link>
          </div>
        )}

        {opportunities.length > 3 && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <Link
              href="/dashboard/opportunities"
              className="text-primary-600 hover:text-primary-700 font-medium text-sm inline-flex items-center"
            >
              View all {opportunities.length} opportunities
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        )}
      </div>

      {/* This Week's Activity Section - Like Klipfolio: Modular widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Chart */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">📈 This Week's Activity</h2>
              <p className="text-sm text-gray-600">Lead generation and response activity</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
              <span className="text-xs text-gray-600">New Leads</span>
              <div className="w-3 h-3 bg-accent-500 rounded-full ml-4"></div>
              <span className="text-xs text-gray-600">Responses</span>
            </div>
          </div>
          
          {/* Simple Activity Chart - Made taller */}
          <div className="h-64 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg flex items-end justify-between p-4 space-x-2 mb-6">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
              <div key={day} className="flex flex-col items-center flex-1">
                <div className="w-full bg-primary-200 rounded-t-lg mb-1" style={{ height: `${Math.random() * 120 + 30}px` }}>
                  <div className="w-full bg-primary-500 rounded-t-lg" style={{ height: `${Math.random() * 80 + 15}px` }}></div>
                </div>
                <span className="text-xs text-gray-600 mt-2">{day}</span>
              </div>
            ))}
          </div>
          
          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center p-4 bg-primary-50 rounded-lg">
              <div className="text-2xl font-bold text-primary-600">{stats.thisMonth}</div>
              <div className="text-sm text-gray-600">New This Week</div>
            </div>
            <div className="text-center p-4 bg-accent-50 rounded-lg">
              <div className="text-2xl font-bold text-accent-600">{Math.round(stats.responseRate * stats.totalOpportunities / 100)}</div>
              <div className="text-sm text-gray-600">Responses</div>
            </div>
          </div>
          
          {/* Weekly Summary */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Weekly Performance</span>
              <span className="text-primary-600 font-medium">
                {stats.thisMonth > 0 ? '↗ Trending Up' : '→ Steady'}
              </span>
            </div>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="lg:col-span-1">
          <div className="card h-full flex flex-col">
            <div className="flex items-center justify-between mb-4 flex-shrink-0">
              <h3 className="text-lg font-semibold text-gray-900">🎯 Recent Activity</h3>
              <div className="w-2 h-2 bg-accent-500 rounded-full animate-pulse"></div>
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="max-h-96 overflow-y-auto">
                <ActivityFeed 
                  opportunities={allOpportunities}
                  keywordSearches={keywordSearches}
                  maxItems={12}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions - Streamlined */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Create Keyword Search */}
        <div className="card bg-gradient-to-br from-primary-50 to-secondary-50 border border-primary-200 hover:border-primary-300 transition-colors">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {keywordSearches.length === 0 
                  ? '🚀 Start Finding Leads'
                  : '➕ Create New Search'
                }
              </h3>
              <p className="text-gray-600 mb-4 text-sm">
                {keywordSearches.length === 0
                  ? 'Set up your first keyword search to automatically find freelance opportunities on Reddit.'
                  : 'Expand your reach with additional keyword searches.'
                }
              </p>
              <Link
                href="/dashboard/keyword-searches?new=true"
                className="inline-flex items-center px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors text-sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                {keywordSearches.length === 0 ? 'Get Started' : 'Add Search'}
              </Link>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center shadow-lg">
              <Search className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* View Opportunities */}
        <div className="card bg-gradient-to-br from-accent-50 to-accent-100 border border-accent-200 hover:border-accent-300 transition-colors">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {opportunities.length === 0
                  ? '👀 View All Leads'
                  : `📋 ${opportunities.length} Leads Available`
                }
              </h3>
              <p className="text-gray-600 mb-4 text-sm">
                {opportunities.length === 0
                  ? 'Browse and manage all your discovered opportunities in one place.'
                  : `You have ${opportunities.length} opportunities ready for action.`
                }
              </p>
              <Link
                href="/dashboard/opportunities"
                className="inline-flex items-center px-4 py-2 bg-accent-500 hover:bg-accent-600 text-white rounded-lg font-medium transition-colors text-sm"
              >
                View All Leads
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-accent-600 rounded-lg flex items-center justify-center shadow-lg">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Active Searches Summary */}
      {keywordSearches.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Active Keyword Searches
            </h2>
            <Link
              href="/dashboard/keyword-searches"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Manage All →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {keywordSearches.slice(0, 3).map((search) => (
              <div
                key={search.id}
                className="p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{search.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    search.enabled
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {search.enabled ? 'Active' : 'Paused'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {search.keywords.length} keywords • {search.subreddits.length} subreddits
                </p>
                <Link
                  href={`/dashboard/opportunities?keyword_search_id=${search.id}`}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  View opportunities →
                </Link>
              </div>
            ))}
          </div>
          {keywordSearches.length > 3 && (
            <div className="text-center pt-4">
              <Link
                href="/dashboard/keyword-searches"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View {keywordSearches.length - 3} more searches →
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Subscription Status */}
      {user?.subscription && (
        <div className={`card ${
          user.subscription.plan === 'free'
            ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300'
            : 'bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-lg font-semibold mb-1 ${
                user.subscription.plan === 'free' ? 'text-green-900' : 'text-gray-900'
              }`}>
                {user.subscription.plan === 'free' ? (
                  <>🎉 Free Trial - Full Access</>
                ) : (
                  <>
                    {user.subscription.plan.charAt(0).toUpperCase() + user.subscription.plan.slice(1)} Plan
                  </>
                )}
              </h3>
              <p className={`text-sm ${
                user.subscription.plan === 'free' ? 'text-green-700' : 'text-gray-600'
              }`}>
                {user.subscription.status === 'active' ? (
                  user.subscription.plan === 'free' ? (
                    user.subscription.current_period_end ? (
                      <>
                        Free trial expires on{' '}
                        <span className="font-semibold">
                          {new Date(user.subscription.current_period_end).toLocaleDateString()}
                        </span>
                        {' '}({Math.ceil((new Date(user.subscription.current_period_end).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days remaining)
                      </>
                    ) : (
                      'Free trial active'
                    )
                  ) : (
                    user.subscription.current_period_end 
                      ? `Active until ${new Date(user.subscription.current_period_end).toLocaleDateString()}`
                      : 'Active subscription'
                  )
                ) : (
                  'Subscription status: ' + user.subscription.status
                )}
              </p>
              {user.subscription.plan === 'free' && (
                <p className="text-xs text-green-600 mt-1">
                  Upgrade to a paid plan anytime to continue after your trial ends
                </p>
              )}
            </div>
            <Link
              href="/dashboard/subscription"
              className="btn-outline"
            >
              {user.subscription.plan === 'free' ? 'Upgrade Plan' : 'Manage Subscription'}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

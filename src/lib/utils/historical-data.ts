import type { Opportunity } from '@/types/opportunity';

/**
 * Historical data tracking utilities
 * 
 * Calculates trends and historical metrics from opportunity data
 */

export interface DailySnapshot {
  date: Date;
  totalOpportunities: number;
  newOpportunities: number;
  contactedOpportunities: number;
  appliedOpportunities: number;
  wonOpportunities: number;
  averageScore: number;
  totalScore: number;
}

export interface TrendData {
  dates: string[];
  values: number[];
  average: number;
  trend: 'up' | 'down' | 'stable';
  changePercent: number;
}

/**
 * Generate daily snapshots from opportunities
 */
export function generateDailySnapshots(
  opportunities: Opportunity[],
  days: number = 30
): DailySnapshot[] {
  const snapshots: DailySnapshot[] = [];
  const now = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    
    const nextDate = new Date(date);
    nextDate.setDate(date.getDate() + 1);
    
    const dayOpportunities = opportunities.filter(opp => {
      const oppDate = new Date(opp.created_at);
      return oppDate >= date && oppDate < nextDate;
    });
    
    const total = dayOpportunities.length;
    const newCount = dayOpportunities.filter(o => o.status === 'new').length;
    const contactedCount = dayOpportunities.filter(o => 
      o.status === 'contacted' || o.status === 'applied'
    ).length;
    const appliedCount = dayOpportunities.filter(o => o.status === 'applied').length;
    const wonCount = dayOpportunities.filter(o => o.status === 'won').length;
    
    const scores = dayOpportunities
      .map(o => o.total_score || 0)
      .filter(s => s > 0);
    const totalScore = scores.reduce((sum, s) => sum + s, 0);
    const averageScore = scores.length > 0 ? totalScore / scores.length : 0;
    
    snapshots.push({
      date,
      totalOpportunities: total,
      newOpportunities: newCount,
      contactedOpportunities: contactedCount,
      appliedOpportunities: appliedCount,
      wonOpportunities: wonCount,
      averageScore,
      totalScore,
    });
  }
  
  return snapshots;
}

/**
 * Calculate trend from daily snapshots
 */
export function calculateTrend(
  snapshots: DailySnapshot[],
  metric: keyof DailySnapshot = 'totalOpportunities'
): TrendData {
  if (snapshots.length === 0) {
    return {
      dates: [],
      values: [],
      average: 0,
      trend: 'stable',
      changePercent: 0,
    };
  }
  
  const values = snapshots.map(s => Number(s[metric]) || 0);
  const dates = snapshots.map(s => 
    s.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  );
  
  const average = values.reduce((sum, v) => sum + v, 0) / values.length;
  
  // Calculate trend (compare first half vs second half)
  const midpoint = Math.floor(values.length / 2);
  const firstHalf = values.slice(0, midpoint);
  const secondHalf = values.slice(midpoint);
  
  const firstAvg = firstHalf.reduce((sum, v) => sum + v, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((sum, v) => sum + v, 0) / secondHalf.length;
  
  const changePercent = firstAvg > 0 
    ? ((secondAvg - firstAvg) / firstAvg) * 100 
    : 0;
  
  let trend: 'up' | 'down' | 'stable' = 'stable';
  if (changePercent > 5) trend = 'up';
  else if (changePercent < -5) trend = 'down';
  
  return {
    dates,
    values,
    average,
    trend,
    changePercent,
  };
}

/**
 * Get last N days trend
 */
export function getLastNDaysTrend(
  opportunities: Opportunity[],
  days: number = 7
): number[] {
  const trend: number[] = [];
  const now = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    
    const nextDate = new Date(date);
    nextDate.setDate(date.getDate() + 1);
    
    const count = opportunities.filter(opp => {
      const oppDate = new Date(opp.created_at);
      return oppDate >= date && oppDate < nextDate;
    }).length;
    
    trend.push(count);
  }
  
  return trend;
}

/**
 * Compare two periods
 */
export function comparePeriods(
  opportunities: Opportunity[],
  currentPeriodDays: number = 30,
  previousPeriodDays: number = 30
): {
  current: number;
  previous: number;
  change: number;
  changePercent: number;
} {
  const now = new Date();
  const currentStart = new Date(now);
  currentStart.setDate(now.getDate() - currentPeriodDays);
  
  const previousStart = new Date(currentStart);
  previousStart.setDate(currentStart.getDate() - previousPeriodDays);
  
  const currentCount = opportunities.filter(opp => {
    const oppDate = new Date(opp.created_at);
    return oppDate >= currentStart && oppDate <= now;
  }).length;
  
  const previousCount = opportunities.filter(opp => {
    const oppDate = new Date(opp.created_at);
    return oppDate >= previousStart && oppDate < currentStart;
  }).length;
  
  const change = currentCount - previousCount;
  const changePercent = previousCount > 0 
    ? (change / previousCount) * 100 
    : currentCount > 0 ? 100 : 0;
  
  return {
    current: currentCount,
    previous: previousCount,
    change,
    changePercent,
  };
}

/**
 * Store daily snapshot in localStorage (for frontend-only tracking)
 */
export function storeDailySnapshot(snapshot: DailySnapshot): void {
  const key = `snapshot_${snapshot.date.toISOString().split('T')[0]}`;
  localStorage.setItem(key, JSON.stringify(snapshot));
}

/**
 * Get stored snapshots from localStorage
 */
export function getStoredSnapshots(days: number = 30): DailySnapshot[] {
  const snapshots: DailySnapshot[] = [];
  const now = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const key = `snapshot_${date.toISOString().split('T')[0]}`;
    
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        snapshots.push({
          ...parsed,
          date: new Date(parsed.date),
        });
      } catch (e) {
        console.error('Failed to parse snapshot:', e);
      }
    }
  }
  
  return snapshots;
}


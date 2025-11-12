'use client';

import { useState, useEffect } from 'react';
import { Calendar, TrendingUp, Download, FileText, FileSpreadsheet } from 'lucide-react';
import { OpportunityChart } from '@/components/analytics/OpportunityChart';
import { PerformanceMetrics } from '@/components/analytics/PerformanceMetrics';
import { KeywordSearchPerformance } from '@/components/analytics/KeywordSearchPerformance';
import { QuickFilters, type TimeRange } from '@/components/dashboard/QuickFilters';
import { ConversionFunnel } from '@/components/analytics/ConversionFunnel';
import { SourcePerformance } from '@/components/analytics/SourcePerformance';
import { SavedInsights, useSavedInsights } from '@/components/dashboard/SavedInsights';
import { listOpportunities } from '@/lib/api/opportunities';
import { listKeywordSearches } from '@/lib/api/keyword-searches';
import { extractErrorMessage } from '@/lib/utils/error-handler';
import { showToast } from '@/components/ui/Toast';
import { exportToCSV, exportAnalyticsToCSV, exportToPDF, generatePDFHTML } from '@/lib/utils/export';
import type { DateRange } from '@/components/dashboard/DateRangePicker';
import type { Opportunity } from '@/types/opportunity';
import type { KeywordSearch } from '@/types/keyword-search';

/**
 * Analytics Page
 * 
 * View analytics and insights for opportunities and keyword searches
 */
export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [customRange, setCustomRange] = useState<DateRange>({ startDate: null, endDate: null });
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [keywordSearches, setKeywordSearches] = useState<KeywordSearch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { savedInsights, removeInsight } = useSavedInsights();

  useEffect(() => {
    loadData();
  }, [timeRange]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Load all opportunities with pagination (API limit is 100)
      // Fetch in batches until we get all opportunities
      const allOpportunities: Opportunity[] = [];
      let offset = 0;
      const limit = 100; // API maximum limit
      let hasMore = true;

      while (hasMore) {
        const batchResponse = await listOpportunities({ limit, offset });
        const batch = batchResponse.items;
        allOpportunities.push(...batch);
        
        // Check if there are more items using has_more flag
        if (!batchResponse.has_more || batch.length < limit) {
          hasMore = false;
        } else {
          offset += limit;
        }
      }

      setOpportunities(allOpportunities);

      // Load keyword searches
      const searches = await listKeywordSearches();
      setKeywordSearches(searches);
    } catch (err: any) {
      showToast.error('Failed to load analytics data', extractErrorMessage(err, 'Failed to load analytics data'));
    } finally {
      setIsLoading(false);
    }
  };

  // Filter opportunities by time range
  const getFilteredOpportunities = () => {
    if (timeRange === 'all') return opportunities;

    // Handle custom date range
    if (timeRange === 'custom' && customRange.startDate && customRange.endDate) {
      return opportunities.filter(opp => {
        const oppDate = new Date(opp.created_at);
        return oppDate >= customRange.startDate! && oppDate <= customRange.endDate!;
      });
    }

    const now = new Date();
    const cutoffDate = new Date();
    
    switch (timeRange) {
      case 'today':
        cutoffDate.setHours(0, 0, 0, 0);
        break;
      case '7d':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        cutoffDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        cutoffDate.setDate(now.getDate() - 90);
        break;
    }

    return opportunities.filter(opp => {
      const oppDate = new Date(opp.created_at);
      return oppDate >= cutoffDate;
    });
  };

  // Export handlers
  const handleExportCSV = () => {
    exportToCSV(filteredOpportunities, `opportunities_${timeRange}_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleExportAnalyticsCSV = () => {
    exportAnalyticsToCSV(filteredOpportunities, keywordSearches, `analytics_${timeRange}_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleExportPDF = () => {
    // Create a temporary element for PDF export
    const tempDiv = document.createElement('div');
    tempDiv.id = 'pdf-export-content';
    tempDiv.style.display = 'none';
    tempDiv.innerHTML = generatePDFHTML(filteredOpportunities, `Analytics Report - ${timeRange}`);
    document.body.appendChild(tempDiv);
    
    exportToPDF('pdf-export-content', `analytics_${timeRange}_${new Date().toISOString().split('T')[0]}.pdf`);
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(tempDiv);
    }, 1000);
  };

  const filteredOpportunities = getFilteredOpportunities();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-sm text-gray-600">
            Track your opportunity performance and keyword search effectiveness
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {/* Export Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="flex items-center justify-center space-x-2 px-3 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors text-sm flex-1 sm:flex-none"
              title="Export opportunities to CSV"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span className="font-medium">CSV</span>
            </button>
            <button
              onClick={handleExportPDF}
              className="flex items-center justify-center space-x-2 px-3 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors text-sm flex-1 sm:flex-none"
              title="Export to PDF"
            >
              <FileText className="w-4 h-4" />
              <span className="font-medium">PDF</span>
            </button>
          </div>

          {/* Quick Filters */}
          <div className="w-full">
            <QuickFilters 
              selectedRange={timeRange}
              onRangeChange={setTimeRange}
              onCustomRangeChange={setCustomRange}
              customRange={customRange}
            />
          </div>
        </div>
      </div>

      {/* Saved Insights */}
      {savedInsights.length > 0 && (
        <SavedInsights 
          insights={savedInsights}
          onRemove={removeInsight}
        />
      )}

      {/* Performance Metrics */}
      <PerformanceMetrics opportunities={filteredOpportunities} />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Opportunities Over Time */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Opportunities Over Time</h2>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          <OpportunityChart opportunities={filteredOpportunities} type="line" />
        </div>

        {/* Status Distribution */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Status Distribution</h2>
            <Calendar className="w-5 h-5 text-gray-400" />
          </div>
          <OpportunityChart opportunities={filteredOpportunities} type="pie" />
        </div>
      </div>

      {/* Conversion Funnel */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Conversion Pipeline
        </h2>
        <ConversionFunnel opportunities={filteredOpportunities} />
      </div>

      {/* Source Performance */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Performance by Source
        </h2>
        <SourcePerformance opportunities={filteredOpportunities} />
      </div>

      {/* Keyword Search Performance */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Keyword Search Performance</h2>
        <KeywordSearchPerformance 
          keywordSearches={keywordSearches} 
          opportunities={filteredOpportunities}
        />
      </div>
    </div>
  );
}


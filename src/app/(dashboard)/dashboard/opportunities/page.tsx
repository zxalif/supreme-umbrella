'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Briefcase, 
  Filter, 
  Download, 
  RefreshCw, 
  AlertCircle,
  Search as SearchIcon,
  X,
  Loader2,
  Grid3x3,
  List,
  TrendingUp,
  SlidersHorizontal,
  LayoutList
} from 'lucide-react';
import { ModernOpportunityCard } from '@/components/dashboard/ModernOpportunityCard';
import { KeywordSearchSelector } from '@/components/dashboard/KeywordSearchSelector';
import { CTABanner } from '@/components/dashboard/CTABanner';
import { WorkflowProgress } from '@/components/dashboard/WorkflowProgress';
import { showToast } from '@/components/ui/Toast';
import { SuccessMessage } from '@/components/ui/SuccessMessage';
import { QuickActionsCard } from '@/components/dashboard/QuickActionsCard';
import {
  listOpportunities,
  updateOpportunity,
  generateOpportunities,
  exportOpportunitiesCSV,
  getActiveJobForSearch,
  getGenerationJobStatus,
} from '@/lib/api/opportunities';
import { listKeywordSearches } from '@/lib/api/keyword-searches';
import type { Opportunity, OpportunityStatus, OpportunityFilters } from '@/types/opportunity';
import type { KeywordSearch } from '@/types/keyword-search';
import type { GenerateOpportunitiesJobStatus } from '@/types/opportunity';
import { ApiClientError, extractErrorMessage } from '@/lib/api/client';
import { getJobTimeInfo } from '@/lib/utils/timeEstimation';

type ViewMode = 'card' | 'compact' | 'list';
type SortBy = 'score' | 'relevance' | 'date' | 'urgency';
type SortOrder = 'asc' | 'desc';

/**
 * Professional Opportunities Page
 * 
 * Features:
 * - Advanced filtering (search, score range, status, source)
 * - Sorting options
 * - View mode toggle (card/compact)
 * - Professional opportunity cards with all information
 */
export default function OpportunitiesPage() {
  const searchParams = useSearchParams();
  const keywordSearchIdParam = searchParams.get('keyword_search_id');

  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [keywordSearches, setKeywordSearches] = useState<KeywordSearch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [cooldownMessage, setCooldownMessage] = useState<string | null>(null);
  const [forceRefresh, setForceRefresh] = useState(false);
  
  // Job tracking
  const [activeJob, setActiveJob] = useState<GenerateOpportunitiesJobStatus | null>(null);
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);
  
  // Filters
  const [selectedKeywordSearch, setSelectedKeywordSearch] = useState<string>(
    keywordSearchIdParam || 'all'
  );
  const [selectedStatus, setSelectedStatus] = useState<OpportunityStatus | 'all'>('all');
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [minScore, setMinScore] = useState<string>('');
  const [minRelevance, setMinRelevance] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortBy>('score');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [viewMode, setViewMode] = useState<ViewMode>('card');
  const [showFilters, setShowFilters] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [generatedCount, setGeneratedCount] = useState<number>(0);

  useEffect(() => {
    loadKeywordSearches();
  }, []);

  useEffect(() => {
    loadOpportunities();
  }, [selectedKeywordSearch, selectedStatus, selectedSource, searchQuery, minScore, minRelevance, sortBy, sortOrder]);

  // Check for active job on page load (from localStorage)
  useEffect(() => {
    const checkStoredJob = async () => {
      if (typeof window === 'undefined') return;
      
      const storedJobId = localStorage.getItem('activeJobId');
      const storedSearchId = localStorage.getItem('activeJobSearchId');
      const storedStartTime = localStorage.getItem('activeJobStartTime');
      
      if (storedJobId && storedSearchId) {
        // If we have a stored job, check if it's still active
        try {
          const status = await getGenerationJobStatus(storedJobId);
          
          if (status.status === 'pending' || status.status === 'processing') {
            // Job is still active
            setActiveJob(status);
            setSelectedKeywordSearch(storedSearchId);
            startPolling(storedJobId);
          } else {
            // Job completed or failed, clean up
            localStorage.removeItem('activeJobId');
            localStorage.removeItem('activeJobSearchId');
            localStorage.removeItem('activeJobStartTime');
          }
        } catch (err) {
          // Job might not exist anymore, clean up
          console.warn('Stored job not found, cleaning up:', err);
          localStorage.removeItem('activeJobId');
          localStorage.removeItem('activeJobSearchId');
          localStorage.removeItem('activeJobStartTime');
        }
      }
    };
    
    checkStoredJob();
  }, []);

  // Check for active job when keyword search changes
  useEffect(() => {
    if (selectedKeywordSearch !== 'all') {
      checkActiveJob();
    } else {
      setActiveJob(null);
      stopPolling();
    }
    
    return () => {
      stopPolling();
    };
  }, [selectedKeywordSearch]);

  // Poll job status if there's an active job
  useEffect(() => {
    if (activeJob && (activeJob.status === 'pending' || activeJob.status === 'processing')) {
      startPolling(activeJob.job_id);
    } else {
      stopPolling();
    }
    
    return () => {
      stopPolling();
    };
  }, [activeJob]);

  const loadKeywordSearches = async () => {
    try {
      const searches = await listKeywordSearches();
      setKeywordSearches(searches);
    } catch (err) {
      console.error('Failed to load keyword searches:', err);
    }
  };

  const loadOpportunities = async () => {
    setIsLoading(true);
    try {
      const filters: OpportunityFilters = {
        limit: 100, // API maximum limit
      };
      
      if (selectedKeywordSearch !== 'all') {
        filters.keyword_search_id = selectedKeywordSearch;
      }
      if (selectedStatus !== 'all') {
        filters.status = selectedStatus;
      }
      if (selectedSource !== 'all') {
        filters.source = selectedSource;
      }
      if (searchQuery.trim()) {
        filters.search = searchQuery.trim();
      }
      if (minScore) {
        filters.min_score = parseFloat(minScore);
      }
      if (minRelevance) {
        filters.min_relevance = parseFloat(minRelevance);
      }
      filters.sort_by = sortBy;
      filters.sort_order = sortOrder;

      const response = await listOpportunities(filters);
      
      // Extract items from paginated response
      let data = response.items;
      
      // Client-side filtering for search query (if backend doesn't support it)
      let filteredData = data;
      if (searchQuery.trim() && !filters.search) {
        const query = searchQuery.toLowerCase();
        filteredData = data.filter(opp => 
          opp.title?.toLowerCase().includes(query) ||
          opp.content.toLowerCase().includes(query) ||
          opp.matched_keywords.some(k => k.toLowerCase().includes(query))
        );
      }
      
      // Client-side sorting (if backend doesn't support it)
      filteredData.sort((a, b) => {
        let comparison = 0;
        switch (sortBy) {
          case 'score':
            comparison = a.total_score - b.total_score;
            break;
          case 'relevance':
            comparison = a.relevance_score - b.relevance_score;
            break;
          case 'urgency':
            comparison = a.urgency_score - b.urgency_score;
            break;
          case 'date':
            comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
            break;
        }
        return sortOrder === 'asc' ? comparison : -comparison;
      });
      
      setOpportunities(filteredData);
    } catch (err: any) {
      if (err instanceof ApiClientError) {
        showToast.error('Failed to load opportunities', extractErrorMessage(err.data));
      } else {
        showToast.error('Failed to load opportunities', extractErrorMessage(err) || 'Failed to load opportunities');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (id: string, status: OpportunityStatus, notes?: string) => {
    try {
      const updated = await updateOpportunity(id, { status, notes });
      setOpportunities(opportunities.map(o => o.id === id ? updated : o));
      showToast.success('Opportunity updated successfully');
    } catch (err: any) {
      const errorMessage = err instanceof ApiClientError 
        ? extractErrorMessage(err.data)
        : extractErrorMessage(err) || 'Failed to update opportunity';
      showToast.error('Failed to update opportunity', errorMessage);
      throw err;
    }
  };

  const checkActiveJob = async () => {
    if (selectedKeywordSearch === 'all') {
      return;
    }
    
    try {
      const job = await getActiveJobForSearch(selectedKeywordSearch);
      setActiveJob(job);
    } catch (err) {
      console.error('Failed to check active job:', err);
      setActiveJob(null);
    }
  };

  const startPolling = (jobId: string) => {
    stopPolling(); // Clear any existing polling
    
    const interval = setInterval(async () => {
      try {
        const status = await getGenerationJobStatus(jobId);
        setActiveJob(status);
        
        // Check job message for cooldown info (even while processing)
        if (status.message && status.message.toLowerCase().includes('cooldown')) {
          // Extract cooldown time from message
          const cooldownMatch = status.message.match(/Wait ([\d.]+) more (minute|minutes)/i);
          if (cooldownMatch) {
            setCooldownMessage(`Cooldown active: ${cooldownMatch[0]}. Using existing leads instead.`);
          } else {
            // Extract any cooldown message
            const cooldownText = status.message.match(/cooldown[^.]*(?:\.|$)/i)?.[0] || status.message;
            setCooldownMessage(cooldownText);
          }
        }
        
        // If job completed or failed, stop polling and refresh opportunities
        if (status.status === 'completed' || status.status === 'failed') {
          stopPolling();
          
          // Clean up localStorage
          localStorage.removeItem('activeJobId');
          localStorage.removeItem('activeJobSearchId');
          localStorage.removeItem('activeJobStartTime');
          
          if (status.status === 'completed' && status.result) {
            // Refresh opportunities to show new ones
            await loadOpportunities();
            
            // Check for cooldown message in result (highest priority)
            if (status.result.cooldown_message) {
              setCooldownMessage(status.result.cooldown_message);
            } else if (status.message && status.message.toLowerCase().includes('cooldown')) {
              // Fallback to job message
              const cooldownMatch = status.message.match(/Wait ([\d.]+) more (minute|minutes)/i);
              if (cooldownMatch) {
                setCooldownMessage(`Cooldown active: ${cooldownMatch[0]}. Using existing leads instead.`);
              } else {
                setCooldownMessage(status.message);
              }
            } else {
              setCooldownMessage(null);
            }
          } else if (status.status === 'failed') {
            const errorMsg = status.error || 'Opportunity generation failed';
            
            // Check if error is a cooldown message
            if (status.error && status.error.toLowerCase().includes('cooldown')) {
              const cooldownMatch = status.error.match(/Wait ([\d.]+) more (minute|minutes)/i);
              if (cooldownMatch) {
                const cooldownMsg = `Cooldown active: ${cooldownMatch[0]}. Using existing leads instead.`;
                setCooldownMessage(cooldownMsg);
                showToast.warning('Cooldown Active', cooldownMsg);
              } else {
                setCooldownMessage(status.error);
                showToast.warning('Cooldown Active', status.error);
              }
            } else {
              showToast.error('Generation failed', errorMsg);
            }
          }
          setActiveJob(null);
        }
      } catch (err) {
        console.error('Failed to poll job status:', err);
        stopPolling();
        setActiveJob(null);
      }
    }, 3000); // Poll every 3 seconds
    
    setPollingInterval(interval);
  };

  const stopPolling = () => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
      setPollingInterval(null);
    }
  };

  const handleGenerate = async () => {
    if (selectedKeywordSearch === 'all') {
      showToast.error('Validation Error', 'Please select a keyword search first');
      return;
    }

    // Check if there's already an active job
    if (activeJob && (activeJob.status === 'pending' || activeJob.status === 'processing')) {
      showToast.warning('Generation in Progress', 'Opportunity generation is already in progress for this search');
      return;
    }

    setIsGenerating(true);
    setCooldownMessage(null);
    
    console.log(`[Frontend] Generating opportunities with force_refresh=${forceRefresh} for search: ${selectedKeywordSearch}`);
    
    try {
      const result = await generateOpportunities(
        selectedKeywordSearch, 
        100,
        (progress, message) => {
          console.log(`Progress: ${progress}% - ${message}`);
        },
        forceRefresh
      );
      
      // Note: generateOpportunities is a blocking function that completes before returning,
      // so we don't need to store job_id. The function handles polling internally.
      // If we need to track jobs separately, we should use startGenerateOpportunities instead.
      
      // Check for any other active jobs after completion
      await checkActiveJob();
      
      // Refresh opportunities
      await loadOpportunities();
      
      // Show success message
      if (result.opportunities_created > 0) {
        setGeneratedCount(result.opportunities_created);
        setShowSuccessMessage(true);
        showToast.success(`Generated ${result.opportunities_created} new opportunities`);
        
        // Check for cooldown message in result
        if (result.cooldown_message) {
          setCooldownMessage(result.cooldown_message);
          showToast.info(result.cooldown_message);
        } else {
          setCooldownMessage(null);
        }
      } else {
        showToast.info('No new opportunities found');
      }
    } catch (err: any) {
      if (err instanceof ApiClientError) {
        const errorMessage = extractErrorMessage(err.data);
        
        // Check if it's a cooldown error (409 Conflict)
        if (err.status === 409) {
          // Extract cooldown message from error
          const cooldownMatch = errorMessage.match(/Wait ([\d.]+) more (minute|minutes)/i);
          if (cooldownMatch) {
            const cooldownMsg = `Cooldown active: ${cooldownMatch[0]}. Using existing leads instead.`;
            setCooldownMessage(cooldownMsg);
            showToast.warning('Cooldown Active', cooldownMsg);
          } else if (errorMessage.toLowerCase().includes('cooldown')) {
            setCooldownMessage(errorMessage);
            showToast.warning('Cooldown Active', errorMessage);
          } else {
            showToast.error('Generation failed', errorMessage || 'Failed to generate opportunities');
          }
        } else {
          showToast.error('Generation failed', errorMessage || 'Failed to generate opportunities');
        }
      } else {
        const errorMessage = extractErrorMessage(err) || 'Failed to generate opportunities';
        showToast.error('Generation failed', errorMessage);
      }
      setActiveJob(null);
      
      // Clean up localStorage on error
      localStorage.removeItem('activeJobId');
      localStorage.removeItem('activeJobSearchId');
      localStorage.removeItem('activeJobStartTime');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExport = async () => {
    try {
      showToast.info('Preparing export...');
      const filters: OpportunityFilters = {};
      if (selectedKeywordSearch !== 'all') {
        filters.keyword_search_id = selectedKeywordSearch;
      }
      if (selectedStatus !== 'all') {
        filters.status = selectedStatus;
      }

      const blob = await exportOpportunitiesCSV(filters);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'opportunities.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      showToast.success('Opportunities exported successfully');
    } catch (err: any) {
      console.error('Export failed:', err);
      const errorMessage = extractErrorMessage(err, 'Failed to export opportunities');
      showToast.error('Export failed', errorMessage);
    }
  };

  const clearFilters = () => {
    setSelectedKeywordSearch('all');
    setSelectedStatus('all');
    setSelectedSource('all');
    setSearchQuery('');
    setMinScore('');
    setMinRelevance('');
    setSortBy('score');
    setSortOrder('desc');
  };

  const hasActiveFilters = useMemo(() => {
    return selectedKeywordSearch !== 'all' || 
           selectedStatus !== 'all' || 
           selectedSource !== 'all' ||
           searchQuery.trim() !== '' ||
           minScore !== '' ||
           minRelevance !== '';
  }, [selectedKeywordSearch, selectedStatus, selectedSource, searchQuery, minScore, minRelevance]);

  // Get unique sources from opportunities
  const sources = useMemo(() => {
    return Array.from(new Set(opportunities.map(o => o.source))).sort();
  }, [opportunities]);

  // Calculate stats
  const stats = useMemo(() => {
    return {
      total: opportunities.length,
      new: opportunities.filter(o => o.status === 'new').length,
      contacted: opportunities.filter(o => o.status === 'contacted').length,
      won: opportunities.filter(o => o.status === 'won').length,
      avgScore: opportunities.length > 0
        ? (opportunities.reduce((sum, o) => sum + o.total_score, 0) / opportunities.length).toFixed(1)
        : '0.0',
      avgRelevance: opportunities.length > 0
        ? (opportunities.reduce((sum, o) => sum + o.relevance_score, 0) / opportunities.length * 100).toFixed(0)
        : '0',
    };
  }, [opportunities]);

  return (
    <div className="space-y-6 max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
            Opportunities
          </h1>
          <p className="text-sm text-gray-600">
            View and manage freelance opportunities from your keyword searches
          </p>
        </div>
        
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          <button
            onClick={handleExport}
            className="btn-outline inline-flex items-center justify-center text-sm px-3 py-2"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Active Job Progress */}
      {activeJob && (activeJob.status === 'pending' || activeJob.status === 'processing') && (() => {
        const startTime = localStorage.getItem('activeJobStartTime');
        const timeInfo = startTime ? getJobTimeInfo(startTime, activeJob.progress) : null;
        
        return (
          <div className="card bg-blue-50 border-blue-200">
            <div className="flex items-start">
              <Loader2 className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5 animate-spin" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-semibold text-blue-800">
                    Generating Opportunities
                  </h3>
                  {timeInfo && (
                    <span className="text-xs text-blue-600">
                      Started {timeInfo.elapsed.formatted}
                    </span>
                  )}
                </div>
                
                <p className="text-sm text-blue-600 mb-1">
                  {timeInfo ? timeInfo.stage : (activeJob.message || 'Processing...')}
                </p>
                
                {/* Check job message for cooldown info */}
                {activeJob.message && activeJob.message.toLowerCase().includes('cooldown') && (
                  <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-700">
                    ⏱️ {activeJob.message}
                  </div>
                )}
                
                <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${activeJob.progress}%` }}
                  />
                </div>
                
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-blue-500">{activeJob.progress}% complete</p>
                  {timeInfo && (
                    <p className="text-xs text-blue-500">
                      Estimated: {timeInfo.remaining.formatted} remaining
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Success Message */}
      {showSuccessMessage && (
        <SuccessMessage
          title={`${generatedCount} opportunities found!`}
          message="Start reviewing them to find your next client."
          nextStep={{
            label: 'Review Opportunities',
            href: '#',
            onClick: () => {
              setShowSuccessMessage(false);
              // Scroll to opportunities list
              window.scrollTo({ top: 600, behavior: 'smooth' });
            },
          }}
          onDismiss={() => setShowSuccessMessage(false)}
        />
      )}

      {/* Quick Actions Card */}
      <QuickActionsCard
        hasSearches={keywordSearches.length > 0}
        hasOpportunities={opportunities.length > 0}
        selectedSearchId={selectedKeywordSearch !== 'all' ? selectedKeywordSearch : undefined}
        onGenerateClick={handleGenerate}
      />

      {/* Cooldown Message */}
      {cooldownMessage && (
        <div className="card bg-yellow-50 border-yellow-200">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-yellow-800 mb-1">Cooldown Period</h3>
              <p className="text-sm text-yellow-700">{cooldownMessage}</p>
              <p className="text-xs text-yellow-600 mt-1">
                Opportunities will be generated from existing leads. Check back later to trigger a fresh scrape.
              </p>
            </div>
            <button
              onClick={() => setCooldownMessage(null)}
              className="text-yellow-600 hover:text-yellow-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="card bg-gradient-to-br from-blue-50 to-purple-50 p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-gray-600 mb-1 truncate">Total</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Briefcase className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 flex-shrink-0" />
          </div>
        </div>
        <div className="card bg-green-50 p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-gray-600 mb-1 truncate">New</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">{stats.new}</p>
            </div>
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full flex-shrink-0"></div>
          </div>
        </div>
        <div className="card bg-yellow-50 p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-gray-600 mb-1 truncate">Contacted</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">{stats.contacted}</p>
            </div>
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-yellow-500 rounded-full flex-shrink-0"></div>
          </div>
        </div>
        <div className="card bg-purple-50 p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-gray-600 mb-1 truncate">Won</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">{stats.won}</p>
            </div>
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-500 rounded-full flex-shrink-0"></div>
          </div>
        </div>
        <div className="card bg-blue-50 p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-gray-600 mb-1 truncate">Avg Score</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">{stats.avgScore}</p>
            </div>
            <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 flex-shrink-0" />
          </div>
        </div>
        <div className="card bg-indigo-50 p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-gray-600 mb-1 truncate">Avg Relevance</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">{stats.avgRelevance}%</p>
            </div>
            <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600 flex-shrink-0" />
          </div>
        </div>
      </div>

      {/* Workflow Progress Indicator */}
      <WorkflowProgress
        hasSearches={keywordSearches.length > 0}
        hasOpportunities={opportunities.length > 0}
        selectedSearchId={selectedKeywordSearch}
      />

      {/* Keyword Search Selector - Card-based */}
      <div className="card p-4 md:p-6">
        <KeywordSearchSelector
          searches={keywordSearches}
          selectedSearchId={selectedKeywordSearch}
          onSelect={setSelectedKeywordSearch}
        />
        
        {/* Generate Button Section - Below selector */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              {/* Force Refresh Toggle - Only show when search is selected */}
              {selectedKeywordSearch !== 'all' && (
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={forceRefresh}
                    onChange={(e) => setForceRefresh(e.target.checked)}
                    disabled={isGenerating || !!(activeJob && (activeJob.status === 'pending' || activeJob.status === 'processing'))}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <span className={`text-sm ${forceRefresh ? 'text-blue-600 font-medium' : 'text-gray-600'}`}>
                    Force Refresh
                  </span>
                </label>
              )}
              
              <button
                onClick={handleGenerate}
                disabled={
                  selectedKeywordSearch === 'all' ||
                  isGenerating ||
                  !!(activeJob && (activeJob.status === 'pending' || activeJob.status === 'processing'))
                }
                className="btn-primary inline-flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed text-sm px-4 py-2"
                title={
                  selectedKeywordSearch === 'all'
                    ? 'Select a keyword search first'
                    : forceRefresh
                    ? 'Force new scrape (respects cooldown period)'
                    : 'Generate from existing leads or scrape if none exist'
                }
                data-tour="generate-opportunities"
              >
                {isGenerating || (activeJob && (activeJob.status === 'pending' || activeJob.status === 'processing')) ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    <span className="hidden sm:inline">{activeJob ? 'Processing...' : 'Starting...'}</span>
                    <span className="sm:hidden">{activeJob ? 'Processing' : 'Starting'}</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Generate Opportunities</span>
                    <span className="sm:hidden">Generate</span>
                  </>
                )}
              </button>
            </div>
            
            {selectedKeywordSearch === 'all' && (
              <p className="text-xs text-gray-500 italic">
                Select a keyword search above to generate opportunities
              </p>
            )}
          </div>
        </div>
      </div>

      {/* CTA Banner */}
      <CTABanner
        hasSearches={keywordSearches.length > 0}
        hasOpportunities={opportunities.length > 0}
        selectedSearchId={selectedKeywordSearch}
        onGenerate={handleGenerate}
      />

      {/* Search and View Controls */}
      <div className="card p-3 sm:p-4 md:p-6">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="w-full">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search opportunities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center justify-center">
            <div className="inline-flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('card')}
                className={`px-3 py-2 rounded-md transition-colors text-sm font-medium ${
                  viewMode === 'card'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Card view - Full details"
              >
                <Grid3x3 className="w-4 h-4 mr-1.5 inline" />
                Card
              </button>
              <button
                onClick={() => setViewMode('compact')}
                className={`px-3 py-2 rounded-md transition-colors text-sm font-medium ${
                  viewMode === 'compact'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Compact view - Grid layout"
              >
                <Grid3x3 className="w-4 h-4 mr-1.5 inline" />
                Compact
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 rounded-md transition-colors text-sm font-medium ${
                  viewMode === 'list'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="List view - Minimal height"
              >
                <LayoutList className="w-4 h-4 mr-1.5 inline" />
                List
              </button>
            </div>
          </div>
        </div>

        {/* Advanced Filters */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-ghost inline-flex items-center"
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Advanced Filters
              {hasActiveFilters && (
                <span className="ml-2 px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">
                  Active
                </span>
              )}
            </button>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Clear all filters
              </button>
            )}
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Status Filter */}
              <div>
                <label className="form-label">Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as OpportunityStatus | 'all')}
                  className="input"
                >
                  <option value="all">All Statuses</option>
                  <option value="new">New</option>
                  <option value="viewed">Viewed</option>
                  <option value="contacted">Contacted</option>
                  <option value="applied">Applied</option>
                  <option value="rejected">Rejected</option>
                  <option value="won">Won</option>
                  <option value="lost">Lost</option>
                </select>
              </div>

              {/* Source Filter */}
              <div>
                <label className="form-label">Source</label>
                <select
                  value={selectedSource}
                  onChange={(e) => setSelectedSource(e.target.value)}
                  className="input"
                >
                  <option value="all">All Sources</option>
                  {sources.map((source) => (
                    <option key={source} value={source}>
                      {source.charAt(0).toUpperCase() + source.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="form-label">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortBy)}
                  className="input"
                >
                  <option value="score">Total Score</option>
                  <option value="relevance">Relevance</option>
                  <option value="urgency">Urgency</option>
                  <option value="date">Date</option>
                </select>
              </div>

              {/* Sort Order */}
              <div>
                <label className="form-label">Order</label>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                  className="input"
                >
                  <option value="desc">Descending</option>
                  <option value="asc">Ascending</option>
                </select>
              </div>

              {/* Min Score */}
              <div>
                <label className="form-label">Min Total Score (0-1)</label>
                <input
                  type="number"
                  min="0"
                  max="1"
                  step="0.1"
                  value={minScore}
                  onChange={(e) => setMinScore(e.target.value)}
                  placeholder="0.0"
                  className="input"
                />
              </div>

              {/* Min Relevance */}
              <div>
                <label className="form-label">Min Relevance (0-1)</label>
                <input
                  type="number"
                  min="0"
                  max="1"
                  step="0.1"
                  value={minRelevance}
                  onChange={(e) => setMinRelevance(e.target.value)}
                  placeholder="0.0"
                  className="input"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading opportunities...</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && opportunities.length === 0 && (
        <div className="card text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-8 h-8 text-gray-400" />
          </div>
          
          {keywordSearches.length === 0 ? (
            <>
              {/* No keyword searches exist */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Keyword Searches Yet
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Create a keyword search first, then generate opportunities. The workflow is simple: <strong>Create a search → Generate opportunities</strong>
              </p>
              <a
                href="/dashboard/keyword-searches"
                className="btn-primary inline-flex items-center"
              >
                <SearchIcon className="w-5 h-5 mr-2" />
                Create Keyword Search
              </a>
            </>
          ) : selectedKeywordSearch === 'all' ? (
            <>
              {/* Searches exist but none selected */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Select a Keyword Search
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                You have {keywordSearches.length} keyword search{keywordSearches.length !== 1 ? 'es' : ''} set up! Select one from above to generate opportunities.
              </p>
              <p className="text-sm text-gray-500">
                👆 Look for the keyword search cards above
              </p>
            </>
          ) : (
            <>
              {/* Search selected but no opportunities */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Opportunities Yet
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {hasActiveFilters
                  ? 'No opportunities match your current filters. Try adjusting your filters or generate new opportunities.'
                  : `Ready to generate opportunities from "${keywordSearches.find(s => s.id === selectedKeywordSearch)?.name || 'selected search'}"? Click the button below to start!`}
              </p>
              {!hasActiveFilters && (
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !!(activeJob && (activeJob.status === 'pending' || activeJob.status === 'processing'))}
                  className="btn-primary inline-flex items-center"
                >
                  {isGenerating || (activeJob && (activeJob.status === 'pending' || activeJob.status === 'processing')) ? (
                    <>
                      <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-5 h-5 mr-2" />
                      Generate Opportunities
                    </>
                  )}
                </button>
              )}
            </>
          )}
        </div>
      )}

      {/* Opportunities List */}
      {!isLoading && opportunities.length > 0 && (
        <div className={
          viewMode === 'card' 
            ? 'grid grid-cols-1 lg:grid-cols-2 gap-6'
            : viewMode === 'compact'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
            : 'space-y-3'
        }>
          {opportunities.map((opportunity) => (
            <ModernOpportunityCard
              key={opportunity.id}
              opportunity={opportunity}
              onUpdate={handleUpdate}
              viewMode={viewMode}
            />
          ))}
        </div>
      )}
    </div>
  );
}

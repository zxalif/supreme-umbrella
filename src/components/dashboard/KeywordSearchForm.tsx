'use client';

import { useState } from 'react';
import { Info } from 'lucide-react';
import { extractErrorMessage, extractFieldErrors } from '@/lib/utils/error-handler';
import { KeywordAutoComplete } from '@/components/forms/KeywordAutoComplete';
import { SubredditAutoComplete } from '@/components/forms/SubredditAutoComplete';
import type { KeywordSearch, KeywordSearchCreate } from '@/types/keyword-search';
import { MAX_KEYWORDS_PER_SEARCH, MAX_SUBREDDITS_PER_SEARCH } from '@/lib/constants/keyword-search';

interface KeywordSearchFormProps {
  search?: KeywordSearch | null;
  onSubmit: (data: KeywordSearchCreate) => Promise<void>;
  onCancel: () => void;
}

/**
 * Keyword Search Form Component
 * 
 * Form for creating/editing keyword searches
 */
export function KeywordSearchForm({
  search,
  onSubmit,
  onCancel,
}: KeywordSearchFormProps) {
  const [formData, setFormData] = useState<KeywordSearchCreate>({
    name: search?.name || '',
    keywords: search?.keywords || [],
    // patterns removed - handled by backend with defaults (internal logic, not exposed)
    subreddits: search?.subreddits || ['forhire', 'hiring', 'freelance'],
    platforms: search?.platforms || ['reddit'],
    enabled: search?.enabled ?? true,
    scraping_mode: search?.scraping_mode || 'one_time',
    scraping_interval: search?.scraping_interval || null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addKeyword = (keyword: string) => {
    if (formData.keywords.length >= MAX_KEYWORDS_PER_SEARCH) {
      setErrors({ keywords: `Maximum ${MAX_KEYWORDS_PER_SEARCH} keywords allowed per search` });
      return;
    }
    if (keyword.trim() && !formData.keywords.includes(keyword.trim())) {
      setFormData({
        ...formData,
        keywords: [...formData.keywords, keyword.trim()],
      });
      // Clear error if keyword was added successfully
      if (errors.keywords) {
        const { keywords, ...rest } = errors;
        setErrors(rest);
      }
    }
  };

  const removeKeyword = (keyword: string) => {
    setFormData({
      ...formData,
      keywords: formData.keywords.filter(k => k !== keyword),
    });
  };

  const addSubreddit = (subreddit: string) => {
    const currentSubreddits = formData.subreddits || [];
    if (currentSubreddits.length >= MAX_SUBREDDITS_PER_SEARCH) {
      setErrors({ subreddits: `Maximum ${MAX_SUBREDDITS_PER_SEARCH} subreddits allowed per search` });
      return;
    }
    const cleanSubreddit = subreddit.replace(/^r\//, '').trim();
    if (cleanSubreddit && !currentSubreddits.includes(cleanSubreddit)) {
      setFormData({
        ...formData,
        subreddits: [...currentSubreddits, cleanSubreddit],
      });
      // Clear error if subreddit was added successfully
      if (errors.subreddits) {
        const { subreddits, ...rest } = errors;
        setErrors(rest);
      }
    }
  };

  const removeSubreddit = (subreddit: string) => {
    setFormData({
      ...formData,
      subreddits: formData.subreddits?.filter(s => s !== subreddit) || [],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validation
    if (!formData.name.trim()) {
      setErrors({ name: 'Name is required' });
      return;
    }
    if (formData.keywords.length === 0) {
      setErrors({ keywords: 'At least one keyword is required' });
      return;
    }
    if (formData.keywords.length > MAX_KEYWORDS_PER_SEARCH) {
      setErrors({ keywords: `Maximum ${MAX_KEYWORDS_PER_SEARCH} keywords allowed per search` });
      return;
    }
    if (formData.subreddits && formData.subreddits.length > MAX_SUBREDDITS_PER_SEARCH) {
      setErrors({ subreddits: `Maximum ${MAX_SUBREDDITS_PER_SEARCH} subreddits allowed per search` });
      return;
    }
    
    // Validate scraping_mode
    if (formData.scraping_mode === 'scheduled' && !formData.scraping_interval) {
      setErrors({ scraping_interval: 'Scraping interval is required for scheduled mode' });
      return;
    }
    if (formData.scraping_interval && !['30m', '1h', '6h', '24h'].includes(formData.scraping_interval)) {
      setErrors({ scraping_interval: 'Invalid scraping interval. Must be one of: 30m, 1h, 6h, 24h' });
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error: any) {
      if (error?.data?.errors) {
        // Handle validation errors - extract string messages from objects
        setErrors(extractFieldErrors(error.data.errors));
      } else {
        setErrors({ general: extractErrorMessage(error, 'Failed to save search') });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" data-tour="keyword-search-form">
      {errors.general && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{errors.general}</p>
        </div>
      )}

      {/* Name */}
      <div>
        <label htmlFor="name" className="form-label">
          Search Name *
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className={`input ${errors.name ? 'input-error' : ''}`}
          placeholder="e.g., React Developers, Python Freelancers, Web Designers"
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          Give your search a descriptive name to easily identify it later
        </p>
        {errors.name && <p className="form-error">{errors.name}</p>}
      </div>

      {/* Keywords */}
      <div>
        <label className="form-label">Keywords *</label>
        <div className="mb-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start">
            <Info className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-blue-800">
              <p className="font-semibold mb-1">What skills or services are you looking for?</p>
              <p className="mb-1">Start typing to see suggestions, or browse popular keywords below.</p>
              <p>We'll search for posts containing these keywords on Reddit.</p>
              <p className="mt-1 font-medium">Maximum {MAX_KEYWORDS_PER_SEARCH} keywords per search.</p>
            </div>
          </div>
        </div>
        <KeywordAutoComplete
          selectedKeywords={formData.keywords}
          onAddKeyword={addKeyword}
          onRemoveKeyword={removeKeyword}
          placeholder="Type to search keywords (e.g., react developer, python, web designer)"
          error={errors.keywords}
        />
      </div>

      {/* Subreddits */}
      <div>
        <label className="form-label">Subreddits</label>
        <div className="mb-2 p-3 bg-purple-50 border border-purple-200 rounded-lg">
          <div className="flex items-start">
            <Info className="w-4 h-4 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-purple-800">
              <p className="font-semibold mb-1">Which Reddit communities to search?</p>
              <p className="mb-1">Start typing to see suggestions, or browse popular subreddits below.</p>
              <p>Leave empty to search all subreddits. We'll suggest relevant subreddits based on your keywords.</p>
              <p className="mt-1 font-medium">Maximum {MAX_SUBREDDITS_PER_SEARCH} subreddits per search.</p>
            </div>
          </div>
        </div>
        <SubredditAutoComplete
          selectedSubreddits={formData.subreddits || []}
          onAddSubreddit={addSubreddit}
          onRemoveSubreddit={removeSubreddit}
          relatedKeywords={formData.keywords}
          placeholder="Type to search subreddits (e.g., forhire, hiring, freelance)"
          error={errors.subreddits}
        />
      </div>

      {/* Scraping Mode */}
      <div>
        <label className="form-label">Scraping Mode</label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id="scraping_mode_one_time"
              name="scraping_mode"
              value="one_time"
              checked={formData.scraping_mode === 'one_time'}
              onChange={(e) => setFormData({ 
                ...formData, 
                scraping_mode: 'one_time' as const,
                scraping_interval: null // Clear interval when switching to one_time
              })}
              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <label htmlFor="scraping_mode_one_time" className="text-sm text-gray-700">
              One-time (manual) - Run when you click "Generate Opportunities"
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id="scraping_mode_scheduled"
              name="scraping_mode"
              value="scheduled"
              checked={formData.scraping_mode === 'scheduled'}
              onChange={(e) => setFormData({ 
                ...formData, 
                scraping_mode: 'scheduled' as const,
                scraping_interval: formData.scraping_interval || '1h' // Default to 1h if not set
              })}
              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <label htmlFor="scraping_mode_scheduled" className="text-sm text-gray-700">
              Scheduled - Automatically run at regular intervals
            </label>
          </div>
        </div>
        {formData.scraping_mode === 'scheduled' && (
          <div className="mt-3">
            <label htmlFor="scraping_interval" className="block text-sm font-medium text-gray-700 mb-1">
              Scraping Interval
            </label>
            <select
              id="scraping_interval"
              value={formData.scraping_interval || '1h'}
              onChange={(e) => setFormData({ ...formData, scraping_interval: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="30m">Every 30 minutes</option>
              <option value="1h">Every hour</option>
              <option value="6h">Every 6 hours</option>
              <option value="24h">Every 24 hours (daily)</option>
            </select>
            <p className="mt-1 text-xs text-gray-500">
              The search will automatically run at the selected interval to find new opportunities.
            </p>
          </div>
        )}
        {errors.scraping_mode && <p className="form-error mt-1">{errors.scraping_mode}</p>}
        {errors.scraping_interval && <p className="form-error mt-1">{errors.scraping_interval}</p>}
      </div>

      {/* Enabled */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="enabled"
          checked={formData.enabled}
          onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="enabled" className="text-sm text-gray-700">
          Enable search immediately
        </label>
      </div>

      {/* Actions */}
      <div className="flex space-x-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary flex-1"
        >
          {isSubmitting ? 'Saving...' : search ? 'Update Search' : 'Create Search'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="btn-outline"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}


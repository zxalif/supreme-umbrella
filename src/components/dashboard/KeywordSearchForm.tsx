'use client';

import { useState } from 'react';
import { Info } from 'lucide-react';
import { extractErrorMessage, extractFieldErrors } from '@/lib/utils/error-handler';
import { KeywordAutoComplete } from '@/components/forms/KeywordAutoComplete';
import { SubredditAutoComplete } from '@/components/forms/SubredditAutoComplete';
import type { KeywordSearch, KeywordSearchCreate } from '@/types/keyword-search';

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
    patterns: search?.patterns || ['looking for', 'need', 'hiring', 'want'],
    subreddits: search?.subreddits || ['forhire', 'hiring', 'freelance'],
    platforms: search?.platforms || ['reddit'],
    enabled: search?.enabled ?? true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addKeyword = (keyword: string) => {
    if (keyword.trim() && !formData.keywords.includes(keyword.trim())) {
      setFormData({
        ...formData,
        keywords: [...formData.keywords, keyword.trim()],
      });
    }
  };

  const removeKeyword = (keyword: string) => {
    setFormData({
      ...formData,
      keywords: formData.keywords.filter(k => k !== keyword),
    });
  };

  const addSubreddit = (subreddit: string) => {
    const cleanSubreddit = subreddit.replace(/^r\//, '').trim();
    if (cleanSubreddit && !formData.subreddits?.includes(cleanSubreddit)) {
      setFormData({
        ...formData,
        subreddits: [...(formData.subreddits || []), cleanSubreddit],
      });
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
            </div>
          </div>
        </div>
        <SubredditAutoComplete
          selectedSubreddits={formData.subreddits || []}
          onAddSubreddit={addSubreddit}
          onRemoveSubreddit={removeSubreddit}
          relatedKeywords={formData.keywords}
          placeholder="Type to search subreddits (e.g., forhire, hiring, freelance)"
        />
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


'use client';

import { useState } from 'react';
import { X, Plus, Trash2, Info } from 'lucide-react';
import { extractErrorMessage, extractFieldErrors } from '@/lib/utils/error-handler';
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

  const [newKeyword, setNewKeyword] = useState('');
  const [newSubreddit, setNewSubreddit] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addKeyword = () => {
    if (newKeyword.trim() && !formData.keywords.includes(newKeyword.trim())) {
      setFormData({
        ...formData,
        keywords: [...formData.keywords, newKeyword.trim()],
      });
      setNewKeyword('');
    }
  };

  const removeKeyword = (keyword: string) => {
    setFormData({
      ...formData,
      keywords: formData.keywords.filter(k => k !== keyword),
    });
  };

  const addSubreddit = () => {
    if (newSubreddit.trim() && !formData.subreddits?.includes(newSubreddit.trim())) {
      setFormData({
        ...formData,
        subreddits: [...(formData.subreddits || []), newSubreddit.trim()],
      });
      setNewSubreddit('');
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
    <form onSubmit={handleSubmit} className="space-y-6">
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
              <p className="mb-1">Examples: "react developer", "python", "web designer", "graphic designer", "copywriter"</p>
              <p>We'll search for posts containing these keywords on Reddit.</p>
            </div>
          </div>
        </div>
        <div className="flex space-x-2 mb-2">
          <input
            type="text"
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addKeyword();
              }
            }}
            className="input flex-1"
            placeholder="e.g., react developer, python, web designer"
          />
          <button
            type="button"
            onClick={addKeyword}
            className="btn-outline"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.keywords.map((keyword, idx) => (
            <span
              key={idx}
              className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-md text-sm"
            >
              <span>{keyword}</span>
              <button
                type="button"
                onClick={() => removeKeyword(keyword)}
                className="hover:text-blue-900"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
        {errors.keywords && <p className="form-error">{errors.keywords}</p>}
      </div>

      {/* Subreddits */}
      <div>
        <label className="form-label">Subreddits</label>
        <div className="mb-2 p-3 bg-purple-50 border border-purple-200 rounded-lg">
          <div className="flex items-start">
            <Info className="w-4 h-4 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-purple-800">
              <p className="font-semibold mb-1">Which Reddit communities to search?</p>
              <p className="mb-1">Examples: "forhire", "hiring", "freelance", "workonline", "slavelabour"</p>
              <p>Leave empty to search all subreddits. Enter without "r/" prefix.</p>
            </div>
          </div>
        </div>
        <div className="flex space-x-2 mb-2">
          <input
            type="text"
            value={newSubreddit}
            onChange={(e) => setNewSubreddit(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addSubreddit();
              }
            }}
            className="input flex-1"
            placeholder="e.g., forhire, hiring, freelance (without r/)"
          />
          <button
            type="button"
            onClick={addSubreddit}
            className="btn-outline"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.subreddits?.map((subreddit, idx) => (
            <span
              key={idx}
              className="inline-flex items-center space-x-1 px-3 py-1 bg-purple-50 text-purple-700 rounded-md text-sm"
            >
              <span>r/{subreddit}</span>
              <button
                type="button"
                onClick={() => removeSubreddit(subreddit)}
                className="hover:text-purple-900"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
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


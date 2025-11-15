'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { X, Plus, ChevronUp } from 'lucide-react';
import { MAX_SUBREDDITS_PER_SEARCH } from '@/lib/constants/keyword-search';
import { 
  SUBREDDIT_CATEGORIES, 
  searchSubreddits, 
  getPopularSubreddits,
  getSubredditsForKeyword,
  type SubredditSuggestion 
} from '@/data/subredditSuggestions';

interface DropdownPosition {
  top: number;
  left: number;
  width: number;
}

interface SubredditAutoCompleteProps {
  selectedSubreddits: string[];
  onAddSubreddit: (subreddit: string) => void;
  onRemoveSubreddit: (subreddit: string) => void;
  relatedKeywords?: string[]; // Keywords to suggest related subreddits
  placeholder?: string;
  error?: string;
}

/**
 * Subreddit Auto-Complete Component
 * 
 * Provides auto-complete suggestions for subreddits with:
 * - Category grouping
 * - Keyboard navigation
 * - Popular subreddits when empty
 * - Related subreddits based on keywords
 */
export function SubredditAutoComplete({
  selectedSubreddits,
  onAddSubreddit,
  onRemoveSubreddit,
  relatedKeywords = [],
  placeholder = 'e.g., forhire, hiring, freelance (without r/)',
  error,
}: SubredditAutoCompleteProps) {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [suggestions, setSuggestions] = useState<SubredditSuggestion[]>([]);
  const [groupedSuggestions, setGroupedSuggestions] = useState<Record<string, SubredditSuggestion[]>>({});
  const [dropdownPosition, setDropdownPosition] = useState<DropdownPosition | null>(null);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const suggestionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Load suggestions based on input and related keywords
  useEffect(() => {
    if (inputValue.trim()) {
      // Search subreddits
      const results = searchSubreddits(inputValue, 30);
      setSuggestions(results);
      
      // Group by category
      const grouped: Record<string, SubredditSuggestion[]> = {};
      results.forEach(subreddit => {
        if (!grouped[subreddit.category]) {
          grouped[subreddit.category] = [];
        }
        grouped[subreddit.category].push(subreddit);
      });
      setGroupedSuggestions(grouped);
    } else if (relatedKeywords.length > 0) {
      // Show related subreddits based on keywords
      const related: SubredditSuggestion[] = [];
      relatedKeywords.forEach(keyword => {
        const subreddits = getSubredditsForKeyword(keyword);
        related.push(...subreddits);
      });
      
      // Remove duplicates and sort by popularity
      const unique = Array.from(
        new Map(related.map(s => [s.name, s])).values()
      ).sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
      
      setSuggestions(unique.slice(0, 20));
      
      const grouped: Record<string, SubredditSuggestion[]> = {};
      unique.slice(0, 20).forEach(subreddit => {
        if (!grouped[subreddit.category]) {
          grouped[subreddit.category] = [];
        }
        grouped[subreddit.category].push(subreddit);
      });
      setGroupedSuggestions(grouped);
    } else {
      // Show popular subreddits when empty
      const popular = getPopularSubreddits(20);
      setSuggestions(popular);
      
      const grouped: Record<string, SubredditSuggestion[]> = {};
      popular.forEach(subreddit => {
        if (!grouped[subreddit.category]) {
          grouped[subreddit.category] = [];
        }
        grouped[subreddit.category].push(subreddit);
      });
      setGroupedSuggestions(grouped);
    }
  }, [inputValue, relatedKeywords]);

  // Filter out already selected subreddits
  const filteredSuggestions = suggestions.filter(
    sub => !selectedSubreddits.includes(sub.name)
  );

  const filteredGrouped: Record<string, SubredditSuggestion[]> = {};
  Object.keys(groupedSuggestions).forEach(category => {
    const filtered = groupedSuggestions[category].filter(
      sub => !selectedSubreddits.includes(sub.name)
    );
    if (filtered.length > 0) {
      filteredGrouped[category] = filtered;
    }
  });

  // Get category info
  const getCategoryInfo = (categoryId: string) => {
    return SUBREDDIT_CATEGORIES.find(cat => cat.id === categoryId);
  };

  // Calculate dropdown position based on input element
  // Use requestAnimationFrame to batch DOM reads and avoid forced reflows
  const updateDropdownPosition = useCallback(() => {
    if (inputRef.current) {
      // Batch DOM read in requestAnimationFrame to avoid forced reflow
      requestAnimationFrame(() => {
        if (inputRef.current) {
          const rect = inputRef.current.getBoundingClientRect();
          setDropdownPosition({
            top: rect.bottom + window.scrollY + 4,
            left: rect.left + window.scrollX,
            width: rect.width,
          });
        }
      });
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/^r\//, ''); // Remove r/ prefix if user types it
    setInputValue(value);
    updateDropdownPosition();
    setShowSuggestions(true);
    setSelectedIndex(-1);
  };

  const handleInputFocus = () => {
    updateDropdownPosition();
    setShowSuggestions(true);
  };

  const handleInputBlur = (e: React.FocusEvent) => {
    // Don't close if clicking on dropdown
    if (dropdownRef.current?.contains(e.relatedTarget as Node)) {
      return;
    }
    setTimeout(() => setShowSuggestions(false), 200);
  };

  const handleSelectSubreddit = (subreddit: string) => {
    const cleanSubreddit = subreddit.replace(/^r\//, '').trim();
    if (cleanSubreddit && !selectedSubreddits.includes(cleanSubreddit)) {
      onAddSubreddit(cleanSubreddit);
      setInputValue('');
      setShowSuggestions(false);
      setSelectedIndex(-1);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || filteredSuggestions.length === 0) {
      if (e.key === 'Enter' && inputValue.trim()) {
        e.preventDefault();
        handleSelectSubreddit(inputValue.trim());
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredSuggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < filteredSuggestions.length) {
          handleSelectSubreddit(filteredSuggestions[selectedIndex].name);
        } else if (inputValue.trim()) {
          handleSelectSubreddit(inputValue.trim());
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  // Update dropdown position on scroll/resize
  useEffect(() => {
    if (showSuggestions) {
      updateDropdownPosition();
      
      const handleScroll = () => updateDropdownPosition();
      const handleResize = () => updateDropdownPosition();
      
      window.addEventListener('scroll', handleScroll, true);
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('scroll', handleScroll, true);
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [showSuggestions, updateDropdownPosition]);

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && suggestionRefs.current[selectedIndex]) {
      suggestionRefs.current[selectedIndex]?.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      });
    }
  }, [selectedIndex]);

  return (
    <div className="relative">
      {/* Input Field */}
      <div className="flex space-x-2 mb-2">
        <div className="relative flex-1">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
            r/
          </div>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onKeyDown={handleKeyDown}
            className={`input pl-8 ${error ? 'input-error' : ''}`}
            placeholder={placeholder}
            disabled={selectedSubreddits.length >= MAX_SUBREDDITS_PER_SEARCH}
          />
          {showSuggestions && filteredSuggestions.length > 0 && (
            <button
              type="button"
              onClick={() => setShowSuggestions(false)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={() => {
            if (inputValue.trim()) {
              handleSelectSubreddit(inputValue.trim());
            }
          }}
          className="btn-outline"
          disabled={!inputValue.trim() || selectedSubreddits.length >= MAX_SUBREDDITS_PER_SEARCH}
          title={selectedSubreddits.length >= MAX_SUBREDDITS_PER_SEARCH ? `Maximum ${MAX_SUBREDDITS_PER_SEARCH} subreddits allowed` : 'Add subreddit'}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && filteredSuggestions.length > 0 && dropdownPosition && (
        <div
          ref={dropdownRef}
          className="fixed z-[9999] bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto"
          style={{
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
            width: `${dropdownPosition.width}px`,
          }}
        >
          {relatedKeywords.length > 0 && !inputValue && (
            <div className="sticky top-0 bg-blue-50 px-3 py-2 border-b border-blue-200">
              <p className="text-xs font-semibold text-blue-700">
                💡 Suggested based on your keywords
              </p>
            </div>
          )}
          
          {Object.keys(filteredGrouped).map((categoryId) => {
            const category = getCategoryInfo(categoryId);
            if (!category) return null;

            return (
              <div key={categoryId} className="border-b border-gray-100 last:border-b-0">
                {/* Category Header */}
                <div className="sticky top-0 bg-gray-50 px-3 py-2 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{category.icon}</span>
                    <span className="text-xs font-semibold text-gray-700 uppercase">
                      {category.name}
                    </span>
                  </div>
                </div>

                {/* Category Suggestions */}
                <div className="py-1">
                  {filteredGrouped[categoryId].map((subreddit, idx) => {
                    const globalIndex = filteredSuggestions.findIndex(
                      s => s.name === subreddit.name
                    );
                    const isSelected = globalIndex === selectedIndex;

                    return (
                      <button
                        key={subreddit.name}
                        ref={(el) => {
                          suggestionRefs.current[globalIndex] = el;
                        }}
                        type="button"
                        onClick={() => handleSelectSubreddit(subreddit.name)}
                        className={`w-full text-left px-4 py-2 hover:bg-purple-50 transition-colors ${
                          isSelected ? 'bg-purple-50' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-gray-900">
                                r/{subreddit.name}
                              </span>
                              {subreddit.popularity && subreddit.popularity >= 8 && (
                                <span className="text-xs px-1.5 py-0.5 bg-green-100 text-green-700 rounded">
                                  Popular
                                </span>
                              )}
                            </div>
                            {subreddit.description && (
                              <p className="text-xs text-gray-500 mt-0.5">
                                {subreddit.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-600 mb-2">{error}</p>
      )}

      {/* Selected Subreddits */}
      {selectedSubreddits.length > 0 && (
        <div className="mb-2 text-xs text-gray-500">
          {selectedSubreddits.length} / {MAX_SUBREDDITS_PER_SEARCH} subreddits
        </div>
      )}
      {selectedSubreddits.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedSubreddits.map((subreddit, idx) => (
            <span
              key={idx}
              className="inline-flex items-center space-x-1 px-3 py-1 bg-purple-50 text-purple-700 rounded-md text-sm"
            >
              <span>r/{subreddit}</span>
              <button
                type="button"
                onClick={() => onRemoveSubreddit(subreddit)}
                className="hover:text-purple-900"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Popular Subreddits Section (when input is empty and no subreddits selected) */}
      {!inputValue && selectedSubreddits.length === 0 && !showSuggestions && (
        <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-xs font-semibold text-gray-700 mb-2">Popular Subreddits</p>
          <div className="flex flex-wrap gap-2">
            {getPopularSubreddits(8).map((subreddit) => (
              <button
                key={subreddit.name}
                type="button"
                onClick={() => handleSelectSubreddit(subreddit.name)}
                className="px-2 py-1 text-xs bg-white border border-gray-200 rounded hover:bg-purple-50 hover:border-purple-300 transition-colors"
              >
                r/{subreddit.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


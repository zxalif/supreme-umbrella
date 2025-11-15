'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { X, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { MAX_KEYWORDS_PER_SEARCH } from '@/lib/constants/keyword-search';
import { 
  KEYWORD_CATEGORIES, 
  searchKeywords, 
  getPopularKeywords,
  type KeywordSuggestion 
} from '@/data/keywordSuggestions';

interface DropdownPosition {
  top: number;
  left: number;
  width: number;
}

interface KeywordAutoCompleteProps {
  selectedKeywords: string[];
  onAddKeyword: (keyword: string) => void;
  onRemoveKeyword: (keyword: string) => void;
  placeholder?: string;
  error?: string;
}

/**
 * Keyword Auto-Complete Component
 * 
 * Provides auto-complete suggestions for keywords with:
 * - Category grouping
 * - Keyboard navigation
 * - Popular keywords when empty
 * - Filter as user types
 */
export function KeywordAutoComplete({
  selectedKeywords,
  onAddKeyword,
  onRemoveKeyword,
  placeholder = 'e.g., react developer, python, web designer',
  error,
}: KeywordAutoCompleteProps) {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [suggestions, setSuggestions] = useState<KeywordSuggestion[]>([]);
  const [groupedSuggestions, setGroupedSuggestions] = useState<Record<string, KeywordSuggestion[]>>({});
  const [dropdownPosition, setDropdownPosition] = useState<DropdownPosition | null>(null);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const suggestionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Load suggestions based on input
  useEffect(() => {
    if (inputValue.trim()) {
      // Search keywords
      const results = searchKeywords(inputValue, 30);
      setSuggestions(results);
      
      // Group by category
      const grouped: Record<string, KeywordSuggestion[]> = {};
      results.forEach(keyword => {
        if (!grouped[keyword.category]) {
          grouped[keyword.category] = [];
        }
        grouped[keyword.category].push(keyword);
      });
      setGroupedSuggestions(grouped);
    } else {
      // Show popular keywords when empty
      const popular = getPopularKeywords(20);
      setSuggestions(popular);
      
      const grouped: Record<string, KeywordSuggestion[]> = {};
      popular.forEach(keyword => {
        if (!grouped[keyword.category]) {
          grouped[keyword.category] = [];
        }
        grouped[keyword.category].push(keyword);
      });
      setGroupedSuggestions(grouped);
    }
  }, [inputValue]);

  // Filter out already selected keywords
  const filteredSuggestions = suggestions.filter(
    kw => !selectedKeywords.includes(kw.keyword)
  );

  const filteredGrouped: Record<string, KeywordSuggestion[]> = {};
  Object.keys(groupedSuggestions).forEach(category => {
    const filtered = groupedSuggestions[category].filter(
      kw => !selectedKeywords.includes(kw.keyword)
    );
    if (filtered.length > 0) {
      filteredGrouped[category] = filtered;
    }
  });

  // Get category info
  const getCategoryInfo = (categoryId: string) => {
    return KEYWORD_CATEGORIES.find(cat => cat.id === categoryId);
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
    setInputValue(e.target.value);
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

  const handleSelectKeyword = (keyword: string) => {
    if (!selectedKeywords.includes(keyword)) {
      onAddKeyword(keyword);
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
        handleSelectKeyword(inputValue.trim());
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
          handleSelectKeyword(filteredSuggestions[selectedIndex].keyword);
        } else if (inputValue.trim()) {
          handleSelectKeyword(inputValue.trim());
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
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onKeyDown={handleKeyDown}
            className={`input ${error ? 'input-error' : ''}`}
            placeholder={placeholder}
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
              handleSelectKeyword(inputValue.trim());
            }
          }}
          className="btn-outline"
          disabled={!inputValue.trim() || selectedKeywords.length >= MAX_KEYWORDS_PER_SEARCH}
          title={selectedKeywords.length >= MAX_KEYWORDS_PER_SEARCH ? `Maximum ${MAX_KEYWORDS_PER_SEARCH} keywords allowed` : 'Add keyword'}
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
                  {filteredGrouped[categoryId].map((keyword, idx) => {
                    const globalIndex = filteredSuggestions.findIndex(
                      k => k.keyword === keyword.keyword
                    );
                    const isSelected = globalIndex === selectedIndex;

                    return (
                      <button
                        key={keyword.keyword}
                        ref={(el) => {
                          suggestionRefs.current[globalIndex] = el;
                        }}
                        type="button"
                        onClick={() => handleSelectKeyword(keyword.keyword)}
                        className={`w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors ${
                          isSelected ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-900">{keyword.keyword}</span>
                          {keyword.popularity && keyword.popularity >= 8 && (
                            <span className="text-xs text-gray-400">Popular</span>
                          )}
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

      {/* Selected Keywords */}
      {selectedKeywords.length > 0 && (
        <div className="mb-2 text-xs text-gray-500">
          {selectedKeywords.length} / {MAX_KEYWORDS_PER_SEARCH} keywords
        </div>
      )}
      {selectedKeywords.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedKeywords.map((keyword, idx) => (
            <span
              key={idx}
              className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-md text-sm"
            >
              <span>{keyword}</span>
              <button
                type="button"
                onClick={() => onRemoveKeyword(keyword)}
                className="hover:text-blue-900"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Popular Keywords Section (when input is empty and no keywords selected) */}
      {!inputValue && selectedKeywords.length === 0 && !showSuggestions && (
        <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-xs font-semibold text-gray-700 mb-2">Popular Keywords</p>
          <div className="flex flex-wrap gap-2">
            {getPopularKeywords(8).map((keyword) => (
              <button
                key={keyword.keyword}
                type="button"
                onClick={() => handleSelectKeyword(keyword.keyword)}
                className="px-2 py-1 text-xs bg-white border border-gray-200 rounded hover:bg-blue-50 hover:border-blue-300 transition-colors"
              >
                {keyword.keyword}
              </button>
            ))}
          </div>
        </div>
      )}

      {error && <p className="form-error mt-1">{error}</p>}
    </div>
  );
}


'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Edit, 
  Trash2, 
  Play, 
  Pause, 
  ExternalLink,
  Tag,
  Hash
} from 'lucide-react';
import type { KeywordSearch } from '@/types/keyword-search';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

interface KeywordSearchCardProps {
  search: KeywordSearch;
  onEdit: (search: KeywordSearch) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string, enabled: boolean) => void;
}

/**
 * Keyword Search Card Component
 * 
 * Displays a keyword search with actions
 */
export function KeywordSearchCard({
  search,
  onEdit,
  onDelete,
  onToggle,
}: KeywordSearchCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await onDelete(search.id);
      setShowDeleteDialog(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className={`card-hover ${!search.enabled ? 'opacity-75' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              search.enabled 
                ? 'bg-gradient-to-br from-blue-500 to-purple-500' 
                : 'bg-gray-300'
            }`}>
              <Search className={`w-5 h-5 ${search.enabled ? 'text-white' : 'text-gray-600'}`} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {search.name}
              </h3>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  search.enabled
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {search.enabled ? 'Active' : 'Paused'}
                </span>
                <span className="text-sm text-gray-500">
                  {search.platforms.join(', ')}
                </span>
              </div>
            </div>
          </div>

          {/* Keywords */}
          <div className="mb-3">
            <div className="flex items-center space-x-1 mb-2">
              <Tag className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Keywords:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {search.keywords.slice(0, 5).map((keyword, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium"
                >
                  {keyword}
                </span>
              ))}
              {search.keywords.length > 5 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs">
                  +{search.keywords.length - 5} more
                </span>
              )}
            </div>
          </div>

          {/* Subreddits */}
          {search.subreddits.length > 0 && (
            <div className="mb-3">
              <div className="flex items-center space-x-1 mb-2">
                <Hash className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Subreddits:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {search.subreddits.map((subreddit, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-purple-50 text-purple-700 rounded-md text-xs"
                  >
                    r/{subreddit}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Created date */}
          <p className="text-xs text-gray-500">
            Created {new Date(search.created_at).toLocaleDateString()}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col space-y-2 ml-4">
          <button
            onClick={() => onToggle(search.id, !search.enabled)}
            className={`p-2 rounded-lg transition-colors ${
              search.enabled
                ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'
                : 'bg-green-50 text-green-600 hover:bg-green-100'
            }`}
            title={search.enabled ? 'Pause search' : 'Resume search'}
          >
            {search.enabled ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={() => onEdit(search)}
            className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
            title="Edit search"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={handleDeleteClick}
            disabled={isDeleting}
            className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50"
            title="Delete search"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <Link
            href={`/dashboard/opportunities?keyword_search_id=${search.id}`}
            className="p-2 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors"
            title="View opportunities"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Keyword Search"
        message={`Are you sure you want to delete "${search.name}"? This action cannot be undone and all associated opportunities will be preserved.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}


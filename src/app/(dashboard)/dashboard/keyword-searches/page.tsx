'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Plus, Search, AlertCircle } from 'lucide-react';
import { KeywordSearchCard } from '@/components/dashboard/KeywordSearchCard';
import { KeywordSearchForm } from '@/components/dashboard/KeywordSearchForm';
import {
  listKeywordSearches,
  createKeywordSearch,
  updateKeywordSearch,
  deleteKeywordSearch,
} from '@/lib/api/keyword-searches';
import type { KeywordSearch, KeywordSearchCreate } from '@/types/keyword-search';
import { ApiClientError, extractErrorMessage } from '@/lib/api/client';

/**
 * Keyword Searches Page
 * 
 * Manage keyword searches for opportunity generation
 */
export default function KeywordSearchesPage() {
  const searchParams = useSearchParams();
  const [searches, setSearches] = useState<KeywordSearch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSearch, setEditingSearch] = useState<KeywordSearch | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'paused'>('all');

  useEffect(() => {
    loadSearches();
    // Check if we should show the form (from query parameter or if no searches exist)
    const shouldShowForm = searchParams?.get('new') === 'true';
    if (shouldShowForm) {
      setShowForm(true);
    }
  }, [searchParams]);

  const loadSearches = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const enabled = filter === 'all' ? undefined : filter === 'active';
      const data = await listKeywordSearches(enabled);
      setSearches(data);
    } catch (err: any) {
      setError(extractErrorMessage(err, 'Failed to load keyword searches'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSearches();
  }, [filter]);

  const handleCreate = async (data: KeywordSearchCreate) => {
    try {
      const newSearch = await createKeywordSearch(data);
      setSearches([...searches, newSearch]);
      setShowForm(false);
      setError(null);
    } catch (err: any) {
      if (err instanceof ApiClientError) {
        if (err.status === 402) {
          setError(err.data.detail || 'Keyword search limit reached. Please disable or delete an existing search.');
        } else {
          setError(extractErrorMessage(err, 'Failed to create keyword search'));
        }
        throw err;
      }
      throw err;
    }
  };

  const handleUpdate = async (data: KeywordSearchCreate) => {
    if (!editingSearch) return;
    
    try {
      const updated = await updateKeywordSearch(editingSearch.id, data);
      setSearches(searches.map(s => s.id === updated.id ? updated : s));
      setEditingSearch(null);
      setError(null);
    } catch (err: any) {
      setError(extractErrorMessage(err, 'Failed to update keyword search'));
      throw err;
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteKeywordSearch(id);
      setSearches(searches.filter(s => s.id !== id));
      setError(null);
    } catch (err: any) {
      if (err instanceof ApiClientError) {
        setError(extractErrorMessage(err.data) || 'Failed to delete keyword search');
      } else {
        setError(extractErrorMessage(err) || 'Failed to delete keyword search');
      }
      throw err;
    }
  };

  const handleToggle = async (id: string, enabled: boolean) => {
    try {
      const search = searches.find(s => s.id === id);
      if (!search) return;
      
      const updated = await updateKeywordSearch(id, { enabled });
      setSearches(searches.map(s => s.id === id ? updated : s));
      setError(null);
    } catch (err: any) {
      setError(extractErrorMessage(err, 'Failed to update keyword search'));
    }
  };

  const handleEdit = (search: KeywordSearch) => {
    setEditingSearch(search);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingSearch(null);
    setError(null);
  };

  const filteredSearches = searches.filter(search => {
    if (filter === 'all') return true;
    if (filter === 'active') return search.enabled;
    if (filter === 'paused') return !search.enabled;
    return true;
  });

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">
            {editingSearch ? 'Edit Keyword Search' : 'Create Keyword Search'}
          </h1>
        </div>

        <div className="card max-w-3xl">
          <KeywordSearchForm
            search={editingSearch}
            onSubmit={editingSearch ? handleUpdate : handleCreate}
            onCancel={handleCancel}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Keyword Searches
          </h1>
          <p className="text-gray-600">
            Create and manage keyword searches to find freelance opportunities
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary inline-flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Search
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="card bg-red-50 border-red-200">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-red-800 mb-1">Error</h3>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'all'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All ({searches.length})
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'active'
              ? 'bg-green-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Active ({searches.filter(s => s.enabled).length})
        </button>
        <button
          onClick={() => setFilter('paused')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'paused'
              ? 'bg-yellow-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Paused ({searches.filter(s => !s.enabled).length})
        </button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading keyword searches...</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredSearches.length === 0 && (
        <div className="card text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {filter === 'all' ? 'No keyword searches yet' : `No ${filter} searches`}
          </h3>
          <p className="text-gray-600 mb-6">
            {filter === 'all'
              ? 'Create your first keyword search to start finding opportunities'
              : `You don't have any ${filter} keyword searches`}
          </p>
          {filter === 'all' && (
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary inline-flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Your First Search
            </button>
          )}
        </div>
      )}

      {/* Searches Grid */}
      {!isLoading && filteredSearches.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredSearches.map((search) => (
            <KeywordSearchCard
              key={search.id}
              search={search}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggle={handleToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}


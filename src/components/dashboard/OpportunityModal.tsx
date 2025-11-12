'use client';

import { useState, useEffect } from 'react';
import { Portal } from '@/components/ui/Portal';
import { showToast } from '@/components/ui/Toast';
import { Loader2 } from 'lucide-react';
import { 
  X, 
  ExternalLink, 
  Calendar, 
  MapPin, 
  DollarSign, 
  Clock, 
  User, 
  Tag, 
  TrendingUp,
  Copy,
  Share2,
  Mail,
  FileText,
  Briefcase,
  Star,
  AlertCircle,
  CheckCircle,
  Eye,
  MessageSquare,
  Link as LinkIcon
} from 'lucide-react';
import type { Opportunity, OpportunityStatus } from '@/types/opportunity';

interface OpportunityModalProps {
  opportunity: Opportunity;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: string, status: OpportunityStatus, notes?: string) => void;
}

const statusConfig = {
  new: { color: 'bg-primary-500', label: 'New', icon: Clock },
  viewed: { color: 'bg-secondary-500', label: 'Viewed', icon: Eye },
  contacted: { color: 'bg-accent-500', label: 'Contacted', icon: Mail },
  applied: { color: 'bg-blue-500', label: 'Applied', icon: FileText },
  rejected: { color: 'bg-red-500', label: 'Rejected', icon: X },
  won: { color: 'bg-green-500', label: 'Won', icon: CheckCircle },
  lost: { color: 'bg-gray-500', label: 'Lost', icon: AlertCircle }
};

export function OpportunityModal({ opportunity, isOpen, onClose, onUpdate }: OpportunityModalProps) {
  const [notes, setNotes] = useState(opportunity.notes || '');
  const [selectedStatus, setSelectedStatus] = useState<OpportunityStatus>(opportunity.status);
  const [copied, setCopied] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Sync notes and status when opportunity changes
  useEffect(() => {
    if (isOpen) {
      setNotes(opportunity.notes || '');
      setSelectedStatus(opportunity.status);
    }
  }, [opportunity, isOpen]);

  // Handle modal animation and body scroll lock
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      document.body.style.overflow = 'hidden';
      
      // Handle escape key
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      
      document.addEventListener('keydown', handleEscape);
      
      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = 'unset';
      };
    } else {
      setIsAnimating(false);
      document.body.style.overflow = 'unset';
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleStatusUpdate = async () => {
    // Check if anything actually changed
    const statusChanged = selectedStatus !== opportunity.status;
    const notesChanged = notes !== (opportunity.notes || '');
    
    if (!statusChanged && !notesChanged) {
      // Nothing changed, just close
      onClose();
      return;
    }

    setIsUpdating(true);
    try {
      await onUpdate(opportunity.id, selectedStatus, notes);
      showToast.success('Opportunity updated successfully');
      onClose();
    } catch (error) {
      console.error('Failed to update opportunity:', error);
      showToast.error('Failed to update opportunity', 'Please try again');
      // Don't close modal on error so user can retry
    } finally {
      setIsUpdating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const extractedInfo = opportunity.extracted_info || {};
  const budget = extractedInfo.budget;
  const timeline = extractedInfo.timeline;
  const requirements = extractedInfo.requirements || [];
  const location = extractedInfo.location;

  return (
    <Portal>
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[10000]"
        style={{ pointerEvents: 'auto' }}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        <div 
          className={`bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col transform transition-all duration-300 ${
            isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
        {/* Header - Fixed */}
        <div className="flex items-start justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className={`px-3 py-1 rounded-full text-white text-sm font-medium ${statusConfig[opportunity.status].color}`}>
                {statusConfig[opportunity.status].label}
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Star className="w-4 h-4 text-yellow-500" />
                <span>{Math.round(opportunity.total_score * 100)}% Match</span>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{opportunity.title}</h2>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>u/{opportunity.author}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date(opportunity.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <LinkIcon className="w-4 h-4" />
                <span className="capitalize">{opportunity.source}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Key Information Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {budget && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-green-900">Budget</span>
                  </div>
                  <p className="text-green-800">{budget}</p>
                </div>
              )}
              
              {timeline && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold text-blue-900">Timeline</span>
                  </div>
                  <p className="text-blue-800">{timeline}</p>
                </div>
              )}
              
              {location && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-5 h-5 text-purple-600" />
                    <span className="font-semibold text-purple-900">Location</span>
                  </div>
                  <p className="text-purple-800">{location}</p>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Full Description
              </h3>
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {opportunity.content}
                </p>
              </div>
            </div>

            {/* Matched Keywords */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Tag className="w-5 h-5" />
                Matched Keywords
              </h3>
              <div className="flex flex-wrap gap-2">
                {opportunity.matched_keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>

            {/* Requirements */}
            {requirements.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Requirements
                </h3>
                <ul className="space-y-2">
                  {requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* AI Scores */}
            <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                AI Analysis
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">
                    {Math.round(opportunity.relevance_score * 100)}%
                  </div>
                  <div className="text-sm text-gray-600">Relevance</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary-600">
                    {Math.round(opportunity.urgency_score * 100)}%
                  </div>
                  <div className="text-sm text-gray-600">Urgency</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent-600">
                    {Math.round(opportunity.total_score * 100)}%
                  </div>
                  <div className="text-sm text-gray-600">Overall</div>
                </div>
              </div>
            </div>

            {/* Notes Section */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Notes</h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add your notes about this opportunity..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                rows={4}
              />
            </div>

            {/* Status Update */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Update Status</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {Object.entries(statusConfig).map(([status, config]) => {
                  const Icon = config.icon;
                  return (
                    <button
                      key={status}
                      onClick={() => setSelectedStatus(status as OpportunityStatus)}
                      className={`p-3 rounded-lg border-2 transition-all flex items-center gap-2 ${
                        selectedStatus === status
                          ? `${config.color} text-white border-transparent`
                          : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{config.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Fixed */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => copyToClipboard(opportunity.url)}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Copy className="w-4 h-4" />
              <span className="text-sm">{copied ? 'Copied!' : 'Copy URL'}</span>
            </button>
            <a
              href={opportunity.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="text-sm">View Original</span>
            </a>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              disabled={isUpdating}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleStatusUpdate}
              disabled={isUpdating}
              className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isUpdating && <Loader2 className="w-4 h-4 animate-spin" />}
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
        </div>
      </div>
    </Portal>
  );
}

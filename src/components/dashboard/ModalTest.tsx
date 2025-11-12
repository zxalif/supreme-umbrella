'use client';

import { useState } from 'react';
import { OpportunityModal } from './OpportunityModal';
import type { Opportunity } from '@/types/opportunity';

// Mock opportunity data for testing
const mockOpportunity: Opportunity = {
  id: 'test-1',
  keyword_search_id: 'search-1',
  source_post_id: 'post-1',
  source: 'reddit',
  source_type: 'post',
  title: 'Need React Developer for E-commerce Site',
  content: 'Looking for an experienced React developer to build a modern e-commerce platform. Must have experience with Next.js, TypeScript, and Tailwind CSS. Budget is $5000-8000. Timeline is 2-3 months.',
  author: 'client123',
  url: 'https://reddit.com/r/forhire/test',
  matched_keywords: ['React', 'Next.js', 'TypeScript', 'E-commerce'],
  detected_pattern: 'hiring_post',
  opportunity_type: 'project',
  opportunity_subtype: 'web_development',
  relevance_score: 0.95,
  urgency_score: 0.8,
  total_score: 0.9,
  extracted_info: {
    budget: '$5000-8000',
    timeline: '2-3 months',
    location: 'Remote',
    requirements: ['React experience', 'Next.js knowledge', 'TypeScript skills']
  },
  status: 'new' as const,
  notes: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

export function ModalTest() {
  const [showModal, setShowModal] = useState(false);

  const handleUpdate = (id: string, status: any, notes?: string) => {
    console.log('Update:', { id, status, notes });
    setShowModal(false);
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Modal Test</h2>
      <button
        onClick={() => setShowModal(true)}
        className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
      >
        Open Modal
      </button>

      <OpportunityModal
        opportunity={mockOpportunity}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onUpdate={handleUpdate}
      />
    </div>
  );
}

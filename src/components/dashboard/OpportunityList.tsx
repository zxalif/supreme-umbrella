'use client';

import { useState, useEffect } from 'react';
import { ModernOpportunityCard } from './ModernOpportunityCard';
import { OpportunitySearch } from './OpportunitySearch';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import type { Opportunity, OpportunityStatus } from '@/types/opportunity';

interface OpportunityListProps {
  opportunities: Opportunity[];
  onUpdate: (id: string, status: OpportunityStatus, notes?: string) => void;
  isLoading?: boolean;
  className?: string;
}

export function OpportunityList({ 
  opportunities, 
  onUpdate, 
  isLoading = false, 
  className = '' 
}: OpportunityListProps) {
  const [filteredOpportunities, setFilteredOpportunities] = useState<Opportunity[]>(opportunities);

  // Update filtered opportunities when opportunities prop changes
  useEffect(() => {
    setFilteredOpportunities(opportunities);
  }, [opportunities]);

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center py-12 ${className}`}>
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Search and Filters */}
      <OpportunitySearch
        opportunities={opportunities}
        onFilteredResults={setFilteredOpportunities}
      />

      {/* Results */}
      {filteredOpportunities.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-2">No opportunities found</div>
          <div className="text-gray-400 text-sm">
            {opportunities.length === 0 
              ? "No opportunities available yet. Check back later!"
              : "Try adjusting your search filters to see more results."
            }
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredOpportunities.map((opportunity) => (
            <ModernOpportunityCard
              key={opportunity.id}
              opportunity={opportunity}
              onUpdate={onUpdate}
              viewMode="card"
            />
          ))}
        </div>
      )}
    </div>
  );
}

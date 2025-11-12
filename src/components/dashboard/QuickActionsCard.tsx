'use client';

import { useState } from 'react';
import { 
  Search, 
  Zap, 
  List, 
  ChevronDown, 
  ChevronUp,
  Plus,
  Briefcase
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface QuickActionsCardProps {
  hasSearches?: boolean;
  hasOpportunities?: boolean;
  selectedSearchId?: string;
  onGenerateClick?: () => void;
  className?: string;
}

/**
 * QuickActionsCard Component
 * 
 * Collapsible card with quick action buttons for common tasks
 */
export function QuickActionsCard({
  hasSearches = false,
  hasOpportunities = false,
  selectedSearchId,
  onGenerateClick,
  className = '',
}: QuickActionsCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const router = useRouter();

  const actions = [
    {
      id: 'create-search',
      label: 'Create Search',
      icon: Plus,
      href: '/dashboard/keyword-searches?new=true',
      description: 'Set up a new keyword search',
      enabled: true,
    },
    {
      id: 'generate',
      label: 'Generate Opportunities',
      icon: Zap,
      onClick: onGenerateClick,
      description: 'Generate opportunities from selected search',
      enabled: hasSearches && !!selectedSearchId,
    },
    {
      id: 'view-searches',
      label: 'View Searches',
      icon: Search,
      href: '/dashboard/keyword-searches',
      description: 'Manage your keyword searches',
      enabled: true,
    },
    {
      id: 'view-opportunities',
      label: 'View Opportunities',
      icon: Briefcase,
      href: '/dashboard/opportunities',
      description: 'Browse all opportunities',
      enabled: hasOpportunities,
    },
  ];

  const enabledActions = actions.filter(action => action.enabled);

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center">
          <List className="w-5 h-5 text-gray-600 mr-2" />
          <h3 className="text-sm font-semibold text-gray-900">Quick Actions</h3>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="p-4 pt-0 border-t border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {enabledActions.map((action) => {
              const Icon = action.icon;
              const content = (
                <div className="flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                  <Icon className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900">
                      {action.label}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {action.description}
                    </div>
                  </div>
                </div>
              );

              if (action.href) {
                return (
                  <Link key={action.id} href={action.href}>
                    {content}
                  </Link>
                );
              }

              if (action.onClick) {
                return (
                  <button
                    key={action.id}
                    onClick={action.onClick}
                    className="w-full text-left"
                  >
                    {content}
                  </button>
                );
              }

              return <div key={action.id}>{content}</div>;
            })}
          </div>

          {enabledActions.length === 0 && (
            <div className="text-center py-4 text-sm text-gray-500">
              No quick actions available
            </div>
          )}
        </div>
      )}
    </div>
  );
}


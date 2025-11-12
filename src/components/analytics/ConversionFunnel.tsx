'use client';

import { useMemo } from 'react';
import { ChevronDown } from 'lucide-react';
import type { Opportunity } from '@/types/opportunity';

interface ConversionFunnelProps {
  opportunities: Opportunity[];
}

interface FunnelStage {
  name: string;
  count: number;
  percentage: number;
  color: string;
  dropoffRate?: number;
}

/**
 * Conversion Funnel Component
 * 
 * Visualizes the opportunity conversion pipeline
 */
export function ConversionFunnel({ opportunities }: ConversionFunnelProps) {
  
  const funnelData = useMemo(() => {
    const total = opportunities.length;
    
    if (total === 0) {
      return [];
    }

    const stages: FunnelStage[] = [
      {
        name: 'New',
        count: opportunities.filter(o => o.status === 'new').length,
        percentage: 100,
        color: 'bg-blue-500',
      },
      {
        name: 'Viewed',
        count: opportunities.filter(o => 
          o.status === 'viewed' || 
          o.status === 'contacted' || 
          o.status === 'applied' || 
          o.status === 'won'
        ).length,
        percentage: 0,
        color: 'bg-purple-500',
      },
      {
        name: 'Contacted',
        count: opportunities.filter(o => 
          o.status === 'contacted' || 
          o.status === 'applied' || 
          o.status === 'won'
        ).length,
        percentage: 0,
        color: 'bg-yellow-500',
      },
      {
        name: 'Applied',
        count: opportunities.filter(o => 
          o.status === 'applied' || 
          o.status === 'won'
        ).length,
        percentage: 0,
        color: 'bg-orange-500',
      },
      {
        name: 'Won',
        count: opportunities.filter(o => o.status === 'won').length,
        percentage: 0,
        color: 'bg-green-500',
      },
    ];

    // Calculate percentages and dropoff rates
    stages.forEach((stage, index) => {
      stage.percentage = total > 0 ? (stage.count / total) * 100 : 0;
      
      if (index > 0) {
        const previousCount = stages[index - 1].count;
        stage.dropoffRate = previousCount > 0 
          ? ((previousCount - stage.count) / previousCount) * 100 
          : 0;
      }
    });

    return stages;
  }, [opportunities]);

  if (opportunities.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <p>No data available</p>
      </div>
    );
  }

  const maxWidth = 100;
  const minWidth = 20;

  return (
    <div className="space-y-2">
      {funnelData.map((stage, index) => {
        // Calculate width based on percentage (with minimum width for visibility)
        const width = Math.max(
          minWidth,
          (stage.percentage / 100) * maxWidth
        );

        return (
          <div key={stage.name} className="space-y-1">
            {/* Stage bar */}
            <div className="relative">
              <div
                className={`${stage.color} rounded-lg p-4 transition-all duration-300 hover:shadow-lg`}
                style={{ width: `${width}%` }}
              >
                <div className="flex items-center justify-between text-white">
                  <div>
                    <p className="font-semibold">{stage.name}</p>
                    <p className="text-sm opacity-90">
                      {stage.count} {stage.count === 1 ? 'opportunity' : 'opportunities'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">
                      {stage.percentage.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Dropoff indicator */}
            {index < funnelData.length - 1 && stage.dropoffRate !== undefined && stage.dropoffRate > 0 && (
              <div className="flex items-center space-x-2 text-sm text-gray-500 ml-4">
                <ChevronDown className="w-4 h-4" />
                <span>
                  {stage.dropoffRate.toFixed(1)}% drop-off to next stage
                </span>
              </div>
            )}
          </div>
        );
      })}

      {/* Summary stats */}
      <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <p className="text-sm text-gray-600">Total Opportunities</p>
          <p className="text-2xl font-bold text-gray-900">{opportunities.length}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Conversion Rate</p>
          <p className="text-2xl font-bold text-green-600">
            {funnelData[funnelData.length - 1]?.percentage.toFixed(1)}%
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Avg. Drop-off</p>
          <p className="text-2xl font-bold text-red-600">
            {(funnelData
              .filter(s => s.dropoffRate !== undefined)
              .reduce((sum, s) => sum + (s.dropoffRate || 0), 0) / 
              (funnelData.length - 1)).toFixed(1)}%
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Won Opportunities</p>
          <p className="text-2xl font-bold text-gray-900">
            {funnelData[funnelData.length - 1]?.count || 0}
          </p>
        </div>
      </div>
    </div>
  );
}

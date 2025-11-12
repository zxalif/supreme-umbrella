'use client';

import { Check, Circle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface WorkflowProgressProps {
  hasSearches: boolean;
  hasOpportunities: boolean;
  selectedSearchId: string;
  className?: string;
}

type StepStatus = 'completed' | 'current' | 'pending';

interface Step {
  id: string;
  label: string;
  status: StepStatus;
  href?: string;
}

/**
 * Workflow Progress Indicator Component
 * 
 * Shows the 3-step workflow progress:
 * 1. Create Keyword Search
 * 2. Generate Opportunities
 * 3. Review & Contact Leads
 */
export function WorkflowProgress({
  hasSearches,
  hasOpportunities,
  selectedSearchId,
  className = '',
}: WorkflowProgressProps) {
  const steps: Step[] = [
    {
      id: 'create-search',
      label: 'Create Keyword Search',
      status: hasSearches ? 'completed' : 'current',
      href: '/dashboard/keyword-searches',
    },
    {
      id: 'generate',
      label: 'Generate Opportunities',
      status: hasSearches && !hasOpportunities && selectedSearchId !== 'all'
        ? 'current'
        : hasOpportunities
        ? 'completed'
        : 'pending',
    },
    {
      id: 'review',
      label: 'Review & Contact Leads',
      status: hasOpportunities ? 'current' : 'pending',
    },
  ];

  const getStepIcon = (status: StepStatus) => {
    switch (status) {
      case 'completed':
        return <Check className="w-5 h-5 text-white" />;
      case 'current':
        return <Circle className="w-5 h-5 text-white" />;
      case 'pending':
        return <Circle className="w-5 h-5 text-gray-300" />;
    }
  };

  const getStepStyles = (status: StepStatus) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500 border-green-500';
      case 'current':
        return 'bg-blue-500 border-blue-500 animate-pulse';
      case 'pending':
        return 'bg-gray-200 border-gray-300';
    }
  };

  const getLabelStyles = (status: StepStatus) => {
    switch (status) {
      case 'completed':
        return 'text-green-700 font-medium';
      case 'current':
        return 'text-blue-700 font-semibold';
      case 'pending':
        return 'text-gray-500';
    }
  };

  return (
    <div className={`card p-4 md:p-6 ${className}`}>
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Workflow Progress</h3>
      
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            {/* Step Circle */}
            <div className="flex flex-col items-center flex-1">
              {step.href && step.status === 'current' ? (
                <Link
                  href={step.href}
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${getStepStyles(
                    step.status
                  )} hover:scale-110`}
                >
                  {getStepIcon(step.status)}
                </Link>
              ) : (
                <div
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${getStepStyles(
                    step.status
                  )}`}
                >
                  {getStepIcon(step.status)}
                </div>
              )}

              {/* Step Label */}
              <p className={`text-xs mt-2 text-center max-w-[100px] ${getLabelStyles(step.status)}`}>
                {step.label}
              </p>
            </div>

            {/* Arrow Connector */}
            {index < steps.length - 1 && (
              <div className="flex-1 mx-2 md:mx-4">
                <ArrowRight
                  className={`w-4 h-4 md:w-6 md:h-6 ${
                    step.status === 'completed' ? 'text-green-500' : 'text-gray-300'
                  }`}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}


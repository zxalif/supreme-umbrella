'use client';

import { useState } from 'react';
import { Check, X, Info, Zap, Users, BarChart3, Headphones } from 'lucide-react';
import { PRICING_PLANS } from '@/types/subscription';
import type { SubscriptionPlan } from '@/types/subscription';

interface PlanComparisonProps {
  isOpen: boolean;
  onClose: () => void;
}

const FEATURE_CATEGORIES = {
  'Core Features': {
    icon: Zap,
    features: [
      { key: 'keyword_searches', label: 'Concurrent Keyword Searches', tooltip: 'Number of different keywords you can monitor simultaneously' },
      { key: 'searches_created_per_month', label: 'Searches Created per Month', tooltip: 'Maximum number of new searches you can create each month' },
      { key: 'opportunities_per_month', label: 'Opportunities per Month', tooltip: 'Maximum number of new opportunities you can discover monthly' },
      { key: 'reddit_monitoring', label: 'Reddit Monitoring', tooltip: 'Real-time monitoring of Reddit posts and comments' },
      { key: 'opportunity_history', label: 'Opportunity History', tooltip: 'How long your opportunity data is stored' },
    ]
  },
  'Notifications & Integrations': {
    icon: Users,
    features: [
      { key: 'email_notifications', label: 'Email Notifications', tooltip: 'Get notified via email when new opportunities are found' },
      { key: 'sms_notifications', label: 'SMS Notifications', tooltip: 'Get notified via SMS for urgent opportunities' },
      { key: 'webhooks', label: 'Webhooks', tooltip: 'Integrate with external services via webhooks' },
    ]
  },
  'Analytics & Insights': {
    icon: BarChart3,
    features: [
      { key: 'basic_analytics', label: 'Basic Analytics', tooltip: 'View basic statistics and trends' },
      { key: 'advanced_analytics', label: 'Advanced Analytics', tooltip: 'Detailed insights, custom reports, and advanced metrics' },
      { key: 'advanced_filtering', label: 'Advanced Filtering', tooltip: 'Filter opportunities by budget, location, skills, and more' },
      { key: 'custom_date_ranges', label: 'Custom Date Ranges', tooltip: 'Analyze data for any custom time period' },
      { key: 'saved_insights', label: 'Saved Insights', tooltip: 'Bookmark and save important insights for later' },
    ]
  },
  'Export & Data': {
    icon: Zap,
    features: [
      { key: 'csv_exports', label: 'CSV Export', tooltip: 'Export your data to CSV format for external analysis' },
      { key: 'pdf_exports', label: 'PDF Export', tooltip: 'Export reports and data to PDF format' },
      { key: 'json_exports', label: 'JSON Export', tooltip: 'Export data in JSON format for developers' },
    ]
  },
  'Support & API': {
    icon: Headphones,
    features: [
      { key: 'priority_support', label: 'Priority Support', tooltip: 'Get faster response times and dedicated support' },
      { key: 'api_access', label: 'API Access', tooltip: 'Programmatic access to your data and features' },
    ]
  }
};

const PLAN_FEATURES = {
  starter: {
    keyword_searches: '2 concurrent',
    searches_created_per_month: '5/month',
    opportunities_per_month: '50/month',
    reddit_monitoring: true,
    email_notifications: true,
    sms_notifications: false,
    webhooks: false,
    basic_analytics: true,
    advanced_analytics: false,
    csv_exports: true,
    pdf_exports: false,
    json_exports: false,
    opportunity_history: '14 days',
    advanced_filtering: false,
    custom_date_ranges: false,
    saved_insights: false,
    priority_support: false,
    api_access: false,
  },
  professional: {
    keyword_searches: '5 concurrent',
    searches_created_per_month: '10/month',
    opportunities_per_month: '200/month',
    reddit_monitoring: true,
    email_notifications: true,
    sms_notifications: 'Coming soon',
    webhooks: false,
    basic_analytics: true,
    advanced_analytics: true,
    csv_exports: true,
    pdf_exports: true,
    json_exports: false,
    opportunity_history: '90 days',
    advanced_filtering: true,
    custom_date_ranges: true,
    saved_insights: true,
    priority_support: true,
    api_access: false,
  },
  power: {
    keyword_searches: '10 concurrent',
    searches_created_per_month: '20/month',
    opportunities_per_month: '500/month',
    reddit_monitoring: true,
    email_notifications: true,
    sms_notifications: 'Coming soon',
    webhooks: 'Coming soon',
    basic_analytics: true,
    advanced_analytics: true,
    csv_exports: true,
    pdf_exports: true,
    json_exports: true,
    opportunity_history: 'Unlimited',
    advanced_filtering: true,
    custom_date_ranges: true,
    saved_insights: true,
    priority_support: true,
    api_access: 'Coming soon',
  }
};

export function PlanComparison({ isOpen, onClose }: PlanComparisonProps) {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  if (!isOpen) return null;

  const plans: SubscriptionPlan[] = ['starter', 'professional', 'power'];

  const renderFeatureValue = (plan: SubscriptionPlan, featureKey: string) => {
    if (!(plan in PLAN_FEATURES)) return null;
    const planFeatures = PLAN_FEATURES[plan as keyof typeof PLAN_FEATURES];
    const value = planFeatures[featureKey as keyof typeof planFeatures];
    
    if (typeof value === 'boolean') {
      return value ? (
        <Check className="w-5 h-5 text-green-600 mx-auto" />
      ) : (
        <X className="w-5 h-5 text-gray-400 mx-auto" />
      );
    }
    
    // Check if it's a "Coming soon" feature
    const isComingSoon = typeof value === 'string' && value.toLowerCase().includes('coming soon');
    
    return (
      <span className={`text-sm font-medium ${isComingSoon ? 'text-gray-500 italic' : 'text-gray-900'}`}>
        {value}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Compare Plans</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>
          <p className="text-gray-600 mt-2">
            Choose the perfect plan for your freelance opportunity needs
          </p>
        </div>

        <div className="p-6">
          {/* Plan Headers */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div></div>
            {plans.map((plan) => (
              <div key={plan} className="text-center">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {PRICING_PLANS[plan].name}
                </h3>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  ${PRICING_PLANS[plan].price}
                </div>
                <div className="text-sm text-gray-600">/month</div>
              </div>
            ))}
          </div>

          {/* Feature Categories */}
          {Object.entries(FEATURE_CATEGORIES).map(([categoryName, category]) => (
            <div key={categoryName} className="mb-8">
              <div className="flex items-center mb-4">
                <category.icon className="w-5 h-5 text-blue-600 mr-2" />
                <h4 className="text-lg font-semibold text-gray-900">{categoryName}</h4>
              </div>

              {category.features.map((feature) => (
                <div key={feature.key} className="grid grid-cols-4 gap-4 py-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-700 mr-2">{feature.label}</span>
                    <button
                      className="relative"
                      onMouseEnter={() => setActiveTooltip(feature.key)}
                      onMouseLeave={() => setActiveTooltip(null)}
                    >
                      <Info className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                      {activeTooltip === feature.key && (
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap z-10">
                          {feature.tooltip}
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                        </div>
                      )}
                    </button>
                  </div>
                  {plans.map((plan) => (
                    <div key={plan} className="text-center">
                      {renderFeatureValue(plan, feature.key)}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

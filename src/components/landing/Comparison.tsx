import { Check, X, Clock, Zap, Target, DollarSign } from 'lucide-react';
import Link from 'next/link';

/**
 * Comparison Section Component
 * 
 * Shows side-by-side comparison of manual searching vs ClientHunt
 * Highlights time saved, efficiency, and ROI
 */
export function Comparison() {
  const comparisons = [
    {
      feature: 'Time Spent Searching',
      manual: '2-3 hours/day',
      clienthunt: '0 minutes (automated)',
      icon: Clock,
      manualValue: '❌',
      clienthuntValue: '✅',
    },
    {
      feature: 'Opportunities Found',
      manual: '5-10 per day',
      clienthunt: '50-200 per month',
      icon: Target,
      manualValue: '❌',
      clienthuntValue: '✅',
    },
    {
      feature: 'Response Speed',
      manual: 'Hours or days later',
      clienthunt: 'Within minutes',
      icon: Zap,
      manualValue: '❌',
      clienthuntValue: '✅',
    },
    {
      feature: 'Opportunity Scoring',
      manual: 'Manual evaluation',
      clienthunt: 'AI-powered scoring',
      icon: Target,
      manualValue: '❌',
      clienthuntValue: '✅',
    },
    {
      feature: 'Spam Filtering',
      manual: 'Manual review needed',
      clienthunt: 'Automatic filtering',
      icon: Check,
      manualValue: '❌',
      clienthuntValue: '✅',
    },
    {
      feature: 'ROI',
      manual: 'Time = Money lost',
      clienthunt: '3-5x ROI typical',
      icon: DollarSign,
      manualValue: '❌',
      clienthuntValue: '✅',
    },
  ];

  return (
    <section className="py-12 lg:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Manual Searching vs ClientHunt
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See why freelancers are switching from manual searching to automated opportunity discovery
          </p>
        </div>

        {/* Comparison Table */}
        <div className="max-w-5xl mx-auto">
          <div className="card overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-3 gap-4 p-6 bg-gray-50 border-b border-gray-200">
              <div className="font-semibold text-gray-900">Feature</div>
              <div className="text-center font-semibold text-gray-900">Manual Searching</div>
              <div className="text-center font-semibold text-primary-600">ClientHunt</div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-gray-200">
              {comparisons.map((comparison, index) => {
                const Icon = comparison.icon;
                return (
                  <div
                    key={index}
                    className="grid grid-cols-3 gap-4 p-6 hover:bg-gray-50 transition-colors"
                  >
                    {/* Feature */}
                    <div className="flex items-center">
                      <Icon className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                      <span className="font-medium text-gray-900">{comparison.feature}</span>
                    </div>

                    {/* Manual */}
                    <div className="text-center">
                      <div className="inline-flex items-center px-3 py-1 bg-red-50 text-red-700 rounded-lg text-sm font-medium mb-1">
                        <X className="w-4 h-4 mr-1" />
                        {comparison.manual}
                      </div>
                    </div>

                    {/* ClientHunt */}
                    <div className="text-center">
                      <div className="inline-flex items-center px-3 py-1 bg-green-50 text-green-700 rounded-lg text-sm font-medium mb-1">
                        <Check className="w-4 h-4 mr-1" />
                        {comparison.clienthunt}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Time Saved Calculator */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="card bg-gradient-to-br from-primary-50 to-primary-100 border-2 border-primary-200">
            <div className="p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Calculate Your Time Savings
              </h3>
              <p className="text-gray-700 mb-6">
                If you spend 2 hours per day manually searching Reddit, that's <strong>60 hours per month</strong>.
                <br />
                With ClientHunt, you get better results in <strong>0 hours</strong>.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white rounded-lg p-4">
                  <div className="text-3xl font-bold text-primary-600 mb-1">60+</div>
                  <div className="text-sm text-gray-600">Hours Saved/Month</div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="text-3xl font-bold text-primary-600 mb-1">720+</div>
                  <div className="text-sm text-gray-600">Hours Saved/Year</div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="text-3xl font-bold text-primary-600 mb-1">$7,200+</div>
                  <div className="text-sm text-gray-600">Value (at $10/hr)</div>
                </div>
              </div>
              <Link
                href="/register"
                className="btn-primary text-lg px-8 py-4 inline-block"
              >
                Start Saving Time Today
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


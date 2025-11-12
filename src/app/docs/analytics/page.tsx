import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, TrendingUp, BarChart3, Target, Calendar } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Analytics & Insights</h1>
      <p className="text-xl text-gray-600 mb-8">
        Track your lead generation performance and gain insights into your opportunities.
      </p>

      {/* Overview */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Analytics Dashboard</h2>
        <p className="text-gray-700 mb-4">
          The Analytics page provides comprehensive insights into your lead generation efforts:
        </p>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">📊 Overview Stats</h3>
            <p className="text-sm text-gray-700">
              Total opportunities, active searches, and success metrics at a glance.
            </p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">📈 Performance Trends</h3>
            <p className="text-sm text-gray-700">
              See how your opportunities change over time with charts and graphs.
            </p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">🎯 Search Performance</h3>
            <p className="text-sm text-gray-700">
              Compare which keyword searches are finding the most opportunities.
            </p>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">💰 Budget Insights</h3>
            <p className="text-sm text-gray-700">
              Track budget ranges and trends in opportunities you're finding.
            </p>
          </div>
        </div>
        {/* Analytics dashboard overview screenshot */}
        <div className="rounded-lg border border-gray-200 overflow-hidden shadow-sm mb-4">
          <Image
            src="/images/placeholders/analytics-dashboard.png"
            alt="Analytics dashboard overview"
            width={1200}
            height={800}
            className="w-full h-auto"
          />
        </div>
      </section>

      {/* Key Metrics */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="w-6 h-6 text-green-600 mr-2" />
          Key Metrics
        </h2>
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h3 className="font-semibold text-gray-900 mb-2">Total Opportunities</h3>
            <p className="text-gray-700 text-sm mb-2">
              The total number of opportunities found across all your keyword searches.
            </p>
            <p className="text-xs text-gray-500">
              Track this over time to see if your lead generation is improving.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h3 className="font-semibold text-gray-900 mb-2">Opportunities by Status</h3>
            <p className="text-gray-700 text-sm mb-2">
              Breakdown of opportunities by status: New, Interested, Applied, Won, Lost.
            </p>
            <p className="text-xs text-gray-500">
              Monitor your pipeline health and conversion rates.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h3 className="font-semibold text-gray-900 mb-2">Top Performing Searches</h3>
            <p className="text-gray-700 text-sm mb-2">
              See which keyword searches are finding the most opportunities.
            </p>
            <p className="text-xs text-gray-500">
              Use this to identify which keywords and subreddits work best for you.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h3 className="font-semibold text-gray-900 mb-2">Average Budget</h3>
            <p className="text-gray-700 text-sm mb-2">
              Average budget range of opportunities found (when budget is mentioned).
            </p>
            <p className="text-xs text-gray-500">
              Helps you understand the market rates for your skills.
            </p>
          </div>
        </div>
        {/* Metrics cards screenshot */}
        <div className="rounded-lg border border-gray-200 overflow-hidden shadow-sm mb-4 mt-4">
          <Image
            src="/images/placeholders/metrics.png"
            alt="Metrics cards and key indicators"
            width={1200}
            height={800}
            className="w-full h-auto"
          />
        </div>
      </section>

      {/* Performance Trends */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
          <BarChart3 className="w-6 h-6 text-blue-600 mr-2" />
          Performance Trends
        </h2>
        <p className="text-gray-700 mb-4">
          Visualize how your opportunities change over time:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
          <li><strong>Opportunities Over Time:</strong> Line chart showing daily/weekly/monthly opportunity counts</li>
          <li><strong>Status Distribution:</strong> Pie or bar chart showing breakdown by status</li>
          <li><strong>Search Comparison:</strong> Compare performance across different keyword searches</li>
          <li><strong>Budget Trends:</strong> See how budgets change over time</li>
        </ul>
        {/* Charts and graphs showing trends screenshot */}
        <div className="rounded-lg border border-gray-200 overflow-hidden shadow-sm mb-4">
          <Image
            src="/images/placeholders/analytics-performance.png"
            alt="Charts and graphs showing trends"
            width={1200}
            height={800}
            className="w-full h-auto"
          />
        </div>
      </section>

      {/* Search Performance */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
          <Target className="w-6 h-6 text-purple-600 mr-2" />
          Search Performance
        </h2>
        <p className="text-gray-700 mb-4">
          Compare how different keyword searches are performing:
        </p>
        <div className="bg-gray-50 rounded-lg p-5 mb-4">
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Number of opportunities found per search</li>
            <li>Average relevance score</li>
            <li>Status breakdown per search</li>
            <li>Budget averages per search</li>
          </ul>
        </div>
        {/* Search performance comparison table screenshot */}
        <div className="rounded-lg border border-gray-200 overflow-hidden shadow-sm mb-4">
          <Image
            src="/images/placeholders/analytics-search-performance.png"
            alt="Search performance comparison table"
            width={1200}
            height={800}
            className="w-full h-auto"
          />
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-900 text-sm">
            <strong>💡 Tip:</strong> Use search performance data to refine your keywords. If a search isn't finding many opportunities, try adding more keyword variations or subreddits.
          </p>
        </div>
      </section>

      {/* Time Periods */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
          <Calendar className="w-6 h-6 text-orange-600 mr-2" />
          Filtering by Time Period
        </h2>
        <p className="text-gray-700 mb-4">
          View analytics for different time periods:
        </p>
        <div className="grid md:grid-cols-4 gap-3 mb-4">
          <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
            <p className="font-semibold text-gray-900 text-sm">Last 7 Days</p>
            <p className="text-xs text-gray-500 mt-1">Short-term trends</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
            <p className="font-semibold text-gray-900 text-sm">Last 30 Days</p>
            <p className="text-xs text-gray-500 mt-1">Monthly view</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
            <p className="font-semibold text-gray-900 text-sm">Last 90 Days</p>
            <p className="text-xs text-gray-500 mt-1">Quarterly trends</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
            <p className="font-semibold text-gray-900 text-sm">All Time</p>
            <p className="text-xs text-gray-500 mt-1">Complete history</p>
          </div>
        </div>
        {/* Time period selector screenshot */}
        <div className="rounded-lg border border-gray-200 overflow-hidden shadow-sm mb-4">
          <Image
            src="/images/placeholders/analytics-dashboard.png"
            alt="Time period selector"
            width={1200}
            height={800}
            className="w-full h-auto"
          />
        </div>
      </section>

      {/* Using Analytics */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Using Analytics to Improve</h2>
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-5">
          <h3 className="font-semibold text-gray-900 mb-3">Actionable Insights</h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="text-green-600 mr-2">→</span>
              <span><strong>Identify top keywords:</strong> Focus on searches that find the most opportunities</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2">→</span>
              <span><strong>Optimize underperforming searches:</strong> Add more keywords or subreddits to searches with few results</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2">→</span>
              <span><strong>Track conversion rates:</strong> Monitor how many opportunities move from "New" to "Won"</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2">→</span>
              <span><strong>Understand market trends:</strong> See if budgets or opportunity volumes are changing</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Next Steps */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Need More Help?</h2>
        <p className="text-gray-700 mb-4">
          Check out our FAQ or contact support for assistance:
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/docs/faq"
            className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            View FAQ
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Contact Support
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
}


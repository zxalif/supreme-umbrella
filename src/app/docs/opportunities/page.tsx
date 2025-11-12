import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Filter, Download, Eye } from 'lucide-react';

export default function OpportunitiesPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Managing Opportunities</h1>
      <p className="text-xl text-gray-600 mb-8">
        Learn how to view, filter, and manage opportunities found on Reddit.
      </p>

      {/* Overview */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Opportunities Overview</h2>
        <p className="text-gray-700 mb-4">
          The Opportunities page shows all Reddit posts that match your keyword searches. Each opportunity includes:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
          <li>Original Reddit post title and content</li>
          <li>Relevance score (AI-powered)</li>
          <li>Budget information (if mentioned)</li>
          <li>Link to the original Reddit post</li>
          <li>Date found and keyword search source</li>
        </ul>
        {/* Opportunities list view screenshot */}
        <div className="rounded-lg border border-gray-200 overflow-hidden shadow-sm mb-4">
          <Image
            src="/images/placeholders/oppurtunity-list-view.png"
            alt="Opportunities list view"
            width={1200}
            height={800}
            className="w-full h-auto"
          />
        </div>
      </section>

      {/* Generating Opportunities */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Generating Opportunities</h2>
        <p className="text-gray-700 mb-4">
          To find new opportunities, you need to generate them from your keyword searches:
        </p>
        <ol className="list-decimal list-inside space-y-3 text-gray-700 mb-4">
          <li>Go to the <strong>Opportunities</strong> page</li>
          <li>Select a keyword search from the dropdown (or choose "All Searches")</li>
          <li>Click <strong>"Generate Opportunities"</strong></li>
          <li>Wait for the process to complete (you'll see a progress indicator)</li>
          <li>Review the new opportunities found</li>
        </ol>
        {/* Generate opportunities screenshot */}
        <div className="rounded-lg border border-gray-200 overflow-hidden shadow-sm mb-4">
          <Image
            src="/images/placeholders/generate-oppurtunity.png"
            alt="Generate opportunities button and keyword search selector"
            width={1200}
            height={800}
            className="w-full h-auto"
          />
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-900 text-sm">
            <strong>💡 Tip:</strong> The generation process typically takes 2-5 minutes. You can see real-time progress and time estimates while it runs.
          </p>
        </div>
      </section>

      {/* Filtering and Searching */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
          <Filter className="w-6 h-6 text-purple-600 mr-2" />
          Filtering and Searching
        </h2>
        <p className="text-gray-700 mb-4">
          Use filters to find specific opportunities:
        </p>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">By Keyword Search</h3>
            <p className="text-sm text-gray-700">
              Filter opportunities by the keyword search that found them. Use the card selector at the top.
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">By Status</h3>
            <p className="text-sm text-gray-700">
              Filter by status: New, Interested, Applied, Won, or Lost.
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">By Date</h3>
            <p className="text-sm text-gray-700">
              Sort by newest or oldest opportunities first.
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Search Text</h3>
            <p className="text-sm text-gray-700">
              Use the search bar to find opportunities by keywords in the title or content.
            </p>
          </div>
        </div>
        {/* Filter controls and search bar screenshot */}
        <div className="rounded-lg border border-gray-200 overflow-hidden shadow-sm mb-4">
          <Image
            src="/images/placeholders/oppurtunity-filter.png"
            alt="Filter controls and search bar"
            width={1200}
            height={800}
            className="w-full h-auto"
          />
        </div>
      </section>

      {/* Viewing Details */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
          <Eye className="w-6 h-6 text-blue-600 mr-2" />
          Viewing Opportunity Details
        </h2>
        <p className="text-gray-700 mb-4">
          Click on any opportunity card to view full details:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
          <li>Complete Reddit post content</li>
          <li>Extracted budget information</li>
          <li>Relevance score breakdown</li>
          <li>Direct link to the Reddit post</li>
          <li>Update status option</li>
        </ul>
        {/* Opportunity detail modal screenshot */}
        <div className="rounded-lg border border-gray-200 overflow-hidden shadow-sm mb-4">
          <Image
            src="/images/placeholders/oppurtunity-details.png"
            alt="Opportunity detail modal"
            width={1200}
            height={800}
            className="w-full h-auto"
          />
        </div>
      </section>

      {/* Updating Status */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Updating Opportunity Status</h2>
        <p className="text-gray-700 mb-4">
          Track your pipeline by updating opportunity statuses:
        </p>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="w-3 h-3 bg-gray-400 rounded-full mb-2"></div>
            <h3 className="font-semibold text-gray-900 mb-1">New</h3>
            <p className="text-sm text-gray-600">Default status for newly found opportunities</p>
          </div>
          <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
            <div className="w-3 h-3 bg-blue-500 rounded-full mb-2"></div>
            <h3 className="font-semibold text-gray-900 mb-1">Interested</h3>
            <p className="text-sm text-gray-600">Mark opportunities you're considering</p>
          </div>
          <div className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mb-2"></div>
            <h3 className="font-semibold text-gray-900 mb-1">Applied</h3>
            <p className="text-sm text-gray-600">Track opportunities you've applied to</p>
          </div>
          <div className="border border-green-200 rounded-lg p-4 bg-green-50">
            <div className="w-3 h-3 bg-green-500 rounded-full mb-2"></div>
            <h3 className="font-semibold text-gray-900 mb-1">Won</h3>
            <p className="text-sm text-gray-600">Mark successful opportunities</p>
          </div>
          <div className="border border-red-200 rounded-lg p-4 bg-red-50">
            <div className="w-3 h-3 bg-red-500 rounded-full mb-2"></div>
            <h3 className="font-semibold text-gray-900 mb-1">Lost</h3>
            <p className="text-sm text-gray-600">Track opportunities that didn't work out</p>
          </div>
        </div>
        <p className="text-gray-700 text-sm mb-4">
          Update status from the opportunity detail modal or directly from the list view.
        </p>
        {/* Status update screenshot */}
        <div className="rounded-lg border border-gray-200 overflow-hidden shadow-sm mb-4">
          <Image
            src="/images/placeholders/oppurtunity-status-update.png"
            alt="Status update dropdown in opportunity modal"
            width={1200}
            height={800}
            className="w-full h-auto"
          />
        </div>
      </section>

      {/* Exporting */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
          <Download className="w-6 h-6 text-green-600 mr-2" />
          Exporting Opportunities
        </h2>
        <p className="text-gray-700 mb-4">
          Export your opportunities to CSV for external tracking or analysis:
        </p>
        <ol className="list-decimal list-inside space-y-2 text-gray-700 mb-4">
          <li>Apply any filters you want (status, keyword search, etc.)</li>
          <li>Click the <strong>"Export CSV"</strong> button</li>
          <li>Download the CSV file with all visible opportunities</li>
        </ol>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-900 text-sm">
            <strong>📊 Export includes:</strong> Title, content, status, budget, relevance score, Reddit link, and date found.
          </p>
        </div>
      </section>

      {/* Processing States */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Understanding Processing States</h2>
        <p className="text-gray-700 mb-4">
          When generating opportunities, you'll see different states:
        </p>
        <div className="space-y-3 mb-4">
          <div className="flex items-center space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
            <div>
              <p className="font-semibold text-yellow-900">Pending</p>
              <p className="text-sm text-yellow-700">Job is queued and waiting to start</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <div>
              <p className="font-semibold text-blue-900">Processing</p>
              <p className="text-sm text-blue-700">Actively scanning Reddit for opportunities</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <div>
              <p className="font-semibold text-green-900">Completed</p>
              <p className="text-sm text-green-700">All opportunities have been found</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <div>
              <p className="font-semibold text-red-900">Failed</p>
              <p className="text-sm text-red-700">An error occurred during processing</p>
            </div>
          </div>
        </div>
        {/* Processing banner with time estimates screenshot */}
        <div className="rounded-lg border border-gray-200 overflow-hidden shadow-sm mb-4">
          <Image
            src="/images/placeholders/oppurtunity-processing.png"
            alt="Processing banner with time estimates"
            width={1200}
            height={800}
            className="w-full h-auto"
          />
        </div>
      </section>

      {/* Next Steps */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Next Steps</h2>
        <p className="text-gray-700 mb-4">
          Learn how to track your performance with analytics:
        </p>
        <div className="flex flex-wrap gap-3">
          {/* Notifications link commented out - feature not yet implemented */}
          {/* <Link
            href="/docs/notifications"
            className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Notification Settings
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link> */}
          <Link
            href="/docs/analytics"
            className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Analytics & Insights
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
}


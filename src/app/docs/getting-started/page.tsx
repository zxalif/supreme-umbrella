import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle, ArrowRight } from 'lucide-react';

export default function GettingStartedPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Getting Started</h1>
      <p className="text-xl text-gray-600 mb-8">
        Welcome to ClientHunt! This guide will help you set up your account and start finding freelance opportunities on Reddit.
      </p>

      {/* Step 1 */}
      <section className="mb-12">
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg mr-4">
            1
          </div>
          <h2 className="text-2xl font-semibold text-gray-900">Create Your Account</h2>
        </div>
        <div className="ml-14">
          <p className="text-gray-700 mb-4">
            Sign up for a free ClientHunt account. You'll need to:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
            <li>Provide your email address</li>
            <li>Create a secure password</li>
            <li>Verify your email address (check your inbox)</li>
          </ul>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-blue-900 text-sm">
              <strong>Free Trial:</strong> All new accounts get a 1-month free trial with full access to all features. No credit card required!
            </p>
          </div>
          {/* Registration page screenshot */}
          <div className="rounded-lg border border-gray-200 overflow-hidden shadow-sm mb-4">
            <Image
              src="/images/placeholders/sign-up.png"
              alt="ClientHunt registration page"
              width={1200}
              height={800}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              className="w-full h-auto"
              priority
            />
          </div>
        </div>
      </section>

      {/* Step 2 */}
      <section className="mb-12">
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg mr-4">
            2
          </div>
          <h2 className="text-2xl font-semibold text-gray-900">Explore the Dashboard</h2>
        </div>
        <div className="ml-14">
          <p className="text-gray-700 mb-4">
            Once you're logged in, you'll see your dashboard. Here's what you'll find:
          </p>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">📊 Dashboard Overview</h3>
              <p className="text-sm text-gray-700">
                View your statistics, recent opportunities, and quick actions.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">🔍 Keyword Searches</h3>
              <p className="text-sm text-gray-700">
                Create and manage searches for opportunities matching your skills.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">🎯 Opportunities</h3>
              <p className="text-sm text-gray-700">
                View and manage all opportunities found on Reddit.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">📈 Analytics</h3>
              <p className="text-sm text-gray-700">
                Track your performance and see detailed insights.
              </p>
            </div>
          </div>
          {/* Dashboard overview screenshot */}
          <div className="rounded-lg border border-gray-200 overflow-hidden shadow-sm mb-4">
            <Image
              src="/images/placeholders/dashboard.png"
              alt="ClientHunt dashboard overview"
              width={1200}
              height={800}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* Step 3 */}
      <section className="mb-12">
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg mr-4">
            3
          </div>
          <h2 className="text-2xl font-semibold text-gray-900">Create Your First Keyword Search</h2>
        </div>
        <div className="ml-14">
          <p className="text-gray-700 mb-4">
            Keyword searches are the foundation of finding opportunities. Here's how to create one:
          </p>
          <ol className="list-decimal list-inside space-y-3 text-gray-700 mb-4">
            <li>Navigate to the <strong>Keyword Searches</strong> page from the sidebar</li>
            <li>Click the <strong>"Create Search"</strong> button</li>
            <li>Enter keywords related to your skills (e.g., "React developer", "logo design")</li>
            <li>Select subreddits to monitor (e.g., r/forhire, r/DesignJobs)</li>
            <li>Click <strong>"Create Search"</strong> to save</li>
          </ol>
          {/* Create keyword search form screenshot */}
          <div className="rounded-lg border border-gray-200 overflow-hidden shadow-sm mb-4">
            <Image
              src="/images/placeholders/keyword_searches.png"
              alt="Create keyword search form"
              width={1200}
              height={800}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              className="w-full h-auto"
            />
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-900 text-sm">
              <strong>💡 Tip:</strong> Use our auto-complete suggestions to find popular keywords and subreddits. Start with 3-5 keywords per search for best results.
            </p>
          </div>
        </div>
      </section>

      {/* Step 4 */}
      <section className="mb-12">
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg mr-4">
            4
          </div>
          <h2 className="text-2xl font-semibold text-gray-900">Generate Opportunities</h2>
        </div>
        <div className="ml-14">
          <p className="text-gray-700 mb-4">
            Once you've created a keyword search, it's time to find opportunities:
          </p>
          <ol className="list-decimal list-inside space-y-3 text-gray-700 mb-4">
            <li>Go to the <strong>Opportunities</strong> page</li>
            <li>Select the keyword search you want to use (or "All Searches")</li>
            <li>Click <strong>"Generate Opportunities"</strong></li>
            <li>Wait for the system to scan Reddit (usually takes a few minutes)</li>
            <li>Review the opportunities found</li>
          </ol>
          {/* Generate opportunities screenshot */}
          <div className="rounded-lg border border-gray-200 overflow-hidden shadow-sm mb-4">
            <Image
              src="/images/placeholders/generate_opputunity.png"
              alt="Generate opportunities button and process"
              width={1200}
              height={800}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* Next Steps */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">What's Next?</h2>
        <p className="text-gray-700 mb-4">
          Now that you've created your first search and generated opportunities, learn more about:
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/docs/keyword-searches"
            className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Managing Keyword Searches
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
          <Link
            href="/docs/opportunities"
            className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Managing Opportunities
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
}


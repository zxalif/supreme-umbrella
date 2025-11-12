import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Lightbulb, AlertCircle } from 'lucide-react';

export default function KeywordSearchesPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Keyword Searches</h1>
      <p className="text-xl text-gray-600 mb-8">
        Learn how to create and manage keyword searches to find opportunities matching your skills.
      </p>

      {/* Creating Searches */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Creating Keyword Searches</h2>
        <p className="text-gray-700 mb-4">
          Keyword searches are the core of ClientHunt. They tell the system what opportunities to look for on Reddit.
        </p>
        
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Step-by-Step Guide</h3>
          <ol className="list-decimal list-inside space-y-3 text-gray-700">
            <li>Navigate to <strong>Keyword Searches</strong> from the sidebar</li>
            <li>Click the <strong>"Create Search"</strong> button</li>
            <li>Enter a name for your search (e.g., "React Development")</li>
            <li>Add keywords using the auto-complete field or type custom keywords</li>
            <li>Select subreddits to monitor (use auto-complete for suggestions)</li>
            <li>Click <strong>"Create Search"</strong> to save</li>
          </ol>
        </div>

        {/* Keyword search creation form screenshot */}
        <div className="rounded-lg border border-gray-200 overflow-hidden shadow-sm mb-6">
          <Image
            src="/images/placeholders/keyword_searches_auto_complete.png"
            alt="Keyword search creation form with auto-complete"
            width={1200}
            height={800}
            className="w-full h-auto"
          />
        </div>
      </section>

      {/* Best Practices */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
          <Lightbulb className="w-6 h-6 text-yellow-500 mr-2" />
          Best Practices
        </h2>
        
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Be Specific</h3>
            <p className="text-blue-800 text-sm">
              Use exact skill names like "React developer" instead of just "developer". This helps find more relevant opportunities.
            </p>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h3 className="font-semibold text-purple-900 mb-2">Include Variations</h3>
            <p className="text-purple-800 text-sm">
              Add synonyms and related terms. For example, if you're a designer, include: "logo design", "brand identity", "visual identity", "graphic design".
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-900 mb-2">Use Industry Terms</h3>
            <p className="text-green-800 text-sm">
              Include common terms clients use: "freelance", "remote", "contract", "part-time", "full-time".
            </p>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <h3 className="font-semibold text-orange-900 mb-2">Start Small</h3>
            <p className="text-orange-800 text-sm">
              Begin with 3-5 keywords per search. You can always add more later based on what you find.
            </p>
          </div>
        </div>
      </section>

      {/* Managing Searches */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Managing Your Searches</h2>
        
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h3 className="font-semibold text-gray-900 mb-2">Enable/Disable</h3>
            <p className="text-gray-700 text-sm mb-3">
              Toggle searches on or off without deleting them. Disabled searches won't generate new opportunities.
            </p>
            {/* Placeholder for screenshot */}
            <div className="bg-gray-100 border border-gray-300 rounded p-4 text-center">
              <p className="text-gray-500 text-xs">📸 Toggle switch</p>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h3 className="font-semibold text-gray-900 mb-2">Edit Search</h3>
            <p className="text-gray-700 text-sm mb-3">
              Update keywords and subreddits anytime. Changes take effect on the next opportunity generation.
            </p>
            {/* Placeholder for screenshot */}
            <div className="bg-gray-100 border border-gray-300 rounded p-4 text-center">
              <p className="text-gray-500 text-xs">📸 Edit button</p>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h3 className="font-semibold text-gray-900 mb-2">Delete Search</h3>
            <p className="text-gray-700 text-sm mb-3">
              Remove searches you no longer need. This won't delete existing opportunities, only stops generating new ones.
            </p>
            {/* Placeholder for screenshot */}
            <div className="bg-gray-100 border border-gray-300 rounded p-4 text-center">
              <p className="text-gray-500 text-xs">📸 Delete button</p>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h3 className="font-semibold text-gray-900 mb-2">View Statistics</h3>
            <p className="text-gray-700 text-sm mb-3">
              See how many opportunities each search has found and track performance over time.
            </p>
            {/* Placeholder for screenshot */}
            <div className="bg-gray-100 border border-gray-300 rounded p-4 text-center">
              <p className="text-gray-500 text-xs">📸 Search stats</p>
            </div>
          </div>
        </div>
      </section>

      {/* Auto-Complete Feature */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Auto-Complete Suggestions</h2>
        <p className="text-gray-700 mb-4">
          ClientHunt includes intelligent auto-complete for both keywords and subreddits:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
          <li><strong>Popular Keywords:</strong> See the most commonly used keywords across all professions</li>
          <li><strong>Related Subreddits:</strong> Get suggestions based on your selected keywords</li>
          <li><strong>Category Grouping:</strong> Keywords and subreddits are organized by category</li>
          <li><strong>Search Functionality:</strong> Type to filter suggestions in real-time</li>
        </ul>
        {/* Auto-complete dropdown screenshot */}
        <div className="rounded-lg border border-gray-200 overflow-hidden shadow-sm mb-4">
          <Image
            src="/images/placeholders/auto-complete-dropdown-keyword-suggestion.png"
            alt="Auto-complete dropdown showing keyword suggestions"
            width={1200}
            height={800}
            className="w-full h-auto"
          />
        </div>
      </section>

      {/* Common Issues */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
          <AlertCircle className="w-6 h-6 text-red-500 mr-2" />
          Common Issues
        </h2>
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="font-semibold text-red-900 mb-2">Too Many Results</h3>
            <p className="text-red-800 text-sm">
              If you're getting too many irrelevant opportunities, make your keywords more specific or reduce the number of subreddits.
            </p>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-900 mb-2">Too Few Results</h3>
            <p className="text-yellow-800 text-sm">
              If you're not finding enough opportunities, try adding more keyword variations or including additional subreddits.
            </p>
          </div>
        </div>
      </section>

      {/* Next Steps */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Next Steps</h2>
        <p className="text-gray-700 mb-4">
          Now that you know how to create keyword searches, learn how to manage the opportunities they find:
        </p>
        <Link
          href="/docs/opportunities"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Managing Opportunities
          <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
      </div>
    </div>
  );
}


import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';

export const metadata: Metadata = {
  title: 'Changelog',
  description: 'ClientHunt Changelog - See what\'s new, what\'s improved, and what we\'re working on.',
};

export default function ChangelogPage() {
  const changelog = [
    {
      date: '2025-01-15',
      version: '1.0.0',
      type: 'major',
      items: [
        'Initial release of ClientHunt',
        'Reddit opportunity monitoring',
        'AI-powered lead scoring',
        'Keyword search management',
        'Real-time notifications',
        'Dashboard analytics',
      ],
    },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 md:p-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Changelog</h1>
            <p className="text-gray-600 mb-8">
              Stay up to date with the latest features, improvements, and fixes.
            </p>

            <div className="space-y-8">
              {changelog.map((release, index) => (
                <div key={index} className="border-b border-gray-200 pb-8 last:border-b-0 last:pb-0">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900">
                        Version {release.version}
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(release.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${release.type === 'major' ? 'bg-blue-100 text-blue-800' :
                        release.type === 'minor' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                      }`}>
                      {release.type}
                    </span>
                  </div>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    {release.items.map((item, itemIndex) => (
                      <li key={itemIndex}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-gray-600 mb-4">
                Want to be notified of updates? Follow us on social media or subscribe to our newsletter.
              </p>
              <Link
                href="/"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}


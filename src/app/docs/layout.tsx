import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { Book, Zap, Search, Target, Bell, BarChart, HelpCircle, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Documentation',
  description: 'ClientHunt Documentation - Learn how to use ClientHunt to find freelance opportunities on Reddit.',
};

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navItems = [
    { href: '/docs', label: 'Overview', icon: Book },
    { href: '/docs/getting-started', label: 'Getting Started', icon: Zap },
    { href: '/docs/keyword-searches', label: 'Keyword Searches', icon: Search },
    { href: '/docs/opportunities', label: 'Opportunities', icon: Target },
    // { href: '/docs/notifications', label: 'Notifications', icon: Bell }, // Commented out - feature not yet implemented
    { href: '/docs/analytics', label: 'Analytics', icon: BarChart },
    { href: '/docs/faq', label: 'FAQ', icon: HelpCircle },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Navigation */}
            <aside className="lg:w-64 flex-shrink-0">
              <div className="sticky top-24 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <Link href="/docs" className="flex items-center space-x-2 text-gray-900 hover:text-blue-600 transition-colors">
                    <Book className="w-5 h-5" />
                    <span className="font-semibold">Documentation</span>
                  </Link>
                </div>
                <nav className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <Link
                    href="/"
                    className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Home</span>
                  </Link>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}


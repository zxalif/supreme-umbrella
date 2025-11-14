import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import SearchResults from './SearchResults';
import SearchInput from './SearchInput';

export const metadata: Metadata = {
  title: 'Search - ClientHunt',
  description: 'Search ClientHunt for freelance opportunities, blog posts, and resources.',
  robots: {
    index: false, // Don't index search results pages
    follow: true,
  },
};

/**
 * Search Page
 * 
 * Handles site search functionality
 * Used by Google sitelinks search box
 */
export default function SearchPage() {
  return (
    <>
      {/* WebSiteSchema is included in root layout.tsx for all pages */}
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Search ClientHunt</h1>
            
            {/* Search Input */}
            <div className="mb-8">
              <Suspense fallback={
                <div className="relative">
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 bg-gray-200 rounded animate-pulse" />
                    <div className="w-full pl-12 pr-12 py-4 bg-gray-100 border-2 border-gray-200 rounded-lg animate-pulse" />
                  </div>
                </div>
              }>
                <SearchInput />
              </Suspense>
            </div>
            
            {/* Search Results */}
            <Suspense fallback={<div className="text-gray-600">Loading search results...</div>}>
              <SearchResults />
            </Suspense>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

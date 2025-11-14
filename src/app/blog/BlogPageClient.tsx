'use client';

import Link from 'next/link';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { Calendar, Clock, ArrowRight, Tag, Filter } from 'lucide-react';
import { useState, useMemo } from 'react';
import { 
  getAllBlogPosts, 
  getFeaturedBlogPosts, 
  getAllCategories, 
  getAllTags,
  type BlogCategory 
} from '@/lib/blog-data';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';

export function BlogPageClient() {
  const allPosts = getAllBlogPosts();
  const featuredPosts = getFeaturedBlogPosts();
  const categories = getAllCategories();
  const tags = getAllTags();
  
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory | 'All'>('All');
  const [selectedTag, setSelectedTag] = useState<string | 'All'>('All');

  // Filter posts based on selected category and tag
  const filteredPosts = useMemo(() => {
    let filtered = allPosts;
    
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }
    
    if (selectedTag !== 'All') {
      filtered = filtered.filter(post => post.tags.includes(selectedTag));
    }
    
    return filtered;
  }, [allPosts, selectedCategory, selectedTag]);

  const displayedPosts = filteredPosts.filter(post => !post.featured);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50" style={{ paddingTop: '80px' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-12">
          {/* Breadcrumbs - Using relative paths for internal navigation */}
          <Breadcrumbs
            items={[
              { name: 'Home', url: '/' },
              { name: 'Blog', url: '/blog' },
            ]}
          />
          
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">ClientHunt Blog</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tips, guides, and insights to help you find more freelance opportunities on Reddit.
            </p>
          </div>

          {/* Category and Tag Filters */}
          <div className="mb-8 space-y-4">
            {/* Category Filter */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Filter className="w-4 h-4 text-gray-600" />
                <h3 className="text-sm font-semibold text-gray-700">Categories</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory('All')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === 'All'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Tag Filter */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Tag className="w-4 h-4 text-gray-600" />
                <h3 className="text-sm font-semibold text-gray-700">Tags</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedTag('All')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    selectedTag === 'All'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                {tags.slice(0, 10).map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      selectedTag === tag
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Filters Display */}
            {(selectedCategory !== 'All' || selectedTag !== 'All') && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Filtered by:</span>
                {selectedCategory !== 'All' && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                    {selectedCategory}
                  </span>
                )}
                {selectedTag !== 'All' && (
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded">
                    {selectedTag}
                  </span>
                )}
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setSelectedTag('All');
                  }}
                  className="text-blue-600 hover:text-blue-700 underline"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>

          {/* Featured Posts */}
          {featuredPosts.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Featured Posts</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {featuredPosts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all"
                  >
                    <div className="p-6">
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                          {post.category}
                        </span>
                        <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded">
                          Featured
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 mb-4">{post.excerpt}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {post.readTime}
                          </span>
                        </div>
                        <span className="text-blue-600 font-medium group-hover:translate-x-1 transition-transform inline-flex items-center">
                          Read more
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* All Posts */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              All Posts {filteredPosts.length !== allPosts.length && `(${filteredPosts.length})`}
            </h2>
            {displayedPosts.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <p className="text-gray-600">No posts found with the selected filters.</p>
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setSelectedTag('All');
                  }}
                  className="mt-4 text-blue-600 hover:text-blue-700 underline"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                {displayedPosts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all"
                  >
                    <div className="p-6">
                      <div className="flex items-center flex-wrap gap-2 mb-3">
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                          {post.category}
                        </span>
                        {post.featured && (
                          <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded">
                            Featured
                          </span>
                        )}
                        {post.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center space-x-3">
                          <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                          <span>{post.readTime}</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* Coming Soon Notice */}
          <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
            <p className="text-blue-900">
              <strong>More content coming soon!</strong> We're working on helpful guides and tips for freelancers. 
              Have a topic suggestion? <Link href="/contact" className="underline hover:text-blue-700">Let us know</Link>.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}


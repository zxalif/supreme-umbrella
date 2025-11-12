import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'ClientHunt Blog - Tips, guides, and insights for freelancers finding opportunities on Reddit.',
};

// Static blog posts data
// Later, you can move this to a JSON file or markdown files
const blogPosts = [
  {
    slug: 'how-to-find-freelance-opportunities-on-reddit',
    title: 'How to Find Freelance Opportunities on Reddit: A Complete Guide',
    excerpt: 'Learn the best strategies for finding high-quality freelance opportunities on Reddit, including which subreddits to monitor and how to stand out.',
    author: 'ClientHunt Team',
    date: '2024-11-15',
    readTime: '8 min read',
    category: 'Guides',
    featured: true,
  },
  {
    slug: 'reddit-lead-generation-tips',
    title: '10 Reddit Lead Generation Tips Every Freelancer Should Know',
    excerpt: 'Discover proven strategies for generating leads on Reddit, from crafting the perfect response to building your reputation in relevant communities.',
    author: 'ClientHunt Team',
    date: '2024-11-10',
    readTime: '6 min read',
    category: 'Tips',
    featured: true,
  },
  {
    slug: 'best-subreddits-for-freelancers',
    title: 'The Best Subreddits for Freelancers in 2025',
    excerpt: 'A comprehensive list of the most active and valuable subreddits for finding freelance work across different industries and skill sets.',
    author: 'ClientHunt Team',
    date: '2024-11-05',
    readTime: '5 min read',
    category: 'Resources',
    featured: false,
  },
];

export default function BlogPage() {
  const featuredPosts = blogPosts.filter(post => post.featured);
  const regularPosts = blogPosts.filter(post => !post.featured);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">ClientHunt Blog</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tips, guides, and insights to help you find more freelance opportunities on Reddit.
            </p>
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
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">All Posts</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {blogPosts.map((post) => (
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
                      {post.featured && (
                        <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded">
                          Featured
                        </span>
                      )}
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


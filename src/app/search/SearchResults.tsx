'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, FileText, BookOpen, HelpCircle, Globe, Tag, Calendar } from 'lucide-react';

/**
 * Search Results Component
 * 
 * Comprehensive search across the entire platform:
 * - Blog posts (with full content search)
 * - Documentation pages
 * - Static pages
 * - FAQ content
 */
export default function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams?.get('q') || '';
  const [results, setResults] = useState<Array<{
    title: string;
    description: string;
    url: string;
    type: 'page' | 'blog' | 'docs' | 'faq';
    category?: string;
    date?: string;
    relevanceScore: number;
    matchedTerms: string[];
  }>>([]);

  useEffect(() => {
    if (query) {
      const searchResults = performSearch(query);
      setResults(searchResults);
    } else {
      setResults([]);
    }
  }, [query]);

  // Group results by type
  const groupedResults = useMemo(() => {
    const groups: Record<string, typeof results> = {
      blog: [],
      docs: [],
      page: [],
      faq: [],
    };
    
    results.forEach(result => {
      groups[result.type].push(result);
    });
    
    return groups;
  }, [results]);

  if (!query) {
    return (
      <div className="text-center py-12">
        <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-600 mb-4">Enter a search term to find content on ClientHunt</p>
        <p className="text-sm text-gray-500 mb-6">
          Try searching for: "freelance opportunities", "Reddit", "keyword search", "pricing", "getting started"
        </p>
        <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-400">
          <span className="px-3 py-1 bg-gray-100 rounded-full">Blog Posts</span>
          <span className="px-3 py-1 bg-gray-100 rounded-full">Documentation</span>
          <span className="px-3 py-1 bg-gray-100 rounded-full">FAQ</span>
          <span className="px-3 py-1 bg-gray-100 rounded-full">Pages</span>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-600 mb-2">No results found for "{query}"</p>
        <p className="text-sm text-gray-500 mb-4">
          Try different keywords or check out our{' '}
          <Link href="/blog" className="text-blue-600 hover:underline">blog</Link> or{' '}
          <Link href="/docs" className="text-blue-600 hover:underline">documentation</Link>
        </p>
        <div className="mt-6">
          <p className="text-sm text-gray-500 mb-2">Popular searches:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {['freelance', 'Reddit', 'keyword search', 'pricing', 'getting started'].map((term) => (
              <Link
                key={term}
                href={`/search?q=${encodeURIComponent(term)}`}
                className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 text-sm"
              >
                {term}
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-600">
          Found <strong className="text-gray-900">{results.length}</strong> result{results.length !== 1 ? 's' : ''} for "{query}"
        </p>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>Sorted by relevance</span>
        </div>
      </div>
      
      {/* Results grouped by type */}
      <div className="space-y-8">
        {/* Blog Posts */}
        {groupedResults.blog.length > 0 && (
          <section>
            <div className="flex items-center mb-4">
              <FileText className="w-5 h-5 text-blue-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Blog Posts ({groupedResults.blog.length})</h2>
            </div>
            <div className="space-y-4">
              {groupedResults.blog.map((result, index) => (
                <SearchResultCard key={`blog-${index}`} result={result} query={query} />
              ))}
            </div>
          </section>
        )}

        {/* Documentation */}
        {groupedResults.docs.length > 0 && (
          <section>
            <div className="flex items-center mb-4">
              <BookOpen className="w-5 h-5 text-purple-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Documentation ({groupedResults.docs.length})</h2>
            </div>
            <div className="space-y-4">
              {groupedResults.docs.map((result, index) => (
                <SearchResultCard key={`docs-${index}`} result={result} query={query} />
              ))}
            </div>
          </section>
        )}

        {/* FAQ */}
        {groupedResults.faq.length > 0 && (
          <section>
            <div className="flex items-center mb-4">
              <HelpCircle className="w-5 h-5 text-green-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">FAQ ({groupedResults.faq.length})</h2>
            </div>
            <div className="space-y-4">
              {groupedResults.faq.map((result, index) => (
                <SearchResultCard key={`faq-${index}`} result={result} query={query} />
              ))}
            </div>
          </section>
        )}

        {/* Pages */}
        {groupedResults.page.length > 0 && (
          <section>
            <div className="flex items-center mb-4">
              <Globe className="w-5 h-5 text-gray-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Pages ({groupedResults.page.length})</h2>
            </div>
            <div className="space-y-4">
              {groupedResults.page.map((result, index) => (
                <SearchResultCard key={`page-${index}`} result={result} query={query} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

/**
 * Search Result Card Component
 */
function SearchResultCard({ 
  result, 
  query 
}: { 
  result: {
    title: string;
    description: string;
    url: string;
    type: 'page' | 'blog' | 'docs' | 'faq';
    category?: string;
    date?: string;
    relevanceScore: number;
    matchedTerms: string[];
  };
  query: string;
}) {
  const getIcon = () => {
    switch (result.type) {
      case 'blog':
        return <FileText className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />;
      case 'docs':
        return <BookOpen className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />;
      case 'faq':
        return <HelpCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />;
      default:
        return <Globe className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />;
    }
  };

  // Highlight search terms in text
  const highlightText = (text: string, searchTerm: string) => {
    if (!searchTerm) return text;
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) => 
      regex.test(part) ? (
        <mark key={i} className="bg-yellow-200 px-1 rounded">{part}</mark>
      ) : (
        part
      )
    );
  };

  return (
    <Link
      href={result.url}
      className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
    >
      <div className="flex items-start space-x-3">
        {getIcon()}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600">
              {highlightText(result.title, query)}
            </h3>
            {result.category && (
              <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded flex-shrink-0">
                {result.category}
              </span>
            )}
          </div>
          
          <p className="text-gray-600 text-sm mb-2">
            {highlightText(result.description, query)}
          </p>
          
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="text-blue-600">{result.url}</span>
            {result.date && (
              <span className="flex items-center">
                <Calendar className="w-3 h-3 mr-1" />
                {new Date(result.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
              </span>
            )}
            {result.matchedTerms.length > 0 && (
              <span className="flex items-center">
                <Tag className="w-3 h-3 mr-1" />
                Matched: {result.matchedTerms.slice(0, 3).join(', ')}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

/**
 * Comprehensive search function with relevance scoring
 */
function performSearch(query: string): Array<{
  title: string;
  description: string;
  url: string;
  type: 'page' | 'blog' | 'docs' | 'faq';
  category?: string;
  date?: string;
  relevanceScore: number;
  matchedTerms: string[];
}> {
  const searchTerms = query.toLowerCase().split(/\s+/).filter(term => term.length > 0);
  const results: Array<{
    title: string;
    description: string;
    url: string;
    type: 'page' | 'blog' | 'docs' | 'faq';
    category?: string;
    date?: string;
    relevanceScore: number;
    matchedTerms: string[];
  }> = [];

  // Blog Posts Data
  const blogPosts = [
    {
      slug: 'how-to-find-freelance-opportunities-on-reddit',
      title: 'How to Find Freelance Opportunities on Reddit: A Complete Guide',
      excerpt: 'Learn the best strategies for finding high-quality freelance opportunities on Reddit, including which subreddits to monitor and how to stand out.',
      content: 'Reddit has become one of the best platforms for freelancers to find clients. With millions of active users and hundreds of job-related subreddits, there\'s no shortage of opportunities—if you know where to look. Reddit offers several advantages for freelancers: Direct client contact, Diverse opportunities, Active communities, Transparent communication. Best subreddits include r/forhire, r/hiring, r/freelance, r/DesignJobs, r/HireAWriter, r/Jobs4Bitcoins, r/remotejs. How to stand out: Respond quickly, Be specific, Show personality, Follow up. Using ClientHunt to automate your search.',
      category: 'Guides',
      date: '2024-11-15',
      keywords: ['reddit', 'freelance', 'opportunities', 'subreddits', 'forhire', 'hiring', 'guide', 'find clients', 'lead generation', 'automation'],
    },
    {
      slug: 'reddit-lead-generation-tips',
      title: '10 Reddit Lead Generation Tips Every Freelancer Should Know',
      excerpt: 'Discover proven strategies for generating leads on Reddit, from crafting the perfect response to building your reputation in relevant communities.',
      content: 'Generating leads on Reddit requires a different approach than traditional job boards. Monitor multiple subreddits, set up keyword alerts, respond within the first hour, personalize every response, build your Reddit reputation, include portfolio links, be transparent about pricing, follow up strategically, track your success, use automation wisely. Tools like ClientHunt can save you hours, but always personalize your responses.',
      category: 'Tips',
      date: '2024-11-10',
      keywords: ['lead generation', 'tips', 'reddit', 'freelance', 'strategies', 'reputation', 'portfolio', 'pricing', 'automation', 'clienthunt'],
    },
    {
      slug: 'best-subreddits-for-freelancers',
      title: 'The Best Subreddits for Freelancers in 2025',
      excerpt: 'A comprehensive list of the most active and valuable subreddits for finding freelance work across different industries and skill sets.',
      content: 'Here\'s a curated list of the most valuable subreddits for freelancers. General Freelance: r/forhire, r/hiring, r/freelance. Design: r/DesignJobs, r/logodesign, r/PhotoshopRequest. Writing & Content: r/HireAWriter, r/writing, r/content_marketing. Development: r/forhire, r/remotejs, r/Jobs4Bitcoins. Marketing: r/marketing, r/socialmedia, r/PPC. Tips for success: Join multiple subreddits, set up keyword monitoring, engage with the community, read the rules, use ClientHunt to monitor all these subreddits automatically.',
      category: 'Resources',
      date: '2024-11-05',
      keywords: ['subreddits', 'freelance', 'reddit', 'forhire', 'design', 'writing', 'development', 'marketing', 'jobs', 'opportunities', 'resources'],
    },
  ];

  // Documentation Pages
  const docsPages = [
    {
      slug: 'getting-started',
      title: 'Getting Started',
      description: 'Learn how to set up your account and create your first keyword search. Step-by-step guide to getting started with ClientHunt.',
      content: 'Welcome to ClientHunt! Create your account, verify your email, get a free 1-month trial with no credit card required. Create your first keyword search with skills you offer. Select subreddits to monitor for opportunities. Generate opportunities and start receiving notifications. Free trial includes full access to all features.',
      keywords: ['getting started', 'setup', 'account', 'trial', 'first search', 'beginner', 'guide', 'tutorial', 'onboarding'],
    },
    {
      slug: 'keyword-searches',
      title: 'Keyword Searches',
      description: 'Create and manage keyword searches to find opportunities matching your skills. Learn best practices for effective keyword searches.',
      content: 'Keyword searches are the core of ClientHunt. They tell the system what opportunities to look for on Reddit. Create searches with specific skill names, include variations and synonyms, add industry terms. Use auto-complete for suggestions. Select relevant subreddits. Best practices: Use specific keywords, include variations, monitor multiple subreddits, review and update regularly.',
      keywords: ['keyword', 'search', 'keywords', 'create', 'manage', 'skills', 'subreddits', 'monitoring', 'best practices'],
    },
    {
      slug: 'opportunities',
      title: 'Opportunities',
      description: 'Manage and track opportunities found on Reddit. Update statuses, export data, and organize your leads effectively.',
      content: 'Opportunities are potential leads found on Reddit that match your keyword searches. They are automatically discovered and scored based on relevance. View opportunities, update status (new, viewed, contacted, applied, won, lost), filter and sort, export data. ClientHunt monitors Reddit 24/7 and checks for new posts continuously.',
      keywords: ['opportunities', 'leads', 'manage', 'track', 'status', 'export', 'filter', 'sort', 'reddit', 'scoring'],
    },
    {
      slug: 'analytics',
      title: 'Analytics',
      description: 'Track your lead generation performance with detailed analytics and insights. Monitor your success metrics.',
      content: 'Analytics help you understand your lead generation performance. View metrics like opportunities found, conversion rates, top performing keywords, subreddit performance, response times. Use analytics to optimize your keyword searches and improve your success rate.',
      keywords: ['analytics', 'metrics', 'performance', 'insights', 'statistics', 'tracking', 'conversion', 'success', 'reports'],
    },
    {
      slug: 'faq',
      title: 'FAQ',
      description: 'Find answers to frequently asked questions about ClientHunt, features, pricing, and how it works.',
      content: 'Frequently asked questions about ClientHunt. How to create an account, free trial details, keyword searches, opportunities, pricing, features, support. Common questions about getting started, using the platform, and troubleshooting.',
      keywords: ['faq', 'questions', 'help', 'support', 'answers', 'troubleshooting', 'common', 'frequently asked'],
    },
  ];

  // FAQ Content
  const faqItems = [
    {
      question: 'How do I create an account?',
      answer: 'Click "Start Free Trial" on the homepage, enter your email and password, then verify your email address. You\'ll get a 1-month free trial with full access to all features.',
      keywords: ['account', 'create', 'sign up', 'register', 'trial', 'email', 'password'],
    },
    {
      question: 'Do I need a credit card for the free trial?',
      answer: 'No! The free trial requires no credit card. You can explore all features for a full month before deciding to subscribe.',
      keywords: ['credit card', 'free trial', 'no payment', 'subscription', 'trial'],
    },
    {
      question: 'How many keyword searches can I create?',
      answer: 'This depends on your plan. Starter plans typically allow 3-5 searches, while professional plans allow 10-20. Check your plan details in the subscription page.',
      keywords: ['keyword searches', 'limit', 'plan', 'starter', 'professional', 'searches'],
    },
    {
      question: 'What keywords should I use?',
      answer: 'Use specific skill names (e.g., "React developer" not just "developer"), include variations and synonyms, and add industry terms like "freelance" or "remote". Start with 3-5 keywords per search.',
      keywords: ['keywords', 'skills', 'specific', 'variations', 'synonyms', 'best practices'],
    },
    {
      question: 'How often does ClientHunt check Reddit?',
      answer: 'ClientHunt monitors Reddit 24/7 and checks for new posts continuously. When you generate opportunities, the system scans recent posts matching your keywords.',
      keywords: ['monitoring', 'reddit', '24/7', 'continuous', 'frequency', 'check', 'scan'],
    },
    {
      question: 'How does ClientHunt find opportunities?',
      answer: 'ClientHunt uses AI to monitor Reddit 24/7 for posts matching your keywords. When someone posts looking for services you offer, our system automatically detects it, scores it based on relevance and quality, and notifies you instantly.',
      keywords: ['ai', 'monitor', 'detect', 'score', 'relevance', 'quality', 'notify', 'automatic'],
    },
  ];

  // Static Pages
  const staticPages = [
    {
      title: 'Home',
      description: 'Find freelance opportunities on Reddit automatically with AI-powered lead generation. Free 1-month trial, no credit card required.',
      url: '/',
      keywords: ['home', 'freelance', 'reddit', 'opportunities', 'lead generation', 'ai', 'automation', 'trial'],
    },
    {
      title: 'Pricing',
      description: 'Choose the perfect plan for your freelance lead generation needs. Flexible pricing with free trial available.',
      url: '/#pricing',
      keywords: ['pricing', 'plans', 'subscription', 'cost', 'price', 'starter', 'professional', 'power'],
    },
    {
      title: 'Features',
      description: 'AI-powered features to help you find freelance opportunities on Reddit. 24/7 monitoring, smart scoring, instant notifications.',
      url: '/#features',
      keywords: ['features', 'ai', 'automation', 'monitoring', 'scoring', 'notifications', '24/7'],
    },
    {
      title: 'FAQ',
      description: 'Frequently asked questions about ClientHunt and how it works. Get answers to common questions.',
      url: '/#faq',
      keywords: ['faq', 'questions', 'help', 'support', 'answers'],
    },
    {
      title: 'About Us',
      description: 'Learn about ClientHunt and our mission to help freelancers find opportunities efficiently.',
      url: '/about',
      keywords: ['about', 'company', 'mission', 'team', 'story'],
    },
    {
      title: 'Contact',
      description: 'Get in touch with ClientHunt for support, questions, or feedback. We\'re here to help.',
      url: '/contact',
      keywords: ['contact', 'support', 'help', 'email', 'feedback', 'questions'],
    },
    {
      title: 'Blog',
      description: 'Tips, guides, and insights to help you find more freelance opportunities on Reddit.',
      url: '/blog',
      keywords: ['blog', 'articles', 'guides', 'tips', 'tutorials', 'insights'],
    },
    {
      title: 'Documentation',
      description: 'Complete documentation for using ClientHunt to find freelance opportunities on Reddit.',
      url: '/docs',
      keywords: ['docs', 'documentation', 'guide', 'tutorial', 'how to', 'help'],
    },
  ];

  // Calculate relevance score for a searchable item
  const calculateRelevance = (
    item: {
      title: string;
      description: string;
      content?: string;
      keywords?: string[];
    },
    searchTerms: string[]
  ): { score: number; matchedTerms: string[] } => {
    let score = 0;
    const matchedTerms: string[] = [];
    const searchableText = `${item.title} ${item.description} ${item.content || ''} ${(item.keywords || []).join(' ')}`.toLowerCase();

    searchTerms.forEach(term => {
      // Exact title match (highest score)
      if (item.title.toLowerCase().includes(term)) {
        score += 10;
        matchedTerms.push(term);
      }
      // Keyword match
      else if (item.keywords?.some(kw => kw.includes(term) || term.includes(kw))) {
        score += 8;
        matchedTerms.push(term);
      }
      // Description match
      else if (item.description.toLowerCase().includes(term)) {
        score += 5;
        matchedTerms.push(term);
      }
      // Content match
      else if (item.content && item.content.toLowerCase().includes(term)) {
        score += 3;
        matchedTerms.push(term);
      }
      // Partial match in searchable text
      else if (searchableText.includes(term)) {
        score += 1;
        matchedTerms.push(term);
      }
    });

    return { score, matchedTerms: [...new Set(matchedTerms)] };
  };

  // Search blog posts
  blogPosts.forEach(post => {
    const { score, matchedTerms } = calculateRelevance(
      { title: post.title, description: post.excerpt, content: post.content, keywords: post.keywords },
      searchTerms
    );
    
    if (score > 0) {
      results.push({
        title: post.title,
        description: post.excerpt,
        url: `/blog/${post.slug}`,
        type: 'blog',
        category: post.category,
        date: post.date,
        relevanceScore: score,
        matchedTerms,
      });
    }
  });

  // Search documentation
  docsPages.forEach(doc => {
    const { score, matchedTerms } = calculateRelevance(
      { title: doc.title, description: doc.description, content: doc.content, keywords: doc.keywords },
      searchTerms
    );
    
    if (score > 0) {
      results.push({
        title: doc.title,
        description: doc.description,
        url: `/docs/${doc.slug}`,
        type: 'docs',
        relevanceScore: score,
        matchedTerms,
      });
    }
  });

  // Search FAQ
  faqItems.forEach(faq => {
    const { score, matchedTerms } = calculateRelevance(
      { title: faq.question, description: faq.answer, keywords: faq.keywords },
      searchTerms
    );
    
    if (score > 0) {
      results.push({
        title: faq.question,
        description: faq.answer,
        url: '/docs/faq',
        type: 'faq',
        relevanceScore: score,
        matchedTerms,
      });
    }
  });

  // Search static pages
  staticPages.forEach(page => {
    const { score, matchedTerms } = calculateRelevance(
      { title: page.title, description: page.description, keywords: page.keywords },
      searchTerms
    );
    
    if (score > 0) {
      results.push({
        title: page.title,
        description: page.description,
        url: page.url,
        type: 'page',
        relevanceScore: score,
        matchedTerms,
      });
    }
  });

  // Sort by relevance score (highest first)
  return results.sort((a, b) => b.relevanceScore - a.relevanceScore);
}

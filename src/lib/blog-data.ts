/**
 * Blog Data Structure
 * 
 * Centralized blog post data with support for:
 * - Categories
 * - Tags
 * - SEO optimization
 * - Featured posts
 */

export type BlogCategory = 'Guides' | 'Tips' | 'Resources' | 'Comparisons' | 'Case Studies' | 'Strategies';

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  category: BlogCategory;
  tags: string[];
  featured: boolean;
  keywords?: string[]; // For SEO
  metaDescription?: string; // For SEO
  content?: string; // Full content for individual post pages
}

/**
 * All blog posts
 * 
 * This is the single source of truth for blog posts.
 * Update this file to add new posts or modify existing ones.
 */
export const blogPosts: BlogPost[] = [
  {
    slug: 'how-to-find-freelance-opportunities-on-reddit',
    title: 'How to Find Freelance Opportunities on Reddit: A Complete Guide',
    excerpt: 'Learn the best strategies for finding high-quality freelance opportunities on Reddit, including which subreddits to monitor and how to stand out.',
    author: 'ClientHunt Team',
    date: '2025-11-15',
    readTime: '8 min read',
    category: 'Guides',
    tags: ['reddit', 'freelance', 'lead-generation', 'beginners', 'guides'],
    featured: true,
    keywords: ['reddit freelance opportunities', 'find freelance work reddit', 'reddit job finder'],
    metaDescription: 'Complete guide to finding freelance opportunities on Reddit. Learn which subreddits to monitor, how to stand out, and strategies that work.',
  },
  {
    slug: 'reddit-lead-generation-tips',
    title: '10 Reddit Lead Generation Tips Every Freelancer Should Know',
    excerpt: 'Discover proven strategies for generating leads on Reddit, from crafting the perfect response to building your reputation in relevant communities.',
    author: 'ClientHunt Team',
    date: '2025-11-10',
    readTime: '6 min read',
    category: 'Tips',
    tags: ['reddit', 'lead-generation', 'tips', 'freelance', 'strategies'],
    featured: true,
    keywords: ['reddit lead generation tips', 'reddit freelance tips', 'reddit lead generation strategies'],
    metaDescription: '10 proven Reddit lead generation tips for freelancers. Learn how to find clients, craft perfect responses, and build your reputation on Reddit.',
  },
  {
    slug: 'best-subreddits-for-freelancers',
    title: 'The Best Subreddits for Freelancers in 2025',
    excerpt: 'A comprehensive list of the most active and valuable subreddits for finding freelance work across different industries and skill sets.',
    author: 'ClientHunt Team',
    date: '2025-11-05',
    readTime: '5 min read',
    category: 'Resources',
    tags: ['reddit', 'subreddits', 'resources', 'freelance', 'job-boards'],
    featured: false,
    keywords: ['best subreddits for freelancers', 'reddit freelance subreddits', 'freelance job subreddits'],
    metaDescription: 'Complete list of the best Reddit subreddits for freelancers in 2025. Find active communities for your industry and skill set.',
  },
  {
    slug: 'how-to-find-clients-on-reddit',
    title: 'How to Find Clients on Reddit: Complete Beginner\'s Guide',
    excerpt: 'New to Reddit? This comprehensive beginner\'s guide will teach you everything you need to know about finding clients on Reddit, from setting up your profile to closing deals.',
    author: 'ClientHunt Team',
    date: '2025-11-20',
    readTime: '10 min read',
    category: 'Guides',
    tags: ['reddit', 'beginners', 'guides', 'freelance', 'lead-generation'],
    featured: true,
    keywords: ['how to find clients on reddit', 'reddit client finder', 'reddit freelance guide'],
    metaDescription: 'Complete beginner\'s guide to finding clients on Reddit. Learn step-by-step how to set up your profile, find opportunities, and land your first client.',
  },
  {
    slug: 'reddit-vs-upwork-vs-fiverr',
    title: 'Reddit vs Upwork vs Fiverr: Which Platform is Best for Freelancers?',
    excerpt: 'Compare Reddit, Upwork, and Fiverr to find the best platform for your freelance business. We break down fees, competition, client quality, and earning potential.',
    author: 'ClientHunt Team',
    date: '2025-11-25',
    readTime: '12 min read',
    category: 'Comparisons',
    tags: ['reddit', 'upwork', 'fiverr', 'comparison', 'freelance-platforms'],
    featured: true,
    keywords: ['reddit vs upwork', 'reddit vs fiverr', 'best freelance platform', 'upwork vs fiverr vs reddit'],
    metaDescription: 'Detailed comparison of Reddit, Upwork, and Fiverr for freelancers. Compare fees, competition, client quality, and find the best platform for you.',
  },
  {
    slug: 'how-to-write-perfect-reddit-job-response',
    title: 'How to Write the Perfect Reddit Job Post Response (With Examples)',
    excerpt: 'Learn how to craft responses that get noticed and win clients. Includes real examples, templates, and proven strategies that work.',
    author: 'ClientHunt Team',
    date: '2025-11-30',
    readTime: '8 min read',
    category: 'Tips',
    tags: ['reddit', 'job-application', 'tips', 'freelance', 'communication'],
    featured: false,
    keywords: ['how to respond to reddit job posts', 'reddit job response template', 'reddit freelance response'],
    metaDescription: 'Learn how to write perfect Reddit job post responses that get noticed. Includes templates, examples, and proven strategies.',
  },
];

/**
 * Get all blog posts
 */
export function getAllBlogPosts(): BlogPost[] {
  return blogPosts;
}

/**
 * Get blog post by slug
 */
export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find(post => post.slug === slug);
}

/**
 * Get featured blog posts
 */
export function getFeaturedBlogPosts(): BlogPost[] {
  return blogPosts.filter(post => post.featured);
}

/**
 * Get blog posts by category
 */
export function getBlogPostsByCategory(category: BlogCategory): BlogPost[] {
  return blogPosts.filter(post => post.category === category);
}

/**
 * Get blog posts by tag
 */
export function getBlogPostsByTag(tag: string): BlogPost[] {
  return blogPosts.filter(post => post.tags.includes(tag));
}

/**
 * Get all unique categories
 */
export function getAllCategories(): BlogCategory[] {
  const categories = blogPosts.map(post => post.category);
  return Array.from(new Set(categories)) as BlogCategory[];
}

/**
 * Get all unique tags
 */
export function getAllTags(): string[] {
  const allTags = blogPosts.flatMap(post => post.tags);
  return Array.from(new Set(allTags)).sort();
}

/**
 * Get related blog posts (by category or tags)
 */
export function getRelatedBlogPosts(currentSlug: string, limit: number = 3): BlogPost[] {
  const currentPost = getBlogPostBySlug(currentSlug);
  if (!currentPost) return [];

  const related = blogPosts
    .filter(post => post.slug !== currentSlug)
    .filter(post => 
      post.category === currentPost.category || 
      post.tags.some(tag => currentPost.tags.includes(tag))
    )
    .slice(0, limit);

  return related;
}


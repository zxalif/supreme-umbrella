import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';
import { ShareButtons } from './ShareButtons';
import { ArticleSchema, BreadcrumbSchema } from '@/components/seo/StructuredData';
import { BreadcrumbsWrapper } from '@/components/navigation/BreadcrumbsWrapper';
import { getBlogPostBySlug, getRelatedBlogPosts } from '@/lib/blog-data';
import { blogPostContent } from '@/lib/blog-content';

// SECURITY: Simple HTML sanitization for server-side rendering
// Since blog content is static and controlled, we use a simple regex-based sanitizer
// This avoids jsdom/parse5 ES module issues in Next.js
function sanitizeHtml(html: string): string {
  // Remove script tags and event handlers
  let sanitized = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/on\w+\s*=\s*[^\s>]*/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/data:text\/html/gi, '');
  
  // Only allow specific safe tags and attributes
  const allowedTags = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'strong', 'em', 'a', 'ul', 'ol', 'li', 'code', 'pre', 'blockquote'];
  const allowedAttrs = ['href', 'class', 'target', 'rel'];
  
  // Remove any tags not in allowed list
  const tagRegex = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;
  sanitized = sanitized.replace(tagRegex, (match, tagName) => {
    if (allowedTags.includes(tagName.toLowerCase())) {
      // Remove any attributes not in allowed list
      let cleanMatch = match.replace(/\s+([a-z-]+)\s*=\s*["'][^"']*["']/gi, (attrMatch, attrName) => {
        if (allowedAttrs.includes(attrName.toLowerCase())) {
          return attrMatch;
        }
        return '';
      });
      // Remove any attributes without quotes
      cleanMatch = cleanMatch.replace(/\s+([a-z-]+)\s*=\s*[^\s>]*/gi, (attrMatch, attrName) => {
        if (allowedAttrs.includes(attrName.toLowerCase())) {
          return attrMatch;
        }
        return '';
      });
      return cleanMatch;
    }
    return '';
  });
  
  return sanitized;
}

// Static blog posts content
// Later, you can move this to markdown files or a JSON file
const blogPosts: Record<string, {
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  content: string;
}> = {
  'how-to-find-freelance-opportunities-on-reddit': {
    title: 'How to Find Freelance Opportunities on Reddit: A Complete Guide',
    excerpt: 'Learn the best strategies for finding high-quality freelance opportunities on Reddit, including which subreddits to monitor and how to stand out.',
    author: 'ClientHunt Team',
    date: '2025-11-15',
    readTime: '8 min read',
    category: 'Guides',
    content: `
# How to Find Freelance Opportunities on Reddit: A Complete Guide

Reddit has become one of the best platforms for freelancers to find clients. With millions of active users and hundreds of job-related subreddits, there's no shortage of opportunities—if you know where to look.

## Why Reddit for Freelancing?

Reddit offers several advantages for freelancers:

- **Direct client contact**: No middlemen or platforms taking large fees
- **Diverse opportunities**: From one-off projects to long-term contracts
- **Active communities**: Engaged users who are serious about hiring
- **Transparent communication**: See the full conversation before responding

## Best Subreddits for Freelancers

### General Freelance Subreddits

- **r/forhire**: The largest and most active freelance job board on Reddit
- **r/hiring**: Another popular subreddit for job postings
- **r/freelance**: Community discussions and occasional job postings

### Industry-Specific Subreddits

- **r/DesignJobs**: For graphic designers, UI/UX designers, and visual artists
- **r/HireAWriter**: Content writers, copywriters, and editors
- **r/Jobs4Bitcoins**: Remote work and freelance opportunities
- **r/remotejs**: Remote JavaScript and web development jobs

## How to Stand Out

1. **Respond quickly**: Early responses get more attention
2. **Be specific**: Mention relevant experience and portfolio links
3. **Show personality**: Reddit users appreciate authentic communication
4. **Follow up**: If you don't hear back, a polite follow-up can help

## Using ClientHunt to Automate Your Search

Instead of manually checking Reddit all day, ClientHunt monitors these subreddits 24/7 and notifies you when opportunities matching your skills are posted. This saves you hours of scrolling and ensures you never miss a relevant opportunity.

## Conclusion

Reddit is a goldmine for freelance opportunities, but it requires time and strategy. By focusing on the right subreddits and using tools like ClientHunt, you can significantly increase your chances of finding great clients.
    `.trim(),
  },
  'reddit-lead-generation-tips': {
    title: '10 Reddit Lead Generation Tips Every Freelancer Should Know',
    excerpt: 'Discover proven strategies for generating leads on Reddit, from crafting the perfect response to building your reputation in relevant communities.',
    author: 'ClientHunt Team',
    date: '2025-11-10',
    readTime: '6 min read',
    category: 'Tips',
    content: `
# 10 Reddit Lead Generation Tips Every Freelancer Should Know

Generating leads on Reddit requires a different approach than traditional job boards. Here are 10 proven tips to help you succeed:

## 1. Monitor Multiple Subreddits

Don't limit yourself to just r/forhire. Each subreddit has its own culture and client types. Diversify your sources.

## 2. Set Up Keyword Alerts

Use tools like ClientHunt to monitor specific keywords related to your skills. This ensures you catch opportunities even in smaller subreddits.

## 3. Respond Within the First Hour

Early responses have a much higher success rate. Set up notifications to respond quickly.

## 4. Personalize Every Response

Generic copy-paste responses are easy to spot. Take time to address the client's specific needs.

## 5. Build Your Reddit Reputation

Contribute valuable content to relevant subreddits. A good reputation makes clients more likely to trust you.

## 6. Include Portfolio Links

Always include relevant portfolio pieces or case studies. Visual proof of your work is powerful.

## 7. Be Transparent About Pricing

If the client mentions a budget, be honest about whether it works for you. Don't waste time on mismatched expectations.

## 8. Follow Up Strategically

If you don't hear back, send one polite follow-up after 2-3 days. More than that can seem pushy.

## 9. Track Your Success

Monitor which subreddits and keywords generate the most leads. Double down on what works.

## 10. Use Automation Wisely

Tools like ClientHunt can save you hours, but always personalize your responses. Automation should help you find opportunities, not replace human connection.

## Conclusion

Reddit lead generation is about being proactive, authentic, and strategic. With these tips and the right tools, you can build a steady stream of freelance opportunities.
    `.trim(),
  },
  'best-subreddits-for-freelancers': {
    title: 'The Best Subreddits for Freelancers in 2025',
    excerpt: 'A comprehensive list of the most active and valuable subreddits for finding freelance work across different industries and skill sets.',
    author: 'ClientHunt Team',
    date: '2025-11-05',
    readTime: '5 min read',
    category: 'Resources',
    content: `
# The Best Subreddits for Freelancers in 2025

Here's a curated list of the most valuable subreddits for freelancers, organized by category:

## General Freelance

- **r/forhire**: The largest freelance job board (500k+ members)
- **r/hiring**: Active job postings across all industries
- **r/freelance**: Community discussions and resources

## Design

- **r/DesignJobs**: Graphic design, UI/UX, branding
- **r/logodesign**: Logo design projects
- **r/PhotoshopRequest**: Quick design tasks

## Writing & Content

- **r/HireAWriter**: Content writing, copywriting, editing
- **r/writing**: Writing community and opportunities
- **r/content_marketing**: Content strategy and creation

## Development

- **r/forhire**: Web development, mobile apps
- **r/remotejs**: Remote JavaScript jobs
- **r/Jobs4Bitcoins**: Tech and remote work

## Marketing

- **r/marketing**: Marketing discussions and opportunities
- **r/socialmedia**: Social media management
- **r/PPC**: Pay-per-click and digital advertising

## Tips for Success

1. **Join multiple subreddits** in your niche
2. **Set up keyword monitoring** for your skills
3. **Engage with the community** before posting
4. **Read the rules** of each subreddit carefully
5. **Use ClientHunt** to monitor all these subreddits automatically

## Conclusion

The key to success on Reddit is being in the right place at the right time. By monitoring these subreddits with ClientHunt, you'll never miss an opportunity that matches your skills.
    `.trim(),
  },
};

/**
 * Convert markdown to HTML
 * Handles headers, bold, italic, lists, and paragraphs
 */
function markdownToHtml(markdown: string): string {
  const lines = markdown.split('\n');
  const processedLines: string[] = [];
  let currentParagraph: string[] = [];
  let inUnorderedList = false;
  let inOrderedList = false;
  let listItems: string[] = [];

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      const paragraphText = currentParagraph.join(' ');
      // Process inline markdown (bold, italic, links, contextual links) BEFORE wrapping in <p>
      const processedText = processInlineMarkdown(paragraphText);
      processedLines.push(`<p class="mb-4 leading-relaxed">${processedText}</p>`);
      currentParagraph = [];
    }
  };

  const flushList = () => {
    if (listItems.length > 0) {
      if (inUnorderedList) {
        processedLines.push(`<ul class="list-disc list-inside my-4 space-y-2">${listItems.join('')}</ul>`);
      } else if (inOrderedList) {
        processedLines.push(`<ol class="list-decimal list-inside my-4 space-y-2">${listItems.join('')}</ol>`);
      }
      listItems = [];
      inUnorderedList = false;
      inOrderedList = false;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();

    // Skip empty lines
    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }

    // Check for headers (# ## ### etc.)
    const headerMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headerMatch) {
      flushParagraph();
      flushList();
      const level = headerMatch[1].length;
      const text = processInlineMarkdown(headerMatch[2]);
      const sizeClass = level === 1 ? '3xl' : level === 2 ? '2xl' : 'xl';
      processedLines.push(`<h${level} class="text-${sizeClass} font-bold mt-8 mb-4">${text}</h${level}>`);
      continue;
    }

    // Check for unordered list (- item)
    const unorderedMatch = line.match(/^-\s+(.+)$/);
    if (unorderedMatch) {
      flushParagraph();
      if (inOrderedList) {
        flushList();
      }
      inUnorderedList = true;
      const text = processInlineMarkdown(unorderedMatch[1]);
      listItems.push(`<li class="mb-2">${text}</li>`);
      continue;
    }

    // Check for ordered list (1. item)
    const orderedMatch = line.match(/^\d+\.\s+(.+)$/);
    if (orderedMatch) {
      flushParagraph();
      if (inUnorderedList) {
        flushList();
      }
      inOrderedList = true;
      const text = processInlineMarkdown(orderedMatch[1]);
      listItems.push(`<li class="mb-2">${text}</li>`);
      continue;
    }

    // Regular text line
    flushList();
    currentParagraph.push(line);
  }

  // Flush any remaining content
  flushParagraph();
  flushList();

  // Join all processed lines - paragraphs are already processed
  return processedLines.join('\n');
}

/**
 * Add contextual internal links to content
 * Links relevant keywords to internal pages
 * IMPORTANT: Only processes plain text, never HTML
 */
function addContextualLinks(text: string): string {
  // Skip if text contains any HTML tags - this should never happen
  // as we only call this on plain text
  if (/<[a-z][\s\S]*>/i.test(text)) {
    console.warn('addContextualLinks called on HTML text, skipping');
    return text;
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://clienthunt.app';
  
  // Internal link mappings (keyword -> URL)
  // Sort by length (longest first) to avoid partial matches
  const internalLinks: Array<[string, string]> = [
    ['ClientHunt.app', '/'],
    ['keyword searches', '/docs/keyword-searches'],
    ['keyword search', '/docs/keyword-searches'],
    ['getting started', '/docs/getting-started'],
    ['ClientHunt', '/'],
    ['documentation', '/docs'],
    ['opportunities', '/docs/opportunities'],
    ['analytics', '/docs/analytics'],
    ['pricing', '/pricing'],
    ['blog', '/blog'],
    // 'docs' should be last to avoid matching it in 'documentation'
    ['docs', '/docs'],
  ];

  // Plain text processing only
  return processTextForLinks(text, internalLinks);
}

/**
 * Process plain text to add contextual links
 * Does not process HTML or text already inside links
 */
function processTextForLinks(text: string, internalLinks: Array<[string, string]>): string {
  let processedText = text;
  
  for (const [keyword, url] of internalLinks) {
    // Create regex to match whole words only (case-insensitive)
    // Match word boundaries (not letters/numbers before/after)
    const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(^|[^a-zA-Z0-9/])${escapedKeyword}([^a-zA-Z0-9/]|$)`, 'gi');
    
    // Use replace with a function that tracks position
    let lastIndex = 0;
    const result: string[] = [];
    let match;
    
    while ((match = regex.exec(processedText)) !== null) {
      const before = match[1] || '';
      const after = match[2] || '';
      const matchStart = match.index;
      const matchEnd = matchStart + match[0].length;
      
      // Add text before the match
      result.push(processedText.substring(lastIndex, matchStart));
      
      // Don't link if it's part of a URL path (has / before or after)
      if (before === '/' || after === '/') {
        result.push(match[0]);
        lastIndex = matchEnd;
        continue;
      }
      
      // Check if we're inside an HTML tag or existing link
      const beforeText = processedText.substring(0, matchStart);
      
      // Count unclosed <a> tags before this position
      const openATags = (beforeText.match(/<a\b[^>]*>/gi) || []).length;
      const closeATags = (beforeText.match(/<\/a>/gi) || []).length;
      
      // If we're inside an <a> tag, don't link
      if (openATags > closeATags) {
        result.push(match[0]);
        lastIndex = matchEnd;
        continue;
      }
      
      // Check if we're inside any HTML tag (not just <a>)
      const lastOpenTag = beforeText.lastIndexOf('<');
      const lastCloseTag = beforeText.lastIndexOf('>');
      if (lastOpenTag > lastCloseTag) {
        // We're inside an HTML tag (like in an attribute)
        result.push(match[0]);
        lastIndex = matchEnd;
        continue;
      }
      
      // Create the link, preserving the before/after characters
      result.push(`${before}<a href="${url}" class="text-blue-600 hover:text-blue-700 underline font-medium">${keyword}</a>${after}`);
      lastIndex = matchEnd;
    }
    
    // Add remaining text
    result.push(processedText.substring(lastIndex));
    processedText = result.join('');
  }

  return processedText;
}

/**
 * Process inline markdown (bold, italic, links)
 * SECURITY: Link URLs are validated to prevent javascript: and data: URLs
 */
function processInlineMarkdown(text: string): string {
  // Convert bold (**text**)
  text = text.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>');

  // Convert italic (*text*) - but not if it's part of bold
  text = text.replace(/(?<!\*)\*([^*\n]+?)\*(?!\*)/g, '<em>$1</em>');

  // Convert links [text](url) - SECURITY: Validate URL to prevent XSS
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, linkText, url) => {
    // Sanitize URL - only allow http, https, mailto, and relative URLs
    const sanitizedUrl = sanitizeUrl(url);
    if (!sanitizedUrl) {
      // If URL is invalid, return just the text without link
      return linkText;
    }
    return `<a href="${sanitizedUrl}" class="text-blue-600 hover:text-blue-700 underline" target="_blank" rel="noopener noreferrer">${linkText}</a>`;
  });

  // Add contextual internal links - ONLY on plain text, not HTML
  // Skip if text already contains HTML tags (means it's been processed)
  if (!/<[a-z][\s\S]*>/i.test(text)) {
    text = addContextualLinks(text);
  }

  return text;
}

/**
 * Sanitize URL to prevent XSS attacks
 * Only allows http, https, mailto, and relative URLs
 */
function sanitizeUrl(url: string): string | null {
  if (!url || typeof url !== 'string') {
    return null;
  }
  
  const trimmed = url.trim().toLowerCase();
  
  // Block dangerous protocols
  if (trimmed.startsWith('javascript:') || 
      trimmed.startsWith('data:') || 
      trimmed.startsWith('vbscript:') ||
      trimmed.startsWith('file:') ||
      trimmed.startsWith('on')) {
    return null;
  }
  
  // Allow http, https, mailto, and relative URLs
  if (trimmed.startsWith('http://') || 
      trimmed.startsWith('https://') || 
      trimmed.startsWith('mailto:') ||
      trimmed.startsWith('/') ||
      trimmed.startsWith('#')) {
    return url.trim(); // Return original (not lowercased) for display
  }
  
  // Allow relative URLs (no protocol)
  if (!trimmed.includes(':')) {
    return url.trim();
  }
  
  // Block everything else
  return null;
}

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://clienthunt.app';

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      section: post.category,
      url: `${baseUrl}/blog/${slug}`,
      images: [
        {
          url: `${baseUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [`${baseUrl}/og-image.jpg`],
    },
    alternates: {
      canonical: `${baseUrl}/blog/${slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Get related posts using the smart algorithm
  const relatedPosts = getRelatedBlogPosts(slug, 3);

  // Get content from blogPostContent
  const postContent = blogPostContent[slug] || '';
  
  if (!postContent) {
    // If no content found, show a message
    console.warn(`No content found for blog post: ${slug}`);
  }

  // Convert markdown to HTML and sanitize
  const htmlContent = markdownToHtml(postContent);
  const sanitizedContent = sanitizeHtml(htmlContent);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://clienthunt.app';
  const postUrl = `${baseUrl}/blog/${slug}`;

  return (
    <>
      {/* Structured Data for SEO */}
      <ArticleSchema
        title={post.title}
        description={post.excerpt}
        author={post.author}
        datePublished={post.date}
        dateModified={post.date}
        url={postUrl}
        category={post.category}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: baseUrl },
          { name: 'Blog', url: `${baseUrl}/blog` },
          { name: post.title, url: postUrl },
        ]}
      />
      
      <Navbar />
      <div className="min-h-screen bg-gray-50" style={{ paddingTop: '80px' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-12">
          {/* Breadcrumbs - Using relative paths for internal navigation */}
          <BreadcrumbsWrapper
            items={[
              { name: 'Home', url: '/' },
              { name: 'Blog', url: '/blog' },
              { name: post.title, url: `/blog/${slug}` },
            ]}
          />

          {/* Article Header */}
          <article className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 md:p-12">
            <div className="mb-6">
              <span className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded">
                {post.category}
              </span>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>

            <div className="flex items-center space-x-6 text-sm text-gray-600 mb-8 pb-8 border-b border-gray-200">
              <span className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                {post.readTime}
              </span>
              <span>By {post.author}</span>
            </div>

            {/* Article Content */}
            <div 
              className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700 prose-li:text-gray-700"
              dangerouslySetInnerHTML={{ 
                __html: sanitizedContent
              }}
            />

            {/* Share Section */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <ShareButtons title={post.title} slug={slug} />
                <Link
                  href="/blog"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  ← Back to Blog
                </Link>
              </div>
            </div>
          </article>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Related Posts</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => {
                  const relatedPostData = blogPosts[relatedPost.slug];
                  if (!relatedPostData) return null;
                  
                  return (
                    <Link
                      key={relatedPost.slug}
                      href={`/blog/${relatedPost.slug}`}
                      className="block bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                          {relatedPost.category}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                        {relatedPost.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{relatedPost.excerpt}</p>
                      <span className="text-blue-600 text-sm font-medium">Read more →</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}


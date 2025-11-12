/**
 * Subreddit Suggestions Data
 * 
 * Static subreddit suggestions organized by category.
 * These are the most relevant subreddits for freelance opportunities.
 * 
 * Later: This data will be aggregated from database analytics.
 */

export interface SubredditSuggestion {
  name: string;
  category: string;
  description?: string;
  relatedKeywords?: string[];
  popularity?: number; // 1-10 scale, higher = more popular
}

export interface SubredditCategory {
  id: string;
  name: string;
  icon: string;
  subreddits: SubredditSuggestion[];
}

/**
 * Subreddit suggestions organized by category
 */
export const SUBREDDIT_CATEGORIES: SubredditCategory[] = [
  {
    id: 'general',
    name: 'General Hiring',
    icon: '💼',
    subreddits: [
      { name: 'forhire', category: 'general', description: 'General freelance and job opportunities', popularity: 10, relatedKeywords: ['developer', 'designer', 'writer', 'marketer'] },
      { name: 'jobs4bitcoins', category: 'general', description: 'Jobs paid in cryptocurrency', popularity: 6, relatedKeywords: ['developer', 'designer', 'writer'] },
      { name: 'slavelabour', category: 'general', description: 'Quick tasks and small jobs', popularity: 7, relatedKeywords: ['data entry', 'transcription', 'virtual assistant'] },
      { name: 'remotework', category: 'general', description: 'Remote work opportunities', popularity: 8, relatedKeywords: ['developer', 'designer', 'writer', 'marketer'] },
    ],
  },
  {
    id: 'development',
    name: 'Development',
    icon: '💻',
    subreddits: [
      { name: 'webdev', category: 'development', description: 'Web development discussions and jobs', popularity: 9, relatedKeywords: ['web developer', 'frontend', 'backend', 'full stack'] },
      { name: 'programming', category: 'development', description: 'General programming discussions', popularity: 9, relatedKeywords: ['developer', 'programmer', 'software engineer'] },
      { name: 'reactjs', category: 'development', description: 'React.js community', popularity: 9, relatedKeywords: ['react developer', 'react', 'frontend'] },
      { name: 'nextjs', category: 'development', description: 'Next.js framework', popularity: 8, relatedKeywords: ['next.js', 'react', 'full stack'] },
      { name: 'javascript', category: 'development', description: 'JavaScript community', popularity: 9, relatedKeywords: ['javascript developer', 'js', 'frontend'] },
      { name: 'node', category: 'development', description: 'Node.js community', popularity: 8, relatedKeywords: ['node.js', 'backend', 'javascript'] },
      { name: 'typescript', category: 'development', description: 'TypeScript community', popularity: 8, relatedKeywords: ['typescript', 'javascript', 'developer'] },
      { name: 'Python', category: 'development', description: 'Python programming', popularity: 9, relatedKeywords: ['python developer', 'python', 'backend'] },
      { name: 'django', category: 'development', description: 'Django web framework', popularity: 8, relatedKeywords: ['django', 'python', 'backend'] },
      { name: 'flask', category: 'development', description: 'Flask web framework', popularity: 7, relatedKeywords: ['flask', 'python', 'backend'] },
      { name: 'PHP', category: 'development', description: 'PHP programming', popularity: 7, relatedKeywords: ['php developer', 'php', 'backend'] },
      { name: 'laravel', category: 'development', description: 'Laravel PHP framework', popularity: 7, relatedKeywords: ['laravel', 'php', 'backend'] },
      { name: 'golang', category: 'development', description: 'Go programming language', popularity: 7, relatedKeywords: ['go developer', 'golang', 'backend'] },
      { name: 'rust', category: 'development', description: 'Rust programming language', popularity: 6, relatedKeywords: ['rust developer', 'rust', 'systems programming'] },
      { name: 'java', category: 'development', description: 'Java programming', popularity: 8, relatedKeywords: ['java developer', 'java', 'backend'] },
      { name: 'csharp', category: 'development', description: 'C# programming', popularity: 7, relatedKeywords: ['c# developer', 'csharp', '.net'] },
      { name: 'iOSProgramming', category: 'development', description: 'iOS development', popularity: 8, relatedKeywords: ['ios developer', 'swift', 'mobile'] },
      { name: 'androiddev', category: 'development', description: 'Android development', popularity: 8, relatedKeywords: ['android developer', 'kotlin', 'mobile'] },
      { name: 'reactnative', category: 'development', description: 'React Native mobile development', popularity: 8, relatedKeywords: ['react native', 'mobile', 'react'] },
      { name: 'FlutterDev', category: 'development', description: 'Flutter mobile development', popularity: 7, relatedKeywords: ['flutter', 'mobile', 'dart'] },
      { name: 'Wordpress', category: 'development', description: 'WordPress development', popularity: 8, relatedKeywords: ['wordpress developer', 'wordpress', 'cms'] },
      { name: 'shopify', category: 'development', description: 'Shopify development', popularity: 7, relatedKeywords: ['shopify developer', 'ecommerce', 'web development'] },
      { name: 'devops', category: 'development', description: 'DevOps practices and tools', popularity: 8, relatedKeywords: ['devops', 'aws', 'docker', 'kubernetes'] },
      { name: 'aws', category: 'development', description: 'Amazon Web Services', popularity: 8, relatedKeywords: ['aws', 'cloud', 'devops'] },
      { name: 'docker', category: 'development', description: 'Docker containerization', popularity: 8, relatedKeywords: ['docker', 'containers', 'devops'] },
      { name: 'kubernetes', category: 'development', description: 'Kubernetes orchestration', popularity: 7, relatedKeywords: ['kubernetes', 'k8s', 'devops'] },
      { name: 'ethereum', category: 'development', description: 'Ethereum blockchain development', popularity: 7, relatedKeywords: ['blockchain', 'web3', 'solidity'] },
      { name: 'web3', category: 'development', description: 'Web3 and blockchain', popularity: 7, relatedKeywords: ['web3', 'blockchain', 'crypto'] },
    ],
  },
  {
    id: 'design',
    name: 'Design',
    icon: '🎨',
    subreddits: [
      { name: 'graphic_design', category: 'design', description: 'Graphic design community', popularity: 9, relatedKeywords: ['graphic designer', 'logo designer', 'brand designer'] },
      { name: 'Design', category: 'design', description: 'General design discussions', popularity: 8, relatedKeywords: ['designer', 'graphic design', 'ui design'] },
      { name: 'userexperience', category: 'design', description: 'UX design community', popularity: 9, relatedKeywords: ['ux designer', 'ui/ux', 'user experience'] },
      { name: 'UI_Design', category: 'design', description: 'UI design community', popularity: 9, relatedKeywords: ['ui designer', 'interface design', 'ui/ux'] },
      { name: 'web_design', category: 'design', description: 'Web design community', popularity: 9, relatedKeywords: ['web designer', 'website design', 'ui design'] },
      { name: 'logos', category: 'design', description: 'Logo design showcase', popularity: 7, relatedKeywords: ['logo designer', 'logo design', 'branding'] },
      { name: 'Illustration', category: 'design', description: 'Illustration and art', popularity: 7, relatedKeywords: ['illustrator', 'illustration', 'digital art'] },
      { name: 'FigmaDesign', category: 'design', description: 'Figma design tool', popularity: 8, relatedKeywords: ['figma', 'ui design', 'design tool'] },
      { name: 'Adobe_XD', category: 'design', description: 'Adobe XD design tool', popularity: 6, relatedKeywords: ['adobe xd', 'ui design', 'prototyping'] },
      { name: 'sketchapp', category: 'design', description: 'Sketch design tool', popularity: 6, relatedKeywords: ['sketch', 'ui design', 'mac design'] },
      { name: 'photoshop', category: 'design', description: 'Adobe Photoshop', popularity: 8, relatedKeywords: ['photoshop', 'photo editing', 'graphic design'] },
      { name: 'AdobeIllustrator', category: 'design', description: 'Adobe Illustrator', popularity: 8, relatedKeywords: ['illustrator', 'vector graphics', 'graphic design'] },
      { name: 'indesign', category: 'design', description: 'Adobe InDesign', popularity: 6, relatedKeywords: ['indesign', 'layout design', 'print design'] },
      { name: 'motiongraphics', category: 'design', description: 'Motion graphics and animation', popularity: 7, relatedKeywords: ['motion graphics', 'animation', 'after effects'] },
      { name: 'AfterEffects', category: 'design', description: 'Adobe After Effects', popularity: 7, relatedKeywords: ['after effects', 'motion graphics', 'animation'] },
      { name: '3Dmodeling', category: 'design', description: '3D modeling and design', popularity: 6, relatedKeywords: ['3d designer', '3d modeling', 'blender'] },
      { name: 'blender', category: 'design', description: 'Blender 3D software', popularity: 7, relatedKeywords: ['blender', '3d modeling', 'animation'] },
    ],
  },
  {
    id: 'writing',
    name: 'Writing & Content',
    icon: '✍️',
    subreddits: [
      { name: 'HireAWriter', category: 'writing', description: 'Hire freelance writers', popularity: 9, relatedKeywords: ['writer', 'content writer', 'copywriter'] },
      { name: 'freelanceWriters', category: 'writing', description: 'Freelance writing community', popularity: 8, relatedKeywords: ['freelance writer', 'content writing', 'blogging'] },
      { name: 'copywriting', category: 'writing', description: 'Copywriting community', popularity: 8, relatedKeywords: ['copywriter', 'marketing copy', 'advertising'] },
      { name: 'content_marketing', category: 'writing', description: 'Content marketing strategies', popularity: 8, relatedKeywords: ['content writer', 'content marketing', 'blogging'] },
      { name: 'blogging', category: 'writing', description: 'Blogging community', popularity: 7, relatedKeywords: ['blog writer', 'blogging', 'content creation'] },
      { name: 'technicalwriting', category: 'writing', description: 'Technical writing', popularity: 7, relatedKeywords: ['technical writer', 'documentation', 'technical content'] },
      { name: 'Screenwriting', category: 'writing', description: 'Screenplay writing', popularity: 6, relatedKeywords: ['script writer', 'screenplay', 'film writing'] },
      { name: 'writing', category: 'writing', description: 'General writing community', popularity: 7, relatedKeywords: ['writer', 'writing', 'content creation'] },
    ],
  },
  {
    id: 'marketing',
    name: 'Marketing',
    icon: '📈',
    subreddits: [
      { name: 'marketing', category: 'marketing', description: 'Marketing community', popularity: 9, relatedKeywords: ['marketer', 'digital marketing', 'marketing strategy'] },
      { name: 'digital_marketing', category: 'marketing', description: 'Digital marketing strategies', popularity: 9, relatedKeywords: ['digital marketer', 'online marketing', 'internet marketing'] },
      { name: 'SEO', category: 'marketing', description: 'Search engine optimization', popularity: 9, relatedKeywords: ['seo specialist', 'seo', 'search optimization'] },
      { name: 'socialmedia', category: 'marketing', description: 'Social media marketing', popularity: 9, relatedKeywords: ['social media manager', 'social media', 'smm'] },
      { name: 'PPC', category: 'marketing', description: 'Pay-per-click advertising', popularity: 7, relatedKeywords: ['ppc specialist', 'google ads', 'paid advertising'] },
      { name: 'emailmarketing', category: 'marketing', description: 'Email marketing strategies', popularity: 7, relatedKeywords: ['email marketer', 'email marketing', 'email campaigns'] },
      { name: 'growth', category: 'marketing', description: 'Growth hacking and marketing', popularity: 7, relatedKeywords: ['growth hacker', 'growth marketing', 'user acquisition'] },
      { name: 'influencermarketing', category: 'marketing', description: 'Influencer marketing', popularity: 6, relatedKeywords: ['influencer marketing', 'influencer', 'brand partnerships'] },
      { name: 'affiliatemarketing', category: 'marketing', description: 'Affiliate marketing', popularity: 6, relatedKeywords: ['affiliate marketer', 'affiliate marketing', 'commission'] },
      { name: 'analytics', category: 'marketing', description: 'Marketing analytics', popularity: 7, relatedKeywords: ['marketing analyst', 'analytics', 'data analysis'] },
    ],
  },
  {
    id: 'video',
    name: 'Video & Media',
    icon: '🎬',
    subreddits: [
      { name: 'videoediting', category: 'video', description: 'Video editing community', popularity: 8, relatedKeywords: ['video editor', 'video editing', 'post production'] },
      { name: 'editors', category: 'video', description: 'Video editors community', popularity: 7, relatedKeywords: ['video editor', 'editing', 'post production'] },
      { name: 'videography', category: 'video', description: 'Videography and filmmaking', popularity: 7, relatedKeywords: ['videographer', 'video production', 'filmmaking'] },
      { name: 'youtube', category: 'video', description: 'YouTube creators', popularity: 8, relatedKeywords: ['youtube editor', 'youtube', 'video content'] },
      { name: 'podcasting', category: 'video', description: 'Podcast creation', popularity: 7, relatedKeywords: ['podcast editor', 'podcast producer', 'audio editing'] },
      { name: 'audioengineering', category: 'video', description: 'Audio engineering', popularity: 6, relatedKeywords: ['audio editor', 'sound design', 'audio production'] },
      { name: 'colorists', category: 'video', description: 'Color grading and correction', popularity: 5, relatedKeywords: ['colorist', 'color grading', 'color correction'] },
      { name: 'vfx', category: 'video', description: 'Visual effects', popularity: 6, relatedKeywords: ['vfx artist', 'visual effects', 'compositing'] },
    ],
  },
  {
    id: 'business',
    name: 'Business & Admin',
    icon: '💼',
    subreddits: [
      { name: 'virtualassistant', category: 'business', description: 'Virtual assistant services', popularity: 8, relatedKeywords: ['virtual assistant', 'va', 'admin support'] },
      { name: 'accounting', category: 'business', description: 'Accounting and finance', popularity: 7, relatedKeywords: ['accountant', 'bookkeeper', 'financial'] },
      { name: 'bookkeeping', category: 'business', description: 'Bookkeeping services', popularity: 7, relatedKeywords: ['bookkeeper', 'bookkeeping', 'accounting'] },
      { name: 'excel', category: 'business', description: 'Excel and spreadsheet help', popularity: 7, relatedKeywords: ['excel specialist', 'excel', 'spreadsheets'] },
      { name: 'datascience', category: 'business', description: 'Data science and analysis', popularity: 8, relatedKeywords: ['data analyst', 'data science', 'analytics'] },
      { name: 'consulting', category: 'business', description: 'Business consulting', popularity: 7, relatedKeywords: ['business consultant', 'consulting', 'strategy'] },
      { name: 'projectmanagement', category: 'business', description: 'Project management', popularity: 7, relatedKeywords: ['project manager', 'pm', 'project coordination'] },
      { name: 'operations', category: 'business', description: 'Business operations', popularity: 6, relatedKeywords: ['operations manager', 'operations', 'business ops'] },
      { name: 'customerservice', category: 'business', description: 'Customer support', popularity: 7, relatedKeywords: ['customer support', 'customer service', 'support agent'] },
    ],
  },
  {
    id: 'other',
    name: 'Other Services',
    icon: '🔧',
    subreddits: [
      { name: 'translator', category: 'other', description: 'Translation services', popularity: 7, relatedKeywords: ['translator', 'translation', 'language'] },
      { name: 'languagelearning', category: 'other', description: 'Language learning', popularity: 6, relatedKeywords: ['translator', 'language', 'translation'] },
      { name: 'academic', category: 'other', description: 'Academic research and writing', popularity: 6, relatedKeywords: ['researcher', 'academic writing', 'research'] },
      { name: 'research', category: 'other', description: 'Research services', popularity: 6, relatedKeywords: ['researcher', 'research', 'data research'] },
      { name: 'transcription', category: 'other', description: 'Transcription services', popularity: 7, relatedKeywords: ['transcriber', 'transcription', 'audio transcription'] },
      { name: 'voiceover', category: 'other', description: 'Voice over services', popularity: 6, relatedKeywords: ['voice over artist', 'voiceover', 'narration'] },
      { name: 'recordthis', category: 'other', description: 'Voice recording services', popularity: 5, relatedKeywords: ['voice over', 'narration', 'audio recording'] },
    ],
  },
];

/**
 * Get all subreddits as a flat array
 */
export function getAllSubreddits(): SubredditSuggestion[] {
  return SUBREDDIT_CATEGORIES.flatMap(category => category.subreddits);
}

/**
 * Get subreddits by category
 */
export function getSubredditsByCategory(categoryId: string): SubredditSuggestion[] {
  const category = SUBREDDIT_CATEGORIES.find(cat => cat.id === categoryId);
  return category?.subreddits || [];
}

/**
 * Search subreddits by query
 */
export function searchSubreddits(query: string, limit: number = 20): SubredditSuggestion[] {
  const lowerQuery = query.toLowerCase();
  const allSubreddits = getAllSubreddits();
  
  return allSubreddits
    .filter(subreddit => 
      subreddit.name.toLowerCase().includes(lowerQuery) ||
      subreddit.description?.toLowerCase().includes(lowerQuery) ||
      subreddit.category.toLowerCase().includes(lowerQuery)
    )
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
    .slice(0, limit);
}

/**
 * Get popular subreddits (top N by popularity)
 */
export function getPopularSubreddits(limit: number = 20): SubredditSuggestion[] {
  return getAllSubreddits()
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
    .slice(0, limit);
}

/**
 * Get subreddits related to a keyword
 */
export function getSubredditsForKeyword(keyword: string): SubredditSuggestion[] {
  const lowerKeyword = keyword.toLowerCase();
  const allSubreddits = getAllSubreddits();
  
  return allSubreddits
    .filter(subreddit => 
      subreddit.relatedKeywords?.some(k => 
        k.toLowerCase().includes(lowerKeyword) || 
        lowerKeyword.includes(k.toLowerCase())
      )
    )
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
}


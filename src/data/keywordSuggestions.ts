/**
 * Keyword Suggestions Data
 * 
 * Static keyword suggestions organized by category.
 * These are the most commonly searched keywords for freelance opportunities.
 * 
 * Later: This data will be aggregated from database analytics.
 */

export interface KeywordSuggestion {
  keyword: string;
  category: string;
  icon?: string;
  relatedSubreddits?: string[];
  popularity?: number; // 1-10 scale, higher = more popular
}

export interface KeywordCategory {
  id: string;
  name: string;
  icon: string;
  keywords: KeywordSuggestion[];
}

/**
 * Subreddit suggestions organized by category
 */
export const SUBREDDIT_SUGGESTIONS: Record<string, string[]> = {
  // Development
  'forhire': ['forhire', 'jobs4bitcoins', 'slavelabour'],
  'webdev': ['webdev', 'web_design', 'webhosting'],
  'programming': ['programming', 'learnprogramming', 'compsci'],
  'react': ['reactjs', 'nextjs', 'gatsbyjs'],
  'python': ['Python', 'learnpython', 'django'],
  'javascript': ['javascript', 'node', 'typescript'],
  'mobile': ['iOSProgramming', 'androiddev', 'reactnative'],
  'devops': ['devops', 'aws', 'docker'],
  
  // Design
  'design': ['forhire', 'DesignJobs', 'graphic_design'],
  'uiux': ['userexperience', 'UI_Design', 'web_design'],
  'graphic': ['graphic_design', 'Design', 'logos'],
  'logo': ['logos', 'graphic_design', 'Design'],
  'branding': ['graphic_design', 'Design', 'branding'],
  
  // Writing & Content
  'writing': ['forhire', 'HireAWriter', 'freelanceWriters'],
  'copywriting': ['copywriting', 'marketing', 'content_marketing'],
  'content': ['content_marketing', 'marketing', 'blogging'],
  'blogging': ['blogging', 'content_marketing', 'SEO'],
  'technical': ['technicalwriting', 'forhire', 'freelanceWriters'],
  
  // Marketing
  'marketing': ['marketing', 'digital_marketing', 'socialmedia'],
  'seo': ['SEO', 'digital_marketing', 'marketing'],
  'social': ['socialmedia', 'marketing', 'digital_marketing'],
  'ppc': ['PPC', 'marketing', 'digital_marketing'],
  'email': ['emailmarketing', 'marketing', 'digital_marketing'],
  
  // Business & Admin
  'va': ['forhire', 'virtualassistant', 'remotework'],
  'admin': ['forhire', 'virtualassistant', 'remotework'],
  'data': ['forhire', 'datascience', 'excel'],
  'excel': ['excel', 'forhire', 'datascience'],
  'bookkeeping': ['forhire', 'accounting', 'bookkeeping'],
  
  // Video & Media
  'video': ['videoediting', 'editors', 'videography'],
  'editing': ['videoediting', 'editors', 'videography'],
  'animation': ['animation', 'AfterEffects', 'motiongraphics'],
  'motion': ['motiongraphics', 'AfterEffects', 'animation'],
  
  // Other
  'translation': ['forhire', 'translator', 'languagelearning'],
  'research': ['forhire', 'academic', 'research'],
  'consulting': ['forhire', 'consulting', 'entrepreneur'],
};

/**
 * Keyword suggestions organized by category
 */
export const KEYWORD_CATEGORIES: KeywordCategory[] = [
  {
    id: 'development',
    name: 'Development',
    icon: '💻',
    keywords: [
      { keyword: 'React Developer', category: 'development', relatedSubreddits: ['reactjs', 'forhire', 'webdev'], popularity: 10 },
      { keyword: 'Python Developer', category: 'development', relatedSubreddits: ['Python', 'forhire', 'programming'], popularity: 10 },
      { keyword: 'JavaScript Developer', category: 'development', relatedSubreddits: ['javascript', 'forhire', 'webdev'], popularity: 10 },
      { keyword: 'Node.js Developer', category: 'development', relatedSubreddits: ['node', 'forhire', 'javascript'], popularity: 9 },
      { keyword: 'Full Stack Developer', category: 'development', relatedSubreddits: ['webdev', 'forhire', 'programming'], popularity: 10 },
      { keyword: 'Frontend Developer', category: 'development', relatedSubreddits: ['webdev', 'forhire', 'reactjs'], popularity: 9 },
      { keyword: 'Backend Developer', category: 'development', relatedSubreddits: ['programming', 'forhire', 'webdev'], popularity: 9 },
      { keyword: 'Next.js Developer', category: 'development', relatedSubreddits: ['nextjs', 'forhire', 'reactjs'], popularity: 8 },
      { keyword: 'TypeScript Developer', category: 'development', relatedSubreddits: ['typescript', 'forhire', 'javascript'], popularity: 8 },
      { keyword: 'Vue.js Developer', category: 'development', relatedSubreddits: ['vuejs', 'forhire', 'webdev'], popularity: 7 },
      { keyword: 'Angular Developer', category: 'development', relatedSubreddits: ['angular', 'forhire', 'webdev'], popularity: 7 },
      { keyword: 'Django Developer', category: 'development', relatedSubreddits: ['django', 'forhire', 'Python'], popularity: 8 },
      { keyword: 'Flask Developer', category: 'development', relatedSubreddits: ['flask', 'forhire', 'Python'], popularity: 7 },
      { keyword: 'Laravel Developer', category: 'development', relatedSubreddits: ['laravel', 'forhire', 'PHP'], popularity: 7 },
      { keyword: 'PHP Developer', category: 'development', relatedSubreddits: ['PHP', 'forhire', 'webdev'], popularity: 7 },
      { keyword: 'Ruby on Rails Developer', category: 'development', relatedSubreddits: ['rails', 'forhire', 'ruby'], popularity: 6 },
      { keyword: 'Go Developer', category: 'development', relatedSubreddits: ['golang', 'forhire', 'programming'], popularity: 7 },
      { keyword: 'Rust Developer', category: 'development', relatedSubreddits: ['rust', 'forhire', 'programming'], popularity: 6 },
      { keyword: 'Java Developer', category: 'development', relatedSubreddits: ['java', 'forhire', 'programming'], popularity: 8 },
      { keyword: 'C# Developer', category: 'development', relatedSubreddits: ['csharp', 'forhire', 'programming'], popularity: 7 },
      { keyword: 'Swift Developer', category: 'development', relatedSubreddits: ['iOSProgramming', 'forhire', 'swift'], popularity: 7 },
      { keyword: 'Kotlin Developer', category: 'development', relatedSubreddits: ['androiddev', 'forhire', 'kotlin'], popularity: 7 },
      { keyword: 'React Native Developer', category: 'development', relatedSubreddits: ['reactnative', 'forhire', 'reactjs'], popularity: 8 },
      { keyword: 'Flutter Developer', category: 'development', relatedSubreddits: ['FlutterDev', 'forhire', 'androiddev'], popularity: 7 },
      { keyword: 'iOS Developer', category: 'development', relatedSubreddits: ['iOSProgramming', 'forhire', 'swift'], popularity: 8 },
      { keyword: 'Android Developer', category: 'development', relatedSubreddits: ['androiddev', 'forhire', 'kotlin'], popularity: 8 },
      { keyword: 'WordPress Developer', category: 'development', relatedSubreddits: ['Wordpress', 'forhire', 'webdev'], popularity: 8 },
      { keyword: 'Shopify Developer', category: 'development', relatedSubreddits: ['shopify', 'forhire', 'ecommerce'], popularity: 7 },
      { keyword: 'Web3 Developer', category: 'development', relatedSubreddits: ['ethereum', 'forhire', 'web3'], popularity: 7 },
      { keyword: 'Blockchain Developer', category: 'development', relatedSubreddits: ['ethereum', 'forhire', 'blockchain'], popularity: 7 },
      { keyword: 'DevOps Engineer', category: 'development', relatedSubreddits: ['devops', 'forhire', 'aws'], popularity: 8 },
      { keyword: 'AWS Developer', category: 'development', relatedSubreddits: ['aws', 'forhire', 'devops'], popularity: 8 },
      { keyword: 'Docker Developer', category: 'development', relatedSubreddits: ['docker', 'forhire', 'devops'], popularity: 7 },
      { keyword: 'Kubernetes Developer', category: 'development', relatedSubreddits: ['kubernetes', 'forhire', 'devops'], popularity: 7 },
    ],
  },
  {
    id: 'design',
    name: 'Design',
    icon: '🎨',
    keywords: [
      { keyword: 'UI/UX Designer', category: 'design', relatedSubreddits: ['userexperience', 'UI_Design', 'forhire'], popularity: 10 },
      { keyword: 'Graphic Designer', category: 'design', relatedSubreddits: ['graphic_design', 'Design', 'forhire'], popularity: 10 },
      { keyword: 'Web Designer', category: 'design', relatedSubreddits: ['web_design', 'forhire', 'graphic_design'], popularity: 9 },
      { keyword: 'Logo Designer', category: 'design', relatedSubreddits: ['logos', 'graphic_design', 'forhire'], popularity: 9 },
      { keyword: 'Brand Designer', category: 'design', relatedSubreddits: ['graphic_design', 'Design', 'forhire'], popularity: 8 },
      { keyword: 'Illustrator', category: 'design', relatedSubreddits: ['Illustration', 'graphic_design', 'forhire'], popularity: 8 },
      { keyword: 'Product Designer', category: 'design', relatedSubreddits: ['userexperience', 'UI_Design', 'forhire'], popularity: 8 },
      { keyword: 'Figma Designer', category: 'design', relatedSubreddits: ['FigmaDesign', 'userexperience', 'forhire'], popularity: 8 },
      { keyword: 'Adobe XD Designer', category: 'design', relatedSubreddits: ['Adobe_XD', 'userexperience', 'forhire'], popularity: 7 },
      { keyword: 'Sketch Designer', category: 'design', relatedSubreddits: ['sketchapp', 'userexperience', 'forhire'], popularity: 6 },
      { keyword: 'Photoshop Designer', category: 'design', relatedSubreddits: ['photoshop', 'graphic_design', 'forhire'], popularity: 8 },
      { keyword: 'Illustrator Designer', category: 'design', relatedSubreddits: ['AdobeIllustrator', 'graphic_design', 'forhire'], popularity: 8 },
      { keyword: 'InDesign Designer', category: 'design', relatedSubreddits: ['indesign', 'graphic_design', 'forhire'], popularity: 7 },
      { keyword: 'Motion Graphics Designer', category: 'design', relatedSubreddits: ['motiongraphics', 'AfterEffects', 'forhire'], popularity: 7 },
      { keyword: '3D Designer', category: 'design', relatedSubreddits: ['3Dmodeling', 'blender', 'forhire'], popularity: 7 },
      { keyword: 'Packaging Designer', category: 'design', relatedSubreddits: ['graphic_design', 'Design', 'forhire'], popularity: 6 },
      { keyword: 'Print Designer', category: 'design', relatedSubreddits: ['graphic_design', 'Design', 'forhire'], popularity: 6 },
    ],
  },
  {
    id: 'writing',
    name: 'Writing & Content',
    icon: '✍️',
    keywords: [
      { keyword: 'Content Writer', category: 'writing', relatedSubreddits: ['HireAWriter', 'forhire', 'content_marketing'], popularity: 10 },
      { keyword: 'Copywriter', category: 'writing', relatedSubreddits: ['copywriting', 'forhire', 'marketing'], popularity: 10 },
      { keyword: 'Blog Writer', category: 'writing', relatedSubreddits: ['blogging', 'HireAWriter', 'forhire'], popularity: 9 },
      { keyword: 'SEO Writer', category: 'writing', relatedSubreddits: ['SEO', 'HireAWriter', 'forhire'], popularity: 9 },
      { keyword: 'Technical Writer', category: 'writing', relatedSubreddits: ['technicalwriting', 'forhire', 'HireAWriter'], popularity: 8 },
      { keyword: 'Ghostwriter', category: 'writing', relatedSubreddits: ['HireAWriter', 'forhire', 'writing'], popularity: 7 },
      { keyword: 'Script Writer', category: 'writing', relatedSubreddits: ['Screenwriting', 'forhire', 'HireAWriter'], popularity: 7 },
      { keyword: 'Grant Writer', category: 'writing', relatedSubreddits: ['forhire', 'nonprofit', 'HireAWriter'], popularity: 6 },
      { keyword: 'Resume Writer', category: 'writing', relatedSubreddits: ['resumes', 'forhire', 'HireAWriter'], popularity: 7 },
      { keyword: 'Email Copywriter', category: 'writing', relatedSubreddits: ['emailmarketing', 'copywriting', 'forhire'], popularity: 8 },
      { keyword: 'Social Media Writer', category: 'writing', relatedSubreddits: ['socialmedia', 'HireAWriter', 'forhire'], popularity: 8 },
      { keyword: 'Product Description Writer', category: 'writing', relatedSubreddits: ['ecommerce', 'HireAWriter', 'forhire'], popularity: 7 },
      { keyword: 'White Paper Writer', category: 'writing', relatedSubreddits: ['forhire', 'HireAWriter', 'marketing'], popularity: 6 },
      { keyword: 'Case Study Writer', category: 'writing', relatedSubreddits: ['marketing', 'HireAWriter', 'forhire'], popularity: 7 },
    ],
  },
  {
    id: 'marketing',
    name: 'Marketing',
    icon: '📈',
    keywords: [
      { keyword: 'Digital Marketer', category: 'marketing', relatedSubreddits: ['digital_marketing', 'marketing', 'forhire'], popularity: 10 },
      { keyword: 'SEO Specialist', category: 'marketing', relatedSubreddits: ['SEO', 'digital_marketing', 'forhire'], popularity: 10 },
      { keyword: 'Social Media Manager', category: 'marketing', relatedSubreddits: ['socialmedia', 'marketing', 'forhire'], popularity: 10 },
      { keyword: 'PPC Specialist', category: 'marketing', relatedSubreddits: ['PPC', 'marketing', 'forhire'], popularity: 8 },
      { keyword: 'Email Marketer', category: 'marketing', relatedSubreddits: ['emailmarketing', 'marketing', 'forhire'], popularity: 8 },
      { keyword: 'Content Marketer', category: 'marketing', relatedSubreddits: ['content_marketing', 'marketing', 'forhire'], popularity: 9 },
      { keyword: 'Marketing Strategist', category: 'marketing', relatedSubreddits: ['marketing', 'digital_marketing', 'forhire'], popularity: 8 },
      { keyword: 'Growth Hacker', category: 'marketing', relatedSubreddits: ['growth', 'marketing', 'forhire'], popularity: 7 },
      { keyword: 'Influencer Marketer', category: 'marketing', relatedSubreddits: ['influencermarketing', 'marketing', 'forhire'], popularity: 7 },
      { keyword: 'Affiliate Marketer', category: 'marketing', relatedSubreddits: ['affiliatemarketing', 'marketing', 'forhire'], popularity: 6 },
      { keyword: 'Marketing Analyst', category: 'marketing', relatedSubreddits: ['marketing', 'analytics', 'forhire'], popularity: 7 },
    ],
  },
  {
    id: 'video',
    name: 'Video & Media',
    icon: '🎬',
    keywords: [
      { keyword: 'Video Editor', category: 'video', relatedSubreddits: ['videoediting', 'editors', 'forhire'], popularity: 9 },
      { keyword: 'Video Producer', category: 'video', relatedSubreddits: ['videography', 'videoediting', 'forhire'], popularity: 8 },
      { keyword: 'Motion Graphics Designer', category: 'video', relatedSubreddits: ['motiongraphics', 'AfterEffects', 'forhire'], popularity: 8 },
      { keyword: 'Animator', category: 'video', relatedSubreddits: ['animation', 'AfterEffects', 'forhire'], popularity: 7 },
      { keyword: 'YouTube Editor', category: 'video', relatedSubreddits: ['videoediting', 'youtube', 'forhire'], popularity: 8 },
      { keyword: 'Podcast Editor', category: 'video', relatedSubreddits: ['podcasting', 'audioengineering', 'forhire'], popularity: 7 },
      { keyword: 'Colorist', category: 'video', relatedSubreddits: ['colorists', 'videoediting', 'forhire'], popularity: 6 },
      { keyword: 'VFX Artist', category: 'video', relatedSubreddits: ['vfx', 'AfterEffects', 'forhire'], popularity: 7 },
    ],
  },
  {
    id: 'business',
    name: 'Business & Admin',
    icon: '💼',
    keywords: [
      { keyword: 'Virtual Assistant', category: 'business', relatedSubreddits: ['virtualassistant', 'forhire', 'remotework'], popularity: 10 },
      { keyword: 'Data Entry Specialist', category: 'business', relatedSubreddits: ['forhire', 'remotework', 'virtualassistant'], popularity: 8 },
      { keyword: 'Bookkeeper', category: 'business', relatedSubreddits: ['bookkeeping', 'accounting', 'forhire'], popularity: 8 },
      { keyword: 'Accountant', category: 'business', relatedSubreddits: ['accounting', 'forhire', 'bookkeeping'], popularity: 7 },
      { keyword: 'Excel Specialist', category: 'business', relatedSubreddits: ['excel', 'forhire', 'datascience'], popularity: 8 },
      { keyword: 'Data Analyst', category: 'business', relatedSubreddits: ['datascience', 'analytics', 'forhire'], popularity: 8 },
      { keyword: 'Business Consultant', category: 'business', relatedSubreddits: ['consulting', 'forhire', 'entrepreneur'], popularity: 7 },
      { keyword: 'Project Manager', category: 'business', relatedSubreddits: ['projectmanagement', 'forhire', 'remotework'], popularity: 8 },
      { keyword: 'Operations Manager', category: 'business', relatedSubreddits: ['operations', 'forhire', 'remotework'], popularity: 6 },
      { keyword: 'Customer Support', category: 'business', relatedSubreddits: ['customerservice', 'forhire', 'remotework'], popularity: 7 },
    ],
  },
  {
    id: 'other',
    name: 'Other Services',
    icon: '🔧',
    keywords: [
      { keyword: 'Translator', category: 'other', relatedSubreddits: ['translator', 'forhire', 'languagelearning'], popularity: 8 },
      { keyword: 'Researcher', category: 'other', relatedSubreddits: ['forhire', 'academic', 'research'], popularity: 7 },
      { keyword: 'Transcriber', category: 'other', relatedSubreddits: ['transcription', 'forhire', 'remotework'], popularity: 7 },
      { keyword: 'Proofreader', category: 'other', relatedSubreddits: ['HireAWriter', 'forhire', 'writing'], popularity: 7 },
      { keyword: 'Editor', category: 'other', relatedSubreddits: ['HireAWriter', 'forhire', 'writing'], popularity: 8 },
      { keyword: 'Voice Over Artist', category: 'other', relatedSubreddits: ['voiceover', 'forhire', 'recordthis'], popularity: 6 },
      { keyword: 'Podcast Producer', category: 'other', relatedSubreddits: ['podcasting', 'forhire', 'audioengineering'], popularity: 6 },
    ],
  },
];

/**
 * Get all keywords as a flat array
 */
export function getAllKeywords(): KeywordSuggestion[] {
  return KEYWORD_CATEGORIES.flatMap(category => category.keywords);
}

/**
 * Get keywords by category
 */
export function getKeywordsByCategory(categoryId: string): KeywordSuggestion[] {
  const category = KEYWORD_CATEGORIES.find(cat => cat.id === categoryId);
  return category?.keywords || [];
}

/**
 * Search keywords by query
 */
export function searchKeywords(query: string, limit: number = 20): KeywordSuggestion[] {
  const lowerQuery = query.toLowerCase();
  const allKeywords = getAllKeywords();
  
  return allKeywords
    .filter(keyword => 
      keyword.keyword.toLowerCase().includes(lowerQuery) ||
      keyword.category.toLowerCase().includes(lowerQuery)
    )
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
    .slice(0, limit);
}

/**
 * Get related subreddits for a keyword
 */
export function getRelatedSubreddits(keyword: string): string[] {
  const allKeywords = getAllKeywords();
  const found = allKeywords.find(k => 
    k.keyword.toLowerCase() === keyword.toLowerCase()
  );
  
  return found?.relatedSubreddits || [];
}

/**
 * Get popular keywords (top N by popularity)
 */
export function getPopularKeywords(limit: number = 20): KeywordSuggestion[] {
  return getAllKeywords()
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
    .slice(0, limit);
}


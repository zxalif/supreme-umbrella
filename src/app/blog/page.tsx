import type { Metadata } from 'next';
import { BlogPageClient } from './BlogPageClient';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'ClientHunt Blog - Tips, guides, and insights for freelancers finding opportunities on Reddit.',
};

export default function BlogPage() {
  return <BlogPageClient />;
}

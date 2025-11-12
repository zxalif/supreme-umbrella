'use client';

import { useState, useEffect } from 'react';
import { Share2, Twitter, Linkedin, Copy, Check } from 'lucide-react';

type ShareButtonsProps = {
  title: string;
  slug: string;
};

export function ShareButtons({ title, slug }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [hasNativeShare, setHasNativeShare] = useState(false);
  const url = typeof window !== 'undefined' 
    ? `${window.location.origin}/blog/${slug}`
    : `https://clienthunt.app/blog/${slug}`;

  useEffect(() => {
    setHasNativeShare(typeof navigator !== 'undefined' && 'share' in navigator);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: `Check out this article: ${title}`,
          url,
        });
      } catch (err) {
        // User cancelled or error occurred
        console.log('Share cancelled or failed:', err);
      }
    } else {
      // Fallback to copy
      handleCopy();
    }
  };

  const shareOnTwitter = () => {
    const text = encodeURIComponent(`Check out: ${title}`);
    const twitterUrl = `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank', 'width=550,height=420');
  };

  const shareOnLinkedIn = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(linkedInUrl, '_blank', 'width=550,height=420');
  };

  return (
    <div>
      <p className="text-sm font-medium text-gray-900 mb-2">Share this article</p>
      <div className="flex space-x-2">
        {/* Native Share (mobile) or Copy (desktop) */}
        {hasNativeShare ? (
          <button
            onClick={handleShare}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Share"
            aria-label="Share article"
          >
            <Share2 className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={handleCopy}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors relative"
            title="Copy link"
            aria-label="Copy article link"
          >
            {copied ? (
              <Check className="w-5 h-5 text-green-600" />
            ) : (
              <Copy className="w-5 h-5" />
            )}
          </button>
        )}
        
        {/* Twitter */}
        <button
          onClick={shareOnTwitter}
          className="p-2 text-gray-600 hover:text-blue-400 hover:bg-blue-50 rounded-lg transition-colors"
          title="Share on Twitter"
          aria-label="Share on Twitter"
        >
          <Twitter className="w-5 h-5" />
        </button>

        {/* LinkedIn */}
        <button
          onClick={shareOnLinkedIn}
          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          title="Share on LinkedIn"
          aria-label="Share on LinkedIn"
        >
          <Linkedin className="w-5 h-5" />
        </button>
      </div>
      {copied && (
        <p className="text-xs text-green-600 mt-1">Link copied!</p>
      )}
    </div>
  );
}


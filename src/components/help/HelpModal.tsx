'use client';

import { X, BookOpen, MessageCircle, ExternalLink } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Portal } from '@/components/ui/Portal';
import { useEffect } from 'react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * HelpModal Component
 * 
 * Contextual help modal that shows help based on current page
 */
export function HelpModal({ isOpen, onClose }: HelpModalProps) {
  const pathname = usePathname();

  // Lock body scroll when modal is open
  useEffect(() => {
    if (!isOpen) return;
    
    // Save current scroll position
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;
    
    console.log('[HelpModal] Opening modal - saving scroll position:', { scrollX, scrollY });
    console.log('[HelpModal] Body styles before lock:', {
      overflow: document.body.style.overflow,
      position: document.body.style.position,
      top: document.body.style.top,
      left: document.body.style.left,
      width: document.body.style.width
    });
    
    // Lock body scroll
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = `-${scrollX}px`;
    document.body.style.width = '100%';
    
    console.log('[HelpModal] Body styles after lock:', {
      overflow: document.body.style.overflow,
      position: document.body.style.position,
      top: document.body.style.top,
      left: document.body.style.left,
      width: document.body.style.width
    });
    
    return () => {
      console.log('[HelpModal] Cleanup running - restoring scroll position:', { scrollX, scrollY });
      console.log('[HelpModal] Body styles before cleanup:', {
        overflow: document.body.style.overflow,
        position: document.body.style.position,
        top: document.body.style.top,
        left: document.body.style.left,
        width: document.body.style.width
      });
      
      // Force remove all inline styles we added
      document.body.style.removeProperty('overflow');
      document.body.style.removeProperty('position');
      document.body.style.removeProperty('top');
      document.body.style.removeProperty('left');
      document.body.style.removeProperty('width');
      
      console.log('[HelpModal] Body styles after removeProperty:', {
        overflow: document.body.style.overflow,
        position: document.body.style.position,
        top: document.body.style.top,
        left: document.body.style.left,
        width: document.body.style.width
      });
      
      // Restore scroll position - use requestAnimationFrame for better timing
      requestAnimationFrame(() => {
        console.log('[HelpModal] Restoring scroll to:', { scrollX, scrollY });
        
        // Check computed styles to see if anything is still blocking
        const computedStyle = window.getComputedStyle(document.body);
        console.log('[HelpModal] Computed body styles before scroll restore:', {
          overflow: computedStyle.overflow,
          position: computedStyle.position,
          top: computedStyle.top,
          left: computedStyle.left,
          width: computedStyle.width
        });
        
        window.scrollTo({
          left: scrollX,
          top: scrollY,
          behavior: 'auto'
        });
        
        console.log('[HelpModal] Scroll restored. Current scroll:', {
          scrollX: window.scrollX,
          scrollY: window.scrollY
        });
        
        // Check computed styles after scroll restore
        const computedStyleAfter = window.getComputedStyle(document.body);
        console.log('[HelpModal] Computed body styles after scroll restore:', {
          overflow: computedStyleAfter.overflow,
          position: computedStyleAfter.position,
          top: computedStyleAfter.top,
          left: computedStyleAfter.left,
          width: computedStyleAfter.width
        });
        
        console.log('[HelpModal] Final inline body styles:', {
          overflow: document.body.style.overflow,
          position: document.body.style.position,
          top: document.body.style.top,
          left: document.body.style.left,
          width: document.body.style.width
        });
        
        // Check if body has any classes that might interfere
        console.log('[HelpModal] Body classes:', document.body.className);
        
        // Check if html element has any styles
        const htmlComputed = window.getComputedStyle(document.documentElement);
        console.log('[HelpModal] HTML computed styles:', {
          overflow: htmlComputed.overflow,
          position: htmlComputed.position
        });
        
        // Check if Portal container is still present
        const portalContainer = document.getElementById('modal-root');
        if (portalContainer) {
          console.log('[HelpModal] Portal container still exists:', {
            children: portalContainer.children.length,
            display: window.getComputedStyle(portalContainer).display,
            pointerEvents: window.getComputedStyle(portalContainer).pointerEvents,
            zIndex: window.getComputedStyle(portalContainer).zIndex
          });
        } else {
          console.log('[HelpModal] Portal container not found');
        }
        
        // Check for any fixed/absolute positioned overlays
        const allFixedElements = Array.from(document.querySelectorAll('*')).filter(el => {
          const style = window.getComputedStyle(el);
          return style.position === 'fixed' && style.zIndex && parseInt(style.zIndex) >= 9999;
        });
        console.log('[HelpModal] Fixed elements with high z-index:', allFixedElements.map(el => ({
          tag: el.tagName,
          id: el.id,
          className: el.className,
          zIndex: window.getComputedStyle(el).zIndex
        })));
      });
    };
  }, [isOpen]);

  // Handle ESC key to close modal
  useEffect(() => {
    if (!isOpen) return;
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Get contextual help based on current page
  const getContextualHelp = () => {
    if (pathname?.includes('/keyword-searches')) {
      return {
        title: 'Keyword Searches Help',
        sections: [
          {
            title: 'What are Keyword Searches?',
            content: 'Keyword searches help you find opportunities by monitoring Reddit for posts containing specific keywords related to your services.',
          },
          {
            title: 'How to Create a Search',
            content: '1. Click "Create Search"\n2. Enter a descriptive name\n3. Add keywords (e.g., "react developer", "python")\n4. Select subreddits to monitor\n5. Enable the search to start monitoring',
          },
          {
            title: 'Tips',
            content: '• Use specific keywords for better results\n• Monitor multiple subreddits for broader coverage\n• Enable/disable searches as needed\n• Edit searches to refine your keywords',
          },
        ],
      };
    }

    if (pathname?.includes('/opportunities')) {
      return {
        title: 'Opportunities Help',
        sections: [
          {
            title: 'What are Opportunities?',
            content: 'Opportunities are potential leads found on Reddit that match your keyword searches. They are automatically discovered and scored based on relevance.',
          },
          {
            title: 'How to Generate Opportunities',
            content: '1. Select a keyword search from the dropdown\n2. Click "Generate Opportunities"\n3. Wait for the system to scrape and analyze Reddit posts\n4. Review the opportunities found',
          },
          {
            title: 'Managing Opportunities',
            content: '• Update status to track your progress\n• Filter by status, source, or score\n• Export to CSV for external analysis\n• Click "View Details" to see full post information',
          },
        ],
      };
    }

    if (pathname?.includes('/dashboard')) {
      return {
        title: 'Dashboard Help',
        sections: [
          {
            title: 'Overview',
            content: 'The dashboard shows your key metrics, recent opportunities, and quick access to main features.',
          },
          {
            title: 'Getting Started',
            content: '1. Create a keyword search\n2. Generate opportunities\n3. Review and contact leads\n4. Track your progress',
          },
        ],
      };
    }

    // Default help
    return {
      title: 'Welcome to ClientHunt',
      sections: [
        {
          title: 'Getting Started',
          content: 'ClientHunt helps you find freelance opportunities on Reddit. Start by creating a keyword search to monitor relevant posts.',
        },
        {
          title: 'Main Features',
          content: '• Keyword Searches: Monitor Reddit for specific keywords\n• Opportunities: Discover and manage potential leads\n• Analytics: Track your performance and insights',
        },
      ],
    };
  };

  const help = getContextualHelp();

  return (
    <Portal>
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
        onClick={(e) => {
          // Close modal when clicking backdrop
          if (e.target === e.currentTarget) {
            console.log('[HelpModal] Backdrop clicked - closing modal');
            onClose();
          }
        }}
      >
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={(e) => {
            console.log('[HelpModal] Backdrop div clicked - closing modal');
            e.stopPropagation();
            onClose();
          }}
        ></div>

        {/* Modal */}
        <div 
          className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden z-10"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center">
              <BookOpen className="w-6 h-6 text-blue-600 mr-3" />
              <h2 id="modal-title" className="text-xl font-semibold text-gray-900">
                {help.title}
              </h2>
            </div>
            <button
              onClick={() => {
                console.log('[HelpModal] Close button clicked');
                onClose();
              }}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
            {help.sections.map((section, index) => (
              <div key={index} className="mb-6 last:mb-0">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {section.title}
                </h3>
                <p className="text-sm text-gray-700 whitespace-pre-line">
                  {section.content}
                </p>
              </div>
            ))}

            {/* Additional Resources */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Additional Resources
              </h3>
              <div className="space-y-3">
                <a
                  href="https://docs.clienthunt.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Documentation
                </a>
                <Link
                  href="/dashboard/support"
                  onClick={onClose}
                  className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contact Support
                </Link>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end p-6 border-t border-gray-200 bg-gray-50">
            <button
              onClick={() => {
                console.log('[HelpModal] Footer close button clicked');
                onClose();
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}


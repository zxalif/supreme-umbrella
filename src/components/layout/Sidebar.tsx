'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Search, 
  Briefcase, 
  BarChart3, 
  Settings,
  CreditCard,
  X,
  ArrowRight
} from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  currentPath: string;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

/**
 * Dashboard Sidebar Component
 * 
 * Navigation sidebar with:
 * - Main navigation links
 * - Active state highlighting
 * - Responsive mobile menu
 */

export function Sidebar({ currentPath, isMobileOpen: externalMobileOpen, onMobileClose }: SidebarProps) {
  const [internalMobileOpen, setInternalMobileOpen] = useState(false);
  
  // Use external state if provided, otherwise use internal state
  const isMobileOpen = externalMobileOpen !== undefined ? externalMobileOpen : internalMobileOpen;
  const setIsMobileOpen = onMobileClose || setInternalMobileOpen;

  const navItems = [
    {
      icon: LayoutDashboard,
      label: 'Dashboard',
      href: '/dashboard',
    },
    {
      icon: Search,
      label: 'Keyword Searches',
      href: '/dashboard/keyword-searches',
    },
    {
      icon: Briefcase,
      label: 'Opportunities',
      href: '/dashboard/opportunities',
    },
    {
      icon: BarChart3,
      label: 'Analytics',
      href: '/dashboard/analytics',
    },
    {
      icon: CreditCard,
      label: 'Subscription',
      href: '/dashboard/subscription',
    },
    {
      icon: Settings,
      label: 'Settings',
      href: '/dashboard/settings/profile',
    },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return currentPath === '/dashboard';
    }
    // Special handling for settings - match any settings subpage
    if (href.startsWith('/dashboard/settings')) {
      return currentPath.startsWith('/dashboard/settings');
    }
    return currentPath.startsWith(href);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-14 sm:top-16 left-0 h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 z-40 transform transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 shadow-lg lg:shadow-none`}
      >
        {/* Mobile Close Button */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200">
          <span className="font-semibold text-gray-900">Menu</span>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-100"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1" data-tour="navbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                  active
                    ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 font-medium border-l-4 border-blue-500'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-blue-600' : 'text-gray-500'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section - Support */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          {/* Support Section */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-900 mb-1">
              Need Help?
            </p>
            <p className="text-xs text-gray-600 mb-2">
              Check our documentation or contact support
            </p>
            <Link
              href="/dashboard/support"
              className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1"
            >
              <span>Get Support</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}


'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Bell, Search, Settings, LogOut, User, Menu, X } from 'lucide-react';
import type { User as UserType } from '@/types/user';
import { getUnreadNotificationCount } from '@/lib/api/support';

interface HeaderProps {
  user: UserType;
  onMobileMenuToggle?: () => void;
}

/**
 * Dashboard Header Component
 * 
 * Professional, mobile-responsive navigation bar with:
 * - Logo with responsive text
 * - Mobile menu toggle (connected to sidebar)
 * - Search bar (desktop + mobile expandable)
 * - Notifications with badge
 * - User menu dropdown (mobile-optimized)
 * - Smooth animations and transitions
 */
export function Header({ user, onMobileMenuToggle }: HeaderProps) {
  const router = useRouter();
  const { logout } = useAuthStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleLogout = () => {
    setShowUserMenu(false);
    logout();
    router.push('/login');
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showUserMenu]);

  // Focus search input when mobile search opens
  useEffect(() => {
    if (showMobileSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showMobileSearch]);

  // Load unread notification count
  useEffect(() => {
    const loadNotificationCount = async () => {
      try {
        const count = await getUnreadNotificationCount();
        setUnreadCount(count);
      } catch (error) {
        // Silently fail for MVP - notification endpoint might not exist yet
        console.debug('Notification count not available:', error);
        setUnreadCount(0);
      }
    };

    loadNotificationCount();
    // Refresh every 30 seconds
    const interval = setInterval(loadNotificationCount, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="px-2 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Left: Logo & Mobile Menu */}
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-shrink-0">
            <button
              onClick={onMobileMenuToggle}
              className="lg:hidden p-2 -ml-1 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors touch-manipulation"
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
            </button>
            <Link 
              href="/dashboard" 
              className="flex items-center space-x-2 min-w-0 group"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow flex-shrink-0">
                <span className="text-white font-bold text-sm sm:text-lg">C</span>
              </div>
              <span className="text-base sm:text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent truncate">
                <span className="hidden sm:inline">ClientHunt</span>
                <span className="sm:hidden">CH</span>
              </span>
            </Link>
          </div>

          {/* Center: Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-4 lg:mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search opportunities..."
                className="w-full pl-9 sm:pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Right: Actions & User Menu */}
          <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
            {/* Mobile Search Toggle */}
            <button
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors touch-manipulation"
              aria-label="Toggle search"
            >
              <Search className="w-5 h-5 text-gray-700" />
            </button>

            {/* Notifications - Only show if there are unread notifications (MVP) */}
            {unreadCount > 0 && (
              <button
                className="relative p-2 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors touch-manipulation"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5 text-gray-700" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                )}
              </button>
            )}

            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors touch-manipulation min-w-0"
                aria-label="User menu"
                aria-expanded={showUserMenu}
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-xs sm:text-sm flex-shrink-0 shadow-sm">
                  {user.full_name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:block text-sm font-medium text-gray-700 truncate max-w-[120px]">
                  {user.full_name}
                </span>
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <>
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 z-40 lg:hidden"
                    onClick={() => setShowUserMenu(false)}
                  ></div>
                  {/* Menu */}
                  <div className="absolute right-0 mt-2 w-56 sm:w-48 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* User Info (Mobile) */}
                    <div className="px-4 py-3 border-b border-gray-100 sm:hidden">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {user.full_name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {user.full_name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <Link
                      href="/dashboard/settings/profile"
                      className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <User className="w-4 h-4 mr-3 text-gray-400" />
                      Profile
                    </Link>
                    <Link
                      href="/dashboard/settings"
                      className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Settings className="w-4 h-4 mr-3 text-gray-400" />
                      Settings
                    </Link>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {showMobileSearch && (
          <div className="md:hidden pb-3 animate-in slide-in-from-top duration-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search opportunities..."
                className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={() => setShowMobileSearch(false)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-100"
                aria-label="Close search"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}


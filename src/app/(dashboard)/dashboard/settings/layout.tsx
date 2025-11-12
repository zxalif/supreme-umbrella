'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, Lock, CreditCard } from 'lucide-react';

interface SettingsLayoutProps {
  children: React.ReactNode;
}

/**
 * Settings Layout Component
 * 
 * Provides navigation tabs for settings pages
 */
export default function SettingsLayout({ children }: SettingsLayoutProps) {
  const pathname = usePathname();

  const tabs = [
    {
      icon: User,
      label: 'Profile',
      href: '/dashboard/settings/profile',
    },
    {
      icon: Lock,
      label: 'Password',
      href: '/dashboard/settings/password',
    },
    {
      icon: CreditCard,
      label: 'Billing',
      href: '/dashboard/settings/billing',
    },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8" aria-label="Settings tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = isActive(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`
                  flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
                  ${
                    active
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      <div>{children}</div>
    </div>
  );
}


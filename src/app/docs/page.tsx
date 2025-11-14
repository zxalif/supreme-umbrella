import Link from 'next/link';
import { Book, Zap, Search, Target, Bell, BarChart, HelpCircle, ArrowRight } from 'lucide-react';
import { DocsBreadcrumbs } from '@/components/navigation/DocsBreadcrumbs';

export default function DocsOverviewPage() {
  const sections = [
    {
      href: '/docs/getting-started',
      title: 'Getting Started',
      description: 'Learn how to set up your account and create your first keyword search.',
      icon: Zap,
      color: 'blue',
    },
    {
      href: '/docs/keyword-searches',
      title: 'Keyword Searches',
      description: 'Create and manage keyword searches to find opportunities matching your skills.',
      icon: Search,
      color: 'purple',
    },
    {
      href: '/docs/opportunities',
      title: 'Opportunities',
      description: 'Manage and track opportunities found on Reddit. Update statuses and export data.',
      icon: Target,
      color: 'green',
    },
    // Notifications section commented out - feature not yet implemented
    // {
    //   href: '/docs/notifications',
    //   title: 'Notifications',
    //   description: 'Configure email and in-app notifications for new opportunities.',
    //   icon: Bell,
    //   color: 'orange',
    // },
    {
      href: '/docs/analytics',
      title: 'Analytics',
      description: 'Track your lead generation performance with detailed analytics and insights.',
      icon: BarChart,
      color: 'indigo',
    },
    {
      href: '/docs/faq',
      title: 'FAQ',
      description: 'Find answers to frequently asked questions about ClientHunt.',
      icon: HelpCircle,
      color: 'gray',
    },
  ];

  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-600',
    purple: 'bg-purple-50 border-purple-200 text-purple-600',
    green: 'bg-green-50 border-green-200 text-green-600',
    orange: 'bg-orange-50 border-orange-200 text-orange-600',
    indigo: 'bg-indigo-50 border-indigo-200 text-indigo-600',
    gray: 'bg-gray-50 border-gray-200 text-gray-600',
  };

  return (
    <div>
      {/* Breadcrumbs */}
      <DocsBreadcrumbs />
      
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Book className="w-10 h-10 text-blue-600 mr-3" />
          <h1 className="text-4xl font-bold text-gray-900">ClientHunt Documentation</h1>
        </div>
        <p className="text-xl text-gray-600">
          Everything you need to know about using ClientHunt to find freelance opportunities on Reddit.
        </p>
      </div>

      {/* Quick Links Grid */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Link
              key={section.href}
              href={section.href}
              className="group block p-6 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
            >
              <div className="flex items-start">
                <div className={`flex-shrink-0 w-12 h-12 rounded-lg border-2 flex items-center justify-center mr-4 ${colorClasses[section.color as keyof typeof colorClasses]}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {section.title}
                  </h3>
                  <p className="text-gray-600 mb-3">{section.description}</p>
                  <div className="flex items-center text-blue-600 font-medium text-sm">
                    <span>Learn more</span>
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Start */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
          <Zap className="w-6 h-6 text-blue-600 mr-2" />
          Quick Start
        </h2>
        <p className="text-gray-700 mb-4">
          New to ClientHunt? Follow these steps to get started:
        </p>
        <ol className="list-decimal list-inside space-y-2 text-gray-700 mb-4">
          <li>Create your account and verify your email</li>
          <li>Create your first keyword search with skills you offer</li>
          <li>Select subreddits to monitor for opportunities</li>
          <li>Generate opportunities and start receiving notifications</li>
        </ol>
        <Link
          href="/docs/getting-started"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Get Started Guide
          <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
      </div>

      {/* Support */}
      <div className="border-t border-gray-200 pt-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Need Help?</h2>
        <p className="text-gray-700 mb-4">
          Can't find what you're looking for? Our support team is here to help.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/contact"
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Contact Support
          </Link>
          <Link
            href="/dashboard/support"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            In-App Support
          </Link>
        </div>
      </div>
    </div>
  );
}

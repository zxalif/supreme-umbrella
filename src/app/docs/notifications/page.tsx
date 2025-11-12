import Link from 'next/link';
import { ArrowRight, Mail, Bell, Settings } from 'lucide-react';

export default function NotificationsPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Notifications</h1>
      <p className="text-xl text-gray-600 mb-8">
        Configure how and when you receive notifications about new opportunities.
      </p>

      {/* Overview */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Notification Types</h2>
        <p className="text-gray-700 mb-4">
          ClientHunt can notify you in multiple ways when new opportunities are found:
        </p>
        <div className="grid md:grid-cols-2 gap-6 mb-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
            <div className="flex items-center mb-3">
              <Mail className="w-6 h-6 text-blue-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Email Notifications</h3>
            </div>
            <p className="text-gray-700 text-sm mb-3">
              Receive email alerts when new opportunities matching your keywords are found. Perfect for staying updated without checking the dashboard.
            </p>
            <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
              <li>Instant notifications</li>
              <li>Digest summaries</li>
              <li>Customizable frequency</li>
            </ul>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-5">
            <div className="flex items-center mb-3">
              <Bell className="w-6 h-6 text-purple-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">In-App Notifications</h3>
            </div>
            <p className="text-gray-700 text-sm mb-3">
              See notifications directly in your dashboard. View notification history and mark items as read.
            </p>
            <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
              <li>Real-time updates</li>
              <li>Notification center</li>
              <li>Read/unread status</li>
            </ul>
          </div>
        </div>
        {/* Placeholder for screenshot */}
        <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4">
          <p className="text-gray-500 text-sm">
            📸 Screenshot: Notification settings page
          </p>
        </div>
      </section>

      {/* Configuring Notifications */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
          <Settings className="w-6 h-6 text-gray-600 mr-2" />
          Configuring Notifications
        </h2>
        <p className="text-gray-700 mb-4">
          Customize your notification preferences:
        </p>
        <ol className="list-decimal list-inside space-y-3 text-gray-700 mb-4">
          <li>Go to <strong>Settings</strong> from your profile menu</li>
          <li>Navigate to the <strong>Notifications</strong> section</li>
          <li>Toggle email notifications on/off</li>
          <li>Choose notification frequency (instant, daily digest, weekly digest)</li>
          <li>Select which keyword searches should trigger notifications</li>
          <li>Save your preferences</li>
        </ol>
        {/* Placeholder for screenshot */}
        <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4">
          <p className="text-gray-500 text-sm">
            📸 Screenshot: Notification settings form
          </p>
        </div>
      </section>

      {/* Notification Preferences */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Notification Preferences</h2>
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h3 className="font-semibold text-gray-900 mb-2">Instant Notifications</h3>
            <p className="text-gray-700 text-sm mb-2">
              Receive a notification immediately when a new opportunity is found. Best for active job seekers.
            </p>
            <p className="text-xs text-gray-500">
              ⚠️ May result in multiple emails per day if you have many active searches
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h3 className="font-semibold text-gray-900 mb-2">Daily Digest</h3>
            <p className="text-gray-700 text-sm mb-2">
              Receive one email per day with all opportunities found in the last 24 hours. Best for regular monitoring.
            </p>
            <p className="text-xs text-gray-500">
              📧 Sent at a time of your choice (default: 9 AM your timezone)
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h3 className="font-semibold text-gray-900 mb-2">Weekly Digest</h3>
            <p className="text-gray-700 text-sm mb-2">
              Receive one email per week summarizing all opportunities. Best for passive monitoring.
            </p>
            <p className="text-xs text-gray-500">
              📅 Sent every Monday morning
            </p>
          </div>
        </div>
      </section>

      {/* Managing Notifications */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Managing Notifications</h2>
        <p className="text-gray-700 mb-4">
          View and manage your notification history:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
          <li>Access notifications from the bell icon in the header</li>
          <li>Mark notifications as read/unread</li>
          <li>Click notifications to view the related opportunity</li>
          <li>Clear old notifications</li>
        </ul>
        {/* Placeholder for screenshot */}
        <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4">
          <p className="text-gray-500 text-sm">
            📸 Screenshot: Notification dropdown/center
          </p>
        </div>
      </section>

      {/* Best Practices */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Best Practices</h2>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              <span><strong>Start with instant notifications</strong> to see how many opportunities you're getting</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              <span><strong>Switch to daily digest</strong> if you're receiving too many emails</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              <span><strong>Enable notifications only for active searches</strong> to reduce noise</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              <span><strong>Check notification settings regularly</strong> as you add or remove keyword searches</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Troubleshooting */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Troubleshooting</h2>
        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-900 mb-2">Not Receiving Emails?</h3>
            <ul className="list-disc pl-5 text-sm text-yellow-800 space-y-1">
              <li>Check your spam/junk folder</li>
              <li>Verify your email address is correct in settings</li>
              <li>Ensure email notifications are enabled</li>
              <li>Check that you have active keyword searches</li>
            </ul>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Too Many Notifications?</h3>
            <ul className="list-disc pl-5 text-sm text-blue-800 space-y-1">
              <li>Switch to daily or weekly digest</li>
              <li>Disable notifications for less important searches</li>
              <li>Refine your keywords to get more relevant results</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Next Steps */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Next Steps</h2>
        <p className="text-gray-700 mb-4">
          Learn how to track your performance with analytics:
        </p>
        <Link
          href="/docs/analytics"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Analytics & Insights
          <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
      </div>
    </div>
  );
}


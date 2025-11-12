import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'ClientHunt Privacy Policy - Learn how we collect, use, and protect your data. GDPR compliant. Your data is encrypted and never shared.',
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 md:p-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
            <p className="text-sm text-gray-500 mb-8">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <div className="prose prose-gray max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
                <p className="text-gray-700 mb-4">
                  Welcome to ClientHunt ("we," "our," or "us"). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, store, and protect your data when you use our service.
                </p>
                <p className="text-gray-700">
                  By using ClientHunt, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our service.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">2.1 Personal Information</h3>
                <p className="text-gray-700 mb-4">We collect the following personal information:</p>
                <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                  <li><strong>Account Information:</strong> Email address, full name, password (encrypted)</li>
                  <li><strong>Profile Information:</strong> Preferences, settings, and user preferences</li>
                  <li><strong>Payment Information:</strong> Processed securely through our payment provider (Paddle). We do not store credit card details.</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">2.2 Usage Data</h3>
                <p className="text-gray-700 mb-4">We automatically collect:</p>
                <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                  <li>Keyword searches you create and monitor</li>
                  <li>Opportunities generated and viewed</li>
                  <li>Usage statistics and analytics</li>
                  <li>IP address, browser type, device information</li>
                  <li>Access times and dates</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">2.3 Reddit Data</h3>
                <p className="text-gray-700 mb-4">
                  We collect and store publicly available data from Reddit based on your keyword searches:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                  <li>Post titles, content, and metadata</li>
                  <li>Author usernames (publicly available Reddit handles)</li>
                  <li>Post URLs and permalinks</li>
                  <li>Subreddit information</li>
                  <li>Post timestamps and engagement metrics</li>
                </ul>
                <p className="text-gray-700 mb-4">
                  <strong>Important:</strong> We only collect publicly available data from Reddit. We do not access private messages, private subreddits, or any data that requires authentication beyond what is publicly accessible.
                </p>
                <p className="text-gray-700 mb-4">
                  <strong>Data Storage:</strong> This Reddit data is stored in our database to:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                  <li>Provide you with historical access to opportunities</li>
                  <li>Enable deduplication of leads</li>
                  <li>Improve our matching algorithms</li>
                </ul>
                <p className="text-gray-700">
                  <strong>Data Retention:</strong> Reddit data is retained for 90 days after your account is deleted, or until you request deletion, whichever comes first. This allows us to maintain data integrity and comply with legal obligations.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
                <p className="text-gray-700 mb-4">We use your information to:</p>
                <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                  <li>Provide and maintain our service</li>
                  <li>Monitor Reddit for opportunities matching your keywords</li>
                  <li>Send you notifications about new opportunities</li>
                  <li>Process payments and manage subscriptions</li>
                  <li>Improve our service and develop new features</li>
                  <li>Send important service updates and communications</li>
                  <li>Analyze usage patterns to enhance user experience</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Data Storage and Security</h2>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">4.1 Encryption</h3>
                <p className="text-gray-700 mb-4">
                  All data transmitted between your device and our servers is encrypted using industry-standard SSL/TLS encryption. Your passwords are hashed using bcrypt and never stored in plain text.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">4.2 Data Storage</h3>
                <p className="text-gray-700 mb-4">
                  Your data is stored on secure servers with access controls and regular security audits. We use reputable cloud hosting providers that comply with industry security standards.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">4.3 Data Retention</h3>
                <p className="text-gray-700 mb-4">
                  We retain your personal information according to the following schedule:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                  <li><strong>Active Accounts:</strong> Data is retained for as long as your account is active</li>
                  <li><strong>Deleted Accounts:</strong> Personal data is deleted within 30 days of account deletion request</li>
                  <li><strong>Reddit Data:</strong> Retained for 90 days after account deletion (for data integrity and legal compliance)</li>
                  <li><strong>Transaction Records:</strong> Retained for 7 years (for tax and accounting purposes, as required by law)</li>
                  <li><strong>Security Logs:</strong> Retained for 90 days (IP addresses, access logs)</li>
                </ul>
                <p className="text-gray-700">
                  You can request deletion of your account and data at any time by contacting us at <a href="mailto:privacy@clienthunt.app" className="text-blue-600 hover:underline">privacy@clienthunt.app</a>.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Data Sharing and Disclosure</h2>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">5.1 We Do Not Sell Your Data</h3>
                <p className="text-gray-700 mb-4">
                  <strong>We do not sell, rent, or trade your personal information to third parties.</strong> Your data is used solely to provide and improve our service.
                </p>
                <p className="text-gray-700 mb-4">
                  <strong>CCPA "Do Not Sell My Data":</strong> California residents can opt out of the sale of personal information (though we do not sell data). To exercise this right, please contact us at <a href="mailto:privacy@clienthunt.app" className="text-blue-600 hover:underline">privacy@clienthunt.app</a> or use the "Do Not Sell My Data" link in our footer.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">5.2 Service Providers</h3>
                <p className="text-gray-700 mb-4">We may share data with trusted service providers who assist us in:</p>
                <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                  <li>Payment processing (Paddle)</li>
                  <li>Email delivery services</li>
                  <li>Cloud hosting and infrastructure</li>
                  <li>Analytics and monitoring</li>
                </ul>
                <p className="text-gray-700">
                  These providers are contractually obligated to protect your data and use it only for the purposes we specify.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">5.3 Legal Requirements</h3>
                <p className="text-gray-700 mb-4">
                  We may disclose your information if required by law, court order, or government regulation, or to protect our rights, property, or safety, or that of our users.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Reddit and Fair Usage</h2>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">6.1 Reddit Data Collection</h3>
                <p className="text-gray-700 mb-4">
                  ClientHunt collects publicly available data from Reddit in accordance with Reddit's Terms of Service and API guidelines. We:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                  <li>Only access publicly available posts and comments</li>
                  <li>Respect Reddit's rate limits and usage policies</li>
                  <li>Do not scrape private or restricted content</li>
                  <li>Do not access user accounts or private messages</li>
                  <li>Comply with Reddit's robots.txt and API terms</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">6.2 Fair Usage Policy</h3>
                <p className="text-gray-700 mb-4">
                  We implement fair usage policies to ensure responsible data collection:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                  <li>Rate limiting to prevent excessive requests</li>
                  <li>Cooldown periods between data refreshes</li>
                  <li>Respect for Reddit's infrastructure and resources</li>
                  <li>No automated posting or interaction with Reddit</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Your Rights (GDPR & CCPA)</h2>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">7.1 Access and Portability</h3>
                <p className="text-gray-700 mb-4">
                  You have the right to access your personal data and receive a copy in a portable format.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">7.2 Correction and Deletion</h3>
                <p className="text-gray-700 mb-4">
                  You can update your account information at any time. You can also request deletion of your account and all associated data.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">7.3 Opt-Out</h3>
                <p className="text-gray-700 mb-4">
                  You can opt out of marketing emails at any time by clicking the unsubscribe link in our emails or updating your preferences in your account settings.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">7.4 Data Subject Requests</h3>
                <p className="text-gray-700 mb-4">
                  To exercise your rights, please contact us at <a href="mailto:privacy@clienthunt.app" className="text-blue-600 hover:underline">privacy@clienthunt.app</a>. We will respond to your request within 30 days.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">7.5 Right to be Forgotten (GDPR Article 17)</h3>
                <p className="text-gray-700 mb-4">
                  You have the right to request deletion of your personal data. To exercise this right:
                </p>
                <ol className="list-decimal pl-6 text-gray-700 mb-4 space-y-2">
                  <li>Email <a href="mailto:privacy@clienthunt.app" className="text-blue-600 hover:underline">privacy@clienthunt.app</a> with subject "Data Deletion Request"</li>
                  <li>Include your account email address</li>
                  <li>We will respond within 30 days</li>
                </ol>
                <p className="text-gray-700 mb-4">
                  <strong>What will be deleted:</strong>
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                  <li>Your account information (email, name, password hash)</li>
                  <li>Your keyword searches and preferences</li>
                  <li>Your saved opportunities and notes</li>
                  <li>Your usage analytics</li>
                </ul>
                <p className="text-gray-700 mb-4">
                  <strong>What may be retained (for legal compliance):</strong>
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                  <li>Transaction records (for tax/accounting purposes) - 7 years</li>
                  <li>Reddit data that was publicly available (may be anonymized) - 90 days</li>
                  <li>Logs containing your IP address (for security) - 90 days</li>
                </ul>
                <p className="text-gray-700">
                  After deletion, you will receive confirmation and your account will be permanently removed. Note: Account deletion is performed as a "soft delete" initially (account deactivated), with full data deletion completed within 30 days.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Cookies and Tracking</h2>
                <p className="text-gray-700 mb-4">
                  We use cookies and similar technologies to enhance your experience. For detailed information, please see our <Link href="/cookies" className="text-blue-600 hover:underline">Cookie Policy</Link>.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Children's Privacy</h2>
                <p className="text-gray-700 mb-4">
                  Our service is not intended for users under the age of 18. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. International Data Transfers</h2>
                <p className="text-gray-700 mb-4">
                  Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place to protect your data in accordance with this Privacy Policy.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Data Breach Notification</h2>
                <p className="text-gray-700 mb-4">
                  In the event of a data breach that may affect your personal information, we will notify you and relevant authorities as required by law within 72 hours of becoming aware of the breach.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Changes to This Policy</h2>
                <p className="text-gray-700 mb-4">
                  We may update this Privacy Policy from time to time. We will notify you of any material changes by:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                  <li>Posting the new policy on this page</li>
                  <li>Sending an email notification</li>
                  <li>Displaying a notice in our application</li>
                </ul>
                <p className="text-gray-700">
                  The "Last updated" date at the top of this page indicates when changes were made.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Contact Us</h2>
                <p className="text-gray-700 mb-4">
                  If you have questions about this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-gray-700 mb-2">
                    <strong>Email:</strong> <a href="mailto:privacy@clienthunt.app" className="text-blue-600 hover:underline">privacy@clienthunt.app</a>
                  </p>
                  <p className="text-gray-700 mb-2">
                    <strong>Support:</strong> <a href="mailto:support@clienthunt.app" className="text-blue-600 hover:underline">support@clienthunt.app</a>
                  </p>
                  <p className="text-gray-700">
                    <strong>Address:</strong> Dhaka, Bangladesh
                  </p>
                </div>
              </section>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <Link
                href="/"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}


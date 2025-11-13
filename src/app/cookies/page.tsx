import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'ClientHunt Cookie Policy - Learn about how we use cookies and tracking technologies to improve your experience.',
};

export default function CookiePolicyPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 md:p-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Cookie Policy</h1>
            <p className="text-sm text-gray-500 mb-8">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <div className="prose prose-gray max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. What Are Cookies?</h2>
                <p className="text-gray-700 mb-4">
                  Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work more efficiently and provide information to website owners.
                </p>
                <p className="text-gray-700">
                  ClientHunt uses cookies and similar tracking technologies to enhance your experience, analyze usage, and improve our service.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Types of Cookies We Use</h2>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">2.1 Essential Cookies</h3>
                <p className="text-gray-700 mb-4">
                  These cookies are necessary for the Service to function properly. They enable core functionality such as:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                  <li>User authentication and session management</li>
                  <li>Security and fraud prevention</li>
                  <li>Remembering your preferences and settings</li>
                  <li>Load balancing and performance optimization</li>
                </ul>
                <p className="text-gray-700">
                  These cookies cannot be disabled as they are essential for the Service to work.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">2.2 Analytics Cookies (Required)</h3>
                <p className="text-gray-700 mb-4">
                  <strong>Analytics cookies are required to use ClientHunt.</strong> We use analytics cookies to understand how visitors interact with our Service, which is essential for maintaining and improving our service quality. We use:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                  <li><strong>Google Analytics:</strong> To track website usage, page views, and user behavior. This is required for service functionality and quality assurance.</li>
                  <li><strong>Web Vitals:</strong> To measure performance metrics (Core Web Vitals) and ensure optimal service delivery.</li>
                </ul>
                <p className="text-gray-700 mb-4">
                  <strong>Important:</strong> Analytics cookies are necessary for the Service to function properly. By using ClientHunt, you consent to the use of these analytics cookies. If you do not accept analytics cookies, you will not be able to use our Service.
                </p>
                <p className="text-gray-700">
                  <strong>Note:</strong> While Google provides an opt-out browser add-on, using it may prevent you from accessing ClientHunt, as analytics cookies are required for service functionality.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">2.3 Functional Cookies</h3>
                <p className="text-gray-700 mb-4">
                  These cookies enable enhanced functionality and personalization:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                  <li>Remembering your language preferences</li>
                  <li>Storing tour completion status</li>
                  <li>Saving your search preferences</li>
                  <li>Maintaining your session state</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">2.4 Performance Cookies</h3>
                <p className="text-gray-700 mb-4">
                  These cookies help us understand how the Service performs and identify areas for improvement:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                  <li>Page load times and performance metrics</li>
                  <li>Error tracking and debugging</li>
                  <li>Resource usage monitoring</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Third-Party Cookies</h2>
                <p className="text-gray-700 mb-4">
                  Some cookies are placed by third-party services that appear on our pages:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                  <li><strong>Google Analytics:</strong> For website analytics (see above)</li>
                  <li><strong>Paddle:</strong> For payment processing (if applicable)</li>
                  <li><strong>Cloud Providers:</strong> For infrastructure and CDN services</li>
                </ul>
                <p className="text-gray-700">
                  We do not control these third-party cookies. Please refer to their respective privacy policies for more information.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Managing Cookies</h2>
                <p className="text-gray-700 mb-4">
                  <strong>Cookies are required to use ClientHunt.</strong> By using our Service, you must accept our use of cookies. You can control cookies through your browser settings, but please note that:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                  <li><strong>Blocking cookies will prevent you from using the Service</strong> - Cookies are essential for authentication, session management, and service functionality</li>
                  <li>Analytics cookies are required for service quality assurance and improvement</li>
                  <li>Disabling cookies will result in the Service being unavailable to you</li>
                  <li>You must accept cookies during registration to create an account</li>
                </ul>
                <p className="text-gray-700 mb-4">
                  <strong>Important:</strong> If you do not accept cookies, you will not be able to access or use ClientHunt. Cookies are a fundamental requirement for the Service to function.
                </p>
                <p className="text-gray-700 mb-6">
                  By registering for or using ClientHunt, you explicitly consent to our use of cookies as described in this policy.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">4.1 Browser Settings</h3>
                <p className="text-gray-700 mb-4">
                  Most browsers allow you to control cookies through their settings. However, blocking cookies will prevent you from using ClientHunt.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. How Long Do Cookies Last?</h2>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">4.1 Session Cookies</h3>
                <p className="text-gray-700 mb-4">
                  These cookies are temporary and are deleted when you close your browser. They are used to maintain your session while using the Service.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">4.2 Persistent Cookies</h3>
                <p className="text-gray-700 mb-4">
                  These cookies remain on your device for a set period or until you delete them. They include:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                  <li>Authentication tokens (typically 30 days)</li>
                  <li>User preferences (up to 1 year)</li>
                  <li>Analytics data (up to 2 years)</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Managing Cookies</h2>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">5.1 Browser Settings</h3>
                <p className="text-gray-700 mb-4">
                  Most browsers allow you to control cookies through their settings. You can:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                  <li>Block all cookies</li>
                  <li>Block third-party cookies only</li>
                  <li>Delete existing cookies</li>
                  <li>Set preferences for specific websites</li>
                </ul>
                <p className="text-gray-700 mb-4">
                  <strong>Note:</strong> Blocking essential cookies may affect the functionality of the Service.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">4.2 Browser-Specific Instructions</h3>
                <p className="text-gray-700 mb-4">
                  While you can control cookies through your browser settings, please note that blocking cookies will prevent you from using ClientHunt:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                  <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data</li>
                  <li><strong>Firefox:</strong> Options → Privacy & Security → Cookies and Site Data</li>
                  <li><strong>Safari:</strong> Preferences → Privacy → Cookies and website data</li>
                  <li><strong>Edge:</strong> Settings → Privacy, search, and services → Cookies and site permissions</li>
                </ul>
                <p className="text-gray-700">
                  <strong>Reminder:</strong> Blocking cookies will prevent you from accessing ClientHunt, as cookies are required for service functionality.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. How Long Do Cookies Last?</h2>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">5.1 Session Cookies</h3>
                <p className="text-gray-700 mb-4">
                  These cookies are temporary and are deleted when you close your browser. They are used to maintain your session while using the Service.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">5.2 Persistent Cookies</h3>
                <p className="text-gray-700 mb-4">
                  These cookies remain on your device for a set period or until you delete them. They include:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                  <li>Authentication tokens (typically 30 days)</li>
                  <li>User preferences (up to 1 year)</li>
                  <li>Analytics data (up to 2 years)</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Local Storage and Similar Technologies</h2>
                <p className="text-gray-700 mb-4">
                  In addition to cookies, we use similar technologies such as:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                  <li><strong>Local Storage:</strong> To store user preferences, tour progress, and search cache</li>
                  <li><strong>Session Storage:</strong> For temporary session data</li>
                  <li><strong>IndexedDB:</strong> For client-side data caching (if applicable)</li>
                </ul>
                <p className="text-gray-700">
                  You can clear these through your browser's developer tools or privacy settings.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Do Not Track Signals</h2>
                <p className="text-gray-700 mb-4">
                  Some browsers include a "Do Not Track" (DNT) feature. Currently, there is no industry standard for responding to DNT signals. We do not currently respond to DNT browser signals, as cookies are required for the Service to function properly.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Changes to This Policy</h2>
                <p className="text-gray-700 mb-4">
                  We may update this Cookie Policy from time to time. We will notify you of any material changes by updating the "Last updated" date at the top of this page.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Contact Us</h2>
                <p className="text-gray-700 mb-4">
                  If you have questions about our use of cookies, please contact us:
                </p>
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-gray-700 mb-2">
                    <strong>Email:</strong> <a href="mailto:support@clienthunt.app" className="text-blue-600 hover:underline">support@clienthunt.app</a>
                  </p>
                  <p className="text-gray-700">
                    <strong>Privacy:</strong> <a href="mailto:privacy@clienthunt.app" className="text-blue-600 hover:underline">privacy@clienthunt.app</a>
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


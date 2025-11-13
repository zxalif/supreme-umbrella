import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'ClientHunt Terms of Service - Read our terms and conditions for using our Reddit lead generation platform. Free trial, subscription terms, and user obligations.',
};

export default function TermsOfServicePage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 md:p-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
            <p className="text-sm text-gray-500 mb-8">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <div className="prose prose-gray max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Agreement to Terms</h2>
                <p className="text-gray-700 mb-4">
                  By accessing or using ClientHunt ("the Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these terms, you may not access the Service.
                </p>
                <p className="text-gray-700">
                  These Terms apply to all users, including visitors, registered users, and subscribers. Your use of the Service constitutes acceptance of these Terms.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
                <p className="text-gray-700 mb-4">
                  ClientHunt is an AI-powered lead generation platform that:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                  <li>Monitors Reddit for freelance opportunities based on your keyword searches</li>
                  <li>Analyzes and scores posts for relevance and quality</li>
                  <li>Provides notifications and alerts for matching opportunities</li>
                  <li>Offers tools to manage and track your leads</li>
                </ul>
                <p className="text-gray-700">
                  The Service is provided "as-is" and we reserve the right to modify, suspend, or discontinue any aspect of the Service at any time.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Eligibility</h2>
                <p className="text-gray-700 mb-4">To use ClientHunt, you must:</p>
                <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                  <li>Be at least 18 years old</li>
                  <li>Have the legal capacity to enter into binding agreements</li>
                  <li>Provide accurate and complete registration information</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>Comply with all applicable laws and regulations</li>
                  <li><strong>Accept the use of cookies and tracking technologies</strong> - Cookies are required for the Service to function properly. By using ClientHunt, you consent to our use of cookies as described in our <Link href="/cookies" className="text-blue-600 hover:underline">Cookie Policy</Link>.</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Free Trial</h2>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">4.1 Trial Period</h3>
                <p className="text-gray-700 mb-4">
                  We offer a 1-month free trial with no credit card required. During the trial period, you have access to all features of the selected plan.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">4.2 Trial Conversion</h3>
                <p className="text-gray-700 mb-4">
                  At the end of the trial period, your account will automatically convert to a paid subscription unless you cancel before the trial ends. You will be notified via email before the trial expires.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">4.3 Trial Limitations</h3>
                <p className="text-gray-700 mb-4">
                  We reserve the right to limit trial accounts to prevent abuse. One trial per user, email address, or payment method.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Subscription and Payment</h2>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">5.1 Subscription Plans</h3>
                <p className="text-gray-700 mb-4">
                  We offer monthly and annual subscription plans. Pricing and features are available on our pricing page and may change with notice.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">5.2 Billing and Auto-Renewal</h3>
                <p className="text-gray-700 mb-4">
                  Subscriptions automatically renew at the end of each billing period unless cancelled. You authorize us to charge your payment method for renewal fees.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">5.3 Payment Processing</h3>
                <p className="text-gray-700 mb-4">
                  Payments are processed securely through Paddle, our payment provider. We do not store your credit card information. By subscribing, you agree to Paddle's terms and conditions.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">5.4 Price Changes</h3>
                <p className="text-gray-700 mb-4">
                  We reserve the right to change subscription prices. Existing subscribers will be notified at least 30 days in advance. Price changes will apply to the next billing cycle.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">5.5 Non-Payment</h3>
                <p className="text-gray-700 mb-4">
                  If payment fails, we may suspend or terminate your account. You remain responsible for all charges incurred before termination.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">5.6 Chargebacks and Fraud</h3>
                <p className="text-gray-700 mb-4">
                  If you dispute a charge (chargeback) with your payment provider:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                  <li>Your account will be immediately suspended pending resolution</li>
                  <li>We reserve the right to permanently ban accounts with fraudulent chargebacks</li>
                  <li>Chargeback fees may be passed on to you</li>
                  <li>We will provide transaction records to payment processor upon request</li>
                </ul>
                <p className="text-gray-700 mb-4">
                  <strong>Fraud Prevention:</strong> We monitor for suspicious activity and may suspend accounts without notice. Sharing accounts or using stolen payment methods is prohibited. Violations may result in legal action.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">5.7 Taxes</h3>
                <p className="text-gray-700 mb-4">
                  Prices are exclusive of applicable taxes. You are responsible for:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                  <li>VAT/GST in your jurisdiction (if applicable)</li>
                  <li>Any import duties or taxes</li>
                  <li>Income tax on revenue generated from ClientHunt leads</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Cancellation and Refunds</h2>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">6.1 Cancellation</h3>
                <p className="text-gray-700 mb-4">
                  You can cancel your subscription at any time from your account settings. Cancellation takes effect at the end of your current billing period. You will continue to have access until the period ends.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">6.2 Refund Policy</h3>
                <p className="text-gray-700 mb-4">
                  We offer a 30-day money-back guarantee for new subscriptions. To request a refund, contact us at <a href="mailto:support@clienthunt.app" className="text-blue-600 hover:underline">support@clienthunt.app</a> within 30 days of your initial purchase.
                </p>
                <p className="text-gray-700 mb-4">
                  Refunds are not available for:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                  <li>Subscriptions cancelled after 30 days</li>
                  <li>Renewal payments</li>
                  <li>Accounts terminated for violation of these Terms</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. User Obligations and Acceptable Use</h2>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">7.1 Acceptable Use</h3>
                <p className="text-gray-700 mb-4">You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree NOT to:</p>
                <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                  <li>Violate any applicable laws or regulations</li>
                  <li>Infringe on intellectual property rights</li>
                  <li>Use the Service to spam, harass, or harm others</li>
                  <li>Attempt to reverse-engineer or hack the Service</li>
                  <li>Share your account credentials with others</li>
                  <li>Use automated tools to abuse the Service</li>
                  <li>Violate Reddit's Terms of Service or API guidelines</li>
                  <li>Resell or redistribute leads obtained through the Service</li>
                  <li>Use the Service for any illegal or unauthorized purpose</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">7.2 Reddit Compliance</h3>
                <p className="text-gray-700 mb-4">
                  You agree to comply with Reddit's Terms of Service and API guidelines when using opportunities found through ClientHunt. You are responsible for your own interactions with Reddit users and content.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Intellectual Property</h2>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">8.1 Our Rights</h3>
                <p className="text-gray-700 mb-4">
                  The Service, including its design, functionality, algorithms, AI models, and content, is owned by ClientHunt and protected by intellectual property laws. All rights not expressly granted are reserved.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">8.2 User Content</h3>
                <p className="text-gray-700 mb-4">
                  You retain ownership of keywords, searches, and other content you create. By using the Service, you grant us a license to use, process, and store this content to provide the Service.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">8.3 Reddit Content</h3>
                <p className="text-gray-700 mb-4">
                  Content from Reddit remains the property of Reddit and its users. We display this content in accordance with Reddit's Terms of Service and API guidelines.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Disclaimers and Warranties</h2>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">9.1 Service "As-Is"</h3>
                <p className="text-gray-700 mb-4">
                  The Service is provided "as-is" and "as available" without warranties of any kind, either express or implied. We do not guarantee:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                  <li>That the Service will be uninterrupted or error-free</li>
                  <li>That opportunities will result in clients or income</li>
                  <li>The accuracy, completeness, or quality of leads</li>
                  <li>That all relevant opportunities will be found</li>
                  <li>Compatibility with all devices or browsers</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">9.2 No Guarantee of Results</h3>
                <p className="text-gray-700 mb-4">
                  <strong>We do not guarantee that using ClientHunt will result in finding clients, securing projects, or generating income.</strong> The Service is a tool to help you discover opportunities; success depends on many factors beyond our control.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">9.3 Third-Party Data Disclaimer</h3>
                <p className="text-gray-700 mb-4">
                  ClientHunt aggregates data from Reddit, a third-party platform. We do not control, verify, or guarantee the accuracy, completeness, or timeliness of Reddit content. Reddit posts may be deleted, edited, or removed by Reddit or users at any time. We are not responsible for changes to Reddit content after it is collected.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">9.4 AI and Automation</h3>
                <p className="text-gray-700 mb-4">
                  ClientHunt uses artificial intelligence and machine learning to analyze and classify Reddit content. AI systems are not perfect and may:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                  <li>Misclassify opportunities</li>
                  <li>Miss relevant posts</li>
                  <li>Generate inaccurate scores or insights</li>
                </ul>
                <p className="text-gray-700">
                  We do not guarantee the accuracy of AI-generated classifications. Users should review all opportunities and use their own judgment. We are not liable for decisions made based on AI-generated content.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Limitation of Liability</h2>
                <p className="text-gray-700 mb-4">
                  To the maximum extent permitted by law, ClientHunt and its affiliates shall not be liable for:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                  <li>Indirect, incidental, special, or consequential damages</li>
                  <li>Loss of profits, revenue, data, or business opportunities</li>
                  <li>Damages resulting from your use or inability to use the Service</li>
                  <li>Third-party actions or content (including Reddit content)</li>
                  <li>Service interruptions or technical issues</li>
                </ul>
                <p className="text-gray-700">
                  Our total liability shall not exceed the amount you paid us in the 12 months preceding the claim.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Termination</h2>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">11.1 Termination by You</h3>
                <p className="text-gray-700 mb-4">
                  You may terminate your account at any time by cancelling your subscription and deleting your account from the settings page.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">11.2 Termination by Us</h3>
                <p className="text-gray-700 mb-4">
                  We may suspend or terminate your account immediately if you:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                  <li>Violate these Terms or our Acceptable Use Policy</li>
                  <li>Engage in fraudulent or illegal activity</li>
                  <li>Fail to pay subscription fees</li>
                  <li>Abuse the Service or other users</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">11.3 Effect of Termination</h3>
                <p className="text-gray-700 mb-4">
                  Upon termination, your access to the Service will cease. We may delete your account and data in accordance with our Privacy Policy. You remain responsible for all charges incurred before termination.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">11.4 Appeal Process</h3>
                <p className="text-gray-700 mb-4">
                  If your account is suspended or terminated, you may appeal by:
                </p>
                <ol className="list-decimal pl-6 text-gray-700 mb-4 space-y-2">
                  <li>Emailing support@clienthunt.app within 30 days</li>
                  <li>Providing explanation and evidence</li>
                  <li>We will review within 14 business days</li>
                  <li>Our decision is final</li>
                </ol>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Third-Party Services</h2>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3">12.1 Reddit API Compliance</h3>
                <p className="text-gray-700 mb-4">
                  ClientHunt uses Reddit's official API (AsyncPRAW) in compliance with Reddit's Terms of Service and API Guidelines. We:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                  <li>Maintain valid API credentials and respect all rate limits</li>
                  <li>Only access publicly available posts and comments</li>
                  <li>Do not engage in automated posting, voting, or interaction</li>
                  <li>Comply with Reddit's robots.txt and usage policies</li>
                </ul>
                <p className="text-gray-700 mb-4">
                  <strong>Important:</strong> ClientHunt is not affiliated with, endorsed by, or sponsored by Reddit Inc. Reddit is a trademark of Reddit Inc.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">12.2 Third-Party Service Changes</h3>
                <p className="text-gray-700 mb-4">
                  ClientHunt depends on third-party services, including Reddit's API. If Reddit:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                  <li>Changes API pricing or access terms</li>
                  <li>Deprecates or restricts API access</li>
                  <li>Imposes new usage limitations</li>
                </ul>
                <p className="text-gray-700 mb-4">
                  We reserve the right to:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                  <li>Adjust our service offerings</li>
                  <li>Modify pricing to reflect increased costs</li>
                  <li>Suspend or limit features dependent on Reddit</li>
                  <li>Provide 30 days notice of material changes</li>
                </ul>
                <p className="text-gray-700 mb-4">
                  We are not liable for service disruptions caused by third-party API changes.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">12.3 Other Third-Party Services</h3>
                <p className="text-gray-700 mb-4">
                  The Service also integrates with:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                  <li><strong>Paddle:</strong> Payment processing. Your use of Paddle is subject to their terms and conditions.</li>
                  <li><strong>Cloud Providers:</strong> Hosting and infrastructure services.</li>
                  <li><strong>Email Services:</strong> For transactional and service emails.</li>
                </ul>
                <p className="text-gray-700">
                  We are not responsible for the availability, accuracy, or practices of third-party services.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Indemnification</h2>
                <p className="text-gray-700 mb-4">
                  You agree to indemnify and hold harmless ClientHunt, its affiliates, and their officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                  <li>Your use of the Service</li>
                  <li>Your violation of these Terms</li>
                  <li>Your violation of any third-party rights</li>
                  <li>Your interactions with Reddit or other third-party services</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Governing Law and Dispute Resolution</h2>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">14.1 Governing Law</h3>
                <p className="text-gray-700 mb-4">
                  These Terms shall be governed by and construed in accordance with the laws of Bangladesh, without regard to its conflict of law provisions.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">14.2 Dispute Resolution</h3>
                <p className="text-gray-700 mb-4">
                  Any disputes arising from these Terms or the Service shall be resolved through binding arbitration in accordance with the Arbitration Act of Bangladesh, except where prohibited by law. You waive your right to a jury trial and to participate in class actions.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">14.3 Data Protection Disputes</h3>
                <p className="text-gray-700 mb-4">
                  Notwithstanding Section 14.1, disputes related to data protection, privacy, or GDPR/CCPA compliance may be subject to the jurisdiction of the user's country of residence, as required by applicable data protection laws.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">15. Changes to Terms</h2>
                <p className="text-gray-700 mb-4">
                  We reserve the right to modify these Terms at any time. Material changes will be communicated by:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                  <li>Posting the updated Terms on this page</li>
                  <li>Sending an email notification</li>
                  <li>Displaying a notice in the Service</li>
                </ul>
                <p className="text-gray-700 mb-4">
                  Continued use of the Service after changes constitutes acceptance of the new Terms. If you disagree with changes, you must stop using the Service and cancel your subscription.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">16. Severability</h2>
                <p className="text-gray-700 mb-4">
                  If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary, and the remaining provisions shall remain in full force and effect.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">17. Force Majeure</h2>
                <p className="text-gray-700 mb-4">
                  ClientHunt is not liable for failures or delays due to:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                  <li>Third-party API outages (Reddit, payment processors)</li>
                  <li>Internet or infrastructure failures</li>
                  <li>Natural disasters, pandemics, or government actions</li>
                  <li>Changes to third-party terms of service</li>
                </ul>
                <p className="text-gray-700 mb-4">
                  In such events, we will:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                  <li>Provide reasonable notice when possible</li>
                  <li>Work to restore service promptly</li>
                  <li>Offer prorated refunds for extended outages (more than 7 days)</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">18. Entire Agreement</h2>
                <p className="text-gray-700 mb-4">
                  These Terms, together with our Privacy Policy and Cookie Policy, constitute the entire agreement between you and ClientHunt regarding the Service and supersede all prior agreements and understandings.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">19. Contact Information</h2>
                <p className="text-gray-700 mb-4">
                  If you have questions about these Terms, please contact us:
                </p>
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-gray-700 mb-2">
                    <strong>Email:</strong> <a href="mailto:support@clienthunt.app" className="text-blue-600 hover:underline">support@clienthunt.app</a>
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


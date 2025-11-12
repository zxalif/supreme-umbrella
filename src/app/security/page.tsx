import type { Metadata } from 'next';
import Link from 'next/link';
import { Shield, Lock, Eye, Server, Key, AlertTriangle } from 'lucide-react';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';

export const metadata: Metadata = {
  title: 'Security',
  description: 'ClientHunt Security - Learn about our security measures, data encryption, and commitment to protecting your information.',
};

export default function SecurityPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 md:p-12">
            <div className="flex items-center mb-6">
              <Shield className="w-10 h-10 text-blue-600 mr-4" />
              <h1 className="text-4xl font-bold text-gray-900">Security</h1>
            </div>
            <p className="text-sm text-gray-500 mb-8">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <div className="prose prose-gray max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Commitment to Security</h2>
                <p className="text-gray-700 mb-4">
                  At ClientHunt, we take security seriously. We implement industry-standard security measures to protect your data and ensure the safety of our platform.
                </p>
              </section>

              <section className="mb-8">
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                    <Lock className="w-8 h-8 text-blue-600 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Data Encryption</h3>
                    <p className="text-gray-700">
                      All data transmitted between your device and our servers is encrypted using SSL/TLS encryption. Your passwords are hashed using bcrypt and never stored in plain text.
                    </p>
                  </div>

                  <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                    <Server className="w-8 h-8 text-green-600 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure Infrastructure</h3>
                    <p className="text-gray-700">
                      Our servers are hosted on secure cloud infrastructure with regular security audits, access controls, and monitoring.
                    </p>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
                    <Key className="w-8 h-8 text-purple-600 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Access Controls</h3>
                    <p className="text-gray-700">
                      We implement strict access controls and authentication measures. Only authorized personnel have access to user data, and all access is logged and monitored.
                    </p>
                  </div>

                  <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
                    <Eye className="w-8 h-8 text-orange-600 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Monitoring & Alerts</h3>
                    <p className="text-gray-700">
                      We continuously monitor our systems for security threats and anomalies. Automated alerts notify us of any suspicious activity.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Security Measures</h2>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">1. Data Protection</h3>
                <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                  <li>End-to-end encryption for data in transit</li>
                  <li>Encryption at rest for sensitive data</li>
                  <li>Secure password hashing (bcrypt)</li>
                  <li>Regular security audits and penetration testing</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">2. Infrastructure Security</h3>
                <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                  <li>Secure cloud hosting with industry-leading providers</li>
                  <li>Firewall protection and DDoS mitigation</li>
                  <li>Regular security updates and patches</li>
                  <li>Backup and disaster recovery procedures</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">3. Access Management</h3>
                <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                  <li>Multi-factor authentication for admin accounts</li>
                  <li>Role-based access controls</li>
                  <li>Regular access reviews and audits</li>
                  <li>Secure API authentication (Bearer tokens)</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">4. Compliance</h3>
                <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                  <li>GDPR compliant data handling</li>
                  <li>Regular security assessments</li>
                  <li>Privacy by design principles</li>
                  <li>Data breach notification procedures</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Breach Response</h2>
                <p className="text-gray-700 mb-4">
                  In the unlikely event of a data breach, we have procedures in place to:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                  <li>Immediately contain and assess the breach</li>
                  <li>Notify affected users within 72 hours</li>
                  <li>Report to relevant authorities as required by law</li>
                  <li>Provide guidance on protective measures</li>
                  <li>Conduct a post-incident review</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Role in Security</h2>
                <p className="text-gray-700 mb-4">
                  Security is a shared responsibility. You can help protect your account by:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                  <li>Using a strong, unique password</li>
                  <li>Not sharing your account credentials</li>
                  <li>Keeping your email address secure</li>
                  <li>Reporting suspicious activity immediately</li>
                  <li>Keeping your browser and devices updated</li>
                </ul>
              </section>

              <section className="mb-8">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <div className="flex items-start">
                    <AlertTriangle className="w-6 h-6 text-yellow-600 mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Report Security Issues</h3>
                      <p className="text-gray-700 mb-4">
                        If you discover a security vulnerability, please report it responsibly to <a href="mailto:security@clienthunt.app" className="text-blue-600 hover:underline">security@clienthunt.app</a>. We appreciate your help in keeping ClientHunt secure.
                      </p>
                      <p className="text-sm text-gray-600">
                        Please do not publicly disclose vulnerabilities until we have had a chance to address them.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Third-Party Security</h2>
                <p className="text-gray-700 mb-4">
                  We work with trusted third-party service providers who maintain high security standards:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                  <li><strong>Payment Processing:</strong> Paddle (PCI DSS compliant)</li>
                  <li><strong>Cloud Hosting:</strong> Industry-leading providers with SOC 2 compliance</li>
                  <li><strong>Email Services:</strong> Secure email delivery with encryption</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
                <p className="text-gray-700 mb-4">
                  For security-related questions or concerns:
                </p>
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-gray-700 mb-2">
                    <strong>Security Team:</strong> <a href="mailto:security@clienthunt.app" className="text-blue-600 hover:underline">security@clienthunt.app</a>
                  </p>
                  <p className="text-gray-700">
                    <strong>General Support:</strong> <a href="mailto:support@clienthunt.app" className="text-blue-600 hover:underline">support@clienthunt.app</a>
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


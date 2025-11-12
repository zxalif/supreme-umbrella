import type { Metadata } from 'next';
import Link from 'next/link';
import { Mail, MessageCircle } from 'lucide-react';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with ClientHunt - We\'re here to help with questions, support, or feedback.',
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 md:p-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
            <p className="text-gray-600 mb-8">
              Have a question, need support, or want to share feedback? We're here to help.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                <Mail className="w-8 h-8 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Email Support</h3>
                <p className="text-gray-700 mb-4">
                  For general inquiries, support, or feedback:
                </p>
                <a
                  href="mailto:support@clienthunt.app"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  support@clienthunt.app
                </a>
              </div>

              <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
                <MessageCircle className="w-8 h-8 text-purple-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">In-App Support</h3>
                <p className="text-gray-700 mb-4">
                  Logged in users can access support directly from the dashboard:
                </p>
                <Link
                  href="/dashboard/support"
                  className="text-purple-600 hover:text-purple-700 font-medium"
                >
                  Go to Support →
                </Link>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Other Contact Methods</h3>
              <div className="space-y-3 text-gray-700">
                <p>
                  <strong>Privacy Inquiries:</strong>{' '}
                  <a href="mailto:privacy@clienthunt.app" className="text-blue-600 hover:underline">privacy@clienthunt.app</a>
                </p>
                <p>
                  <strong>Security Issues:</strong>{' '}
                  <a href="mailto:security@clienthunt.app" className="text-blue-600 hover:underline">security@clienthunt.app</a>
                </p>
                <p>
                  <strong>Business Inquiries:</strong>{' '}
                  <a href="mailto:business@clienthunt.app" className="text-blue-600 hover:underline">business@clienthunt.app</a>
                </p>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Response Time</h3>
              <p className="text-gray-700">
                We typically respond to all inquiries within 24-48 hours during business days. For urgent matters, please mark your email as "Urgent" in the subject line.
              </p>
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


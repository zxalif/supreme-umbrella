import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';

export const metadata: Metadata = {
  title: 'Careers',
  description: 'Join the ClientHunt team - We\'re building the future of freelance lead generation.',
};

export default function CareersPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 md:p-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Careers at ClientHunt</h1>
            <p className="text-gray-600 mb-8">
              We're always looking for talented individuals to join our team.
            </p>

            <div className="prose prose-gray max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Open Positions</h2>
                <div className="bg-gray-50 rounded-lg p-6 mb-4">
                  <p className="text-gray-700">
                    We don't have any open positions at the moment, but we're always interested in hearing from talented people. If you're passionate about helping freelancers and building great products, we'd love to hear from you.
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Why Work With Us?</h2>
                <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                  <li>Work on products that help freelancers succeed</li>
                  <li>Remote-first culture with flexible hours</li>
                  <li>Competitive compensation and benefits</li>
                  <li>Opportunity to shape the future of the platform</li>
                  <li>Collaborative and supportive team environment</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Get in Touch</h2>
                <p className="text-gray-700 mb-4">
                  Even if we don't have a position open right now, feel free to send us your resume and a note about why you're interested in ClientHunt:
                </p>
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-gray-700">
                    <strong>Email:</strong>{' '}
                    <a href="mailto:careers@clienthunt.app" className="text-blue-600 hover:underline">careers@clienthunt.app</a>
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


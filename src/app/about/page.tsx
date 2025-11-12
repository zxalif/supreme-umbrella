import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about ClientHunt - Our mission to help freelancers find opportunities on Reddit through AI-powered automation.',
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 md:p-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">About ClientHunt</h1>

            <div className="prose prose-gray max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h2>
                <p className="text-gray-700 mb-4">
                  ClientHunt was born from a simple idea: finding freelance opportunities shouldn't be a full-time job. We believe that freelancers should spend their time doing what they love, not endlessly scrolling through job boards.
                </p>
                <p className="text-gray-700">
                  Our mission is to help freelancers discover high-quality opportunities on Reddit through AI-powered automation, so you can focus on what matters most - delivering great work to your clients.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">What We Do</h2>
                <p className="text-gray-700 mb-4">
                  ClientHunt is an AI-powered lead generation platform that:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                  <li>Monitors Reddit 24/7 for freelance opportunities matching your skills</li>
                  <li>Uses AI to analyze and score posts for relevance and quality</li>
                  <li>Sends you instant notifications when opportunities are found</li>
                  <li>Helps you manage and track your leads in one place</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Values</h2>
                <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                  <li><strong>Transparency:</strong> We're open about how we collect and use data</li>
                  <li><strong>Privacy:</strong> Your data is encrypted and never shared or sold</li>
                  <li><strong>Fair Usage:</strong> We respect Reddit's terms and implement responsible data collection</li>
                  <li><strong>User-First:</strong> Everything we build is designed with freelancers in mind</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
                <p className="text-gray-700 mb-4">
                  Have questions or feedback? We'd love to hear from you:
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


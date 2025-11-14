'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Calendar, Sparkles, ArrowRight } from 'lucide-react';

/**
 * Coming Soon Page Component
 * 
 * Modern coming soon page with email capture and countdown
 * Uses Soft Blue design system
 */
export function ComingSoon() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Integrate with email service
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-primary-50/30 to-secondary-50/20 flex items-center justify-center px-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-100/20 to-secondary-100/20"></div>
      </div>

      <div className="relative max-w-2xl mx-auto text-center">
        {/* Logo/Brand */}
        <div className="mb-8">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-full text-sm font-medium shadow-lg">
            <Sparkles className="w-4 h-4 mr-2" />
            ClientHunt
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Something Amazing is 
          <span className="text-primary-500"> Coming Soon</span>
        </h1>

        {/* Subheading */}
        <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
          We're working hard to bring you the next generation of 
          <strong className="text-primary-600"> AI-powered freelance lead generation</strong>.
        </p>

        {/* Countdown or Launch Date */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <Calendar className="w-5 h-5 text-secondary-500" />
          <span className="text-lg text-gray-700">
            Launching <strong className="text-secondary-600">Q1 2026</strong>
          </span>
        </div>

        {/* Email Capture */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200 mb-8">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">
            Be the First to Know
          </h3>
          <p className="text-gray-600 mb-6">
            Get notified when we launch and receive exclusive early access.
          </p>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-opacity-20 outline-none transition-all"
                />
              </div>
              <button
                type="submit"
                className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl inline-flex items-center justify-center"
              >
                <Mail className="w-4 h-4 mr-2" />
                Notify Me
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </form>
          ) : (
            <div className="bg-accent-50 border border-accent-200 rounded-lg p-4">
              <div className="flex items-center justify-center text-accent-700">
                <Sparkles className="w-5 h-5 mr-2" />
                <span className="font-medium">Thanks! We'll notify you when we launch.</span>
              </div>
            </div>
          )}
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">AI-Powered</h4>
            <p className="text-sm text-gray-600">Advanced AI finds the best opportunities</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Real-Time Alerts</h4>
            <p className="text-sm text-gray-600">Get notified instantly when leads match</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">24/7 Monitoring</h4>
            <p className="text-sm text-gray-600">Never miss an opportunity again</p>
          </div>
        </div>

        {/* Social Links */}
        <div className="text-center">
          <p className="text-gray-600 mb-4">Follow our journey:</p>
          <div className="flex justify-center gap-4">
            <a 
              href="https://twitter.com/clienthuntapp" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-primary-500 transition-colors"
            >
              Twitter
            </a>
            <a 
              href="https://www.linkedin.com/company/clienthuntapp/" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-primary-500 transition-colors"
            >
              LinkedIn
            </a>
            <Link 
              href="/blog" 
              className="text-gray-400 hover:text-primary-500 transition-colors"
            >
              Blog
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

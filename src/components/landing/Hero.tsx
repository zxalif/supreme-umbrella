'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

/**
 * Hero Section Component
 * 
 * Main landing page hero with:
 * - Compelling headline
 * - Value proposition
 * - Primary CTA
 * - Trust indicators
 * - Animations
 */
export function Hero() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Mark as mounted to enable animations
    setIsMounted(true);
    
    // Trigger animations smoothly after mount
    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        // Mark animated elements to trigger animations
        // This allows CSS to transition from visible to animated state smoothly
        const animatedElements = document.querySelectorAll('.animate-fade-in-up');
        animatedElements.forEach((el) => {
          // Force reflow to ensure smooth transition
          void el.offsetHeight;
          el.setAttribute('data-animated', 'true');
        });
      });
    });
  }, []);

  return (
    <section className="relative bg-gradient-to-br from-white via-primary-50/30 to-secondary-50/20 py-6 lg:py-8 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-100/20 to-secondary-100/20"></div>
      </div>
      
      {/* Animated Background Elements - Floating Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div 
          className="absolute top-20 left-10 w-72 h-72 rounded-full animate-blob-subtle"
          style={{ 
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(168, 85, 247, 0.15))',
            filter: 'blur(80px)',
            willChange: 'transform'
          }}
        ></div>
        <div 
          className="absolute top-40 right-10 w-72 h-72 rounded-full animate-blob-subtle animation-delay-2000"
          style={{ 
            background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(16, 185, 129, 0.15))',
            filter: 'blur(80px)',
            willChange: 'transform'
          }}
        ></div>
        <div 
          className="absolute -bottom-8 left-1/2 w-72 h-72 rounded-full animate-blob-subtle animation-delay-4000"
          style={{ 
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(59, 130, 246, 0.15))',
            filter: 'blur(80px)',
            willChange: 'transform'
          }}
        ></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className={`text-center lg:text-left ${isMounted ? 'animate-fade-in-up' : 'opacity-100'}`}>
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-full text-sm font-medium mb-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in">
              <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
              Trusted by 1,000+ freelancers
            </div>

            {/* Main Headline - SEO Optimized with Primary Keyword */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              <span className={`inline-block ${isMounted ? 'animate-fade-in-up delay-100' : 'opacity-100'}`}>
                Find Freelance Opportunities on
              </span>
              <span className={`inline-block ${isMounted ? 'animate-fade-in-up delay-200' : 'opacity-100'}`}>
                {' '}<span className="text-primary-500 bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent animate-gradient">Reddit Automatically</span>
              </span>
              <span className={`block ${isMounted ? 'animate-fade-in-up delay-300' : 'opacity-100'}`}>
                <span className="text-secondary-600 inline-block">Never Miss a Lead Again 😴</span>
              </span>
            </h1>

            {/* Subheadline - More Compelling with Animation */}
            <p className={`text-xl md:text-2xl text-gray-600 mb-4 leading-relaxed ${isMounted ? 'animate-fade-in-up delay-400' : 'opacity-100'}`}>
              Stop manually searching Reddit. Get <strong className="text-primary-600 animate-pulse-subtle">qualified leads delivered</strong> to your inbox while you sleep.
            </p>
            <p className={`text-lg text-gray-700 mb-8 ${isMounted ? 'animate-fade-in-up delay-500' : 'opacity-100'}`}>
              AI-powered lead generation from Reddit's freelance communities.
            </p>

            {/* Trust Indicators with Animation */}
            <div className={`flex flex-col sm:flex-row gap-6 mb-10 justify-center lg:justify-start ${isMounted ? 'animate-fade-in-up delay-600' : 'opacity-100'}`}>
              <div className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm rounded-lg px-4 py-3 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 animate-fade-in-up delay-1000">
                <CheckCircle className="w-5 h-5 text-accent-500 flex-shrink-0 animate-check-in" />
                <span className="text-gray-700 font-medium">1-month free trial</span>
              </div>
              <div className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm rounded-lg px-4 py-3 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 animate-fade-in-up delay-1100">
                <CheckCircle className="w-5 h-5 text-accent-500 flex-shrink-0 animate-check-in delay-100" />
                <span className="text-gray-700 font-medium">No credit card</span>
              </div>
              <div className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm rounded-lg px-4 py-3 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 animate-fade-in-up delay-1200">
                <CheckCircle className="w-5 h-5 text-accent-500 flex-shrink-0 animate-check-in delay-200" />
                <span className="text-gray-700 font-medium">Cancel anytime</span>
              </div>
            </div>

            {/* CTA Buttons with Animation */}
            <div className={`flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8 ${isMounted ? 'animate-fade-in-up delay-700' : 'opacity-100'}`}>
              <Link
                href="/register"
                className="bg-primary-500 hover:bg-primary-600 text-white text-lg px-8 py-4 rounded-lg font-semibold inline-flex items-center justify-center group shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 animate-fade-in-up delay-1300"
              >
                🚀 Start Finding Leads
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="#demo"
                className="bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200 hover:border-primary-300 text-lg px-8 py-4 rounded-lg font-semibold inline-flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-300 animate-fade-in-up delay-1400"
              >
                👀 Watch Demo
              </Link>
            </div>

            {/* Value Props */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center lg:text-left">
              <div className="flex flex-col items-center lg:items-start">
                <div className="text-2xl font-bold text-primary-600">15+</div>
                <div className="text-sm text-gray-600">Hours saved weekly</div>
              </div>
              <div className="flex flex-col items-center lg:items-start">
                <div className="text-2xl font-bold text-secondary-600">24/7</div>
                <div className="text-sm text-gray-600">AI monitoring</div>
              </div>
              <div className="flex flex-col items-center lg:items-start">
                <div className="text-2xl font-bold text-accent-600">3x</div>
                <div className="text-sm text-gray-600">More opportunities</div>
              </div>
            </div>

            {/* Social Proof with Colorful Logos */}
            <div className={`mt-12 pt-8 border-t border-gray-200 ${isMounted ? 'animate-fade-in-up delay-800' : 'opacity-100'}`}>
              <p className="text-sm text-gray-500 mb-4">Trusted by freelancers from:</p>
              <div className="flex flex-wrap gap-6 items-center justify-center lg:justify-start">
                <span className="text-[#14A800] font-bold text-lg hover:scale-110 transition-transform duration-300 cursor-default">Upwork</span>
                <span className="text-[#1DBF73] font-bold text-lg hover:scale-110 transition-transform duration-300 cursor-default">Fiverr</span>
                <span className="text-[#0B0F3B] font-bold text-lg hover:scale-110 transition-transform duration-300 cursor-default">Freelancer</span>
                <span className="text-[#3861FB] font-bold text-lg hover:scale-110 transition-transform duration-300 cursor-default">Toptal</span>
              </div>
            </div>
          </div>

          {/* Right Column - Visual/Mockup with Slide-in Animation */}
          <div className={`relative lg:block hidden ${isMounted ? 'animate-fade-in-up delay-300' : 'opacity-100'}`}>
            <div className="relative">
              {/* Dashboard Mockup with Realistic Data */}
              <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-4">
                <div className="space-y-3">
                  {/* Dashboard Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">C</span>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Today's Hot Leads</div>
                        <div className="text-sm text-gray-500">3 new opportunities</div>
                      </div>
                    </div>
                    <div className="bg-primary-500 text-white px-3 py-1 rounded-lg text-sm font-medium">
                      Live
                    </div>
                  </div>

                  {/* Realistic Opportunity Cards with Staggered Slide-in */}
                  <div className={`border border-gray-200 rounded-lg p-4 hover:border-primary-300 hover:shadow-md transition-all duration-300 ${isMounted ? 'animate-fade-in-up delay-400' : 'opacity-100'}`}>
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 text-sm">Need React Developer for E-commerce Site</h3>
                      <span className="bg-accent-100 text-accent-700 px-2 py-1 rounded-full text-xs font-medium">95 Score</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">Looking for experienced React dev to build modern e-commerce platform. $5000-8000 budget.</p>
                    <div className="flex items-center gap-2">
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">React</span>
                      <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs">$5K-8K</span>
                      <span className="text-xs text-gray-500">2 min ago</span>
                    </div>
                  </div>

                  <div className={`border border-gray-200 rounded-lg p-4 hover:border-primary-300 hover:shadow-md transition-all duration-300 ${isMounted ? 'animate-fade-in-up delay-500' : 'opacity-100'}`}>
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 text-sm">UI/UX Designer for SaaS Dashboard</h3>
                      <span className="bg-accent-100 text-accent-700 px-2 py-1 rounded-full text-xs font-medium">92 Score</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">Seeking talented designer for modern SaaS dashboard redesign. Long-term project.</p>
                    <div className="flex items-center gap-2">
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">UI/UX</span>
                      <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs">Long-term</span>
                      <span className="text-xs text-gray-500">5 min ago</span>
                    </div>
                  </div>

                  <div className={`border border-gray-200 rounded-lg p-4 hover:border-primary-300 hover:shadow-md transition-all duration-300 ${isMounted ? 'animate-fade-in-up delay-600' : 'opacity-100'}`}>
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 text-sm">Python Backend Developer Needed</h3>
                      <span className="bg-accent-100 text-accent-700 px-2 py-1 rounded-full text-xs font-medium">88 Score</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">Building API for mobile app. Django/FastAPI experience preferred. Remote OK.</p>
                    <div className="flex items-center gap-2">
                      <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full text-xs">Python</span>
                      <span className="bg-pink-100 text-pink-700 px-2 py-1 rounded-full text-xs">Remote</span>
                      <span className="text-xs text-gray-500">8 min ago</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating badge with Animation */}
              <div className={`absolute -top-4 -right-4 bg-white rounded-lg shadow-lg p-4 border border-gray-200 ${isMounted ? 'animate-fade-in-up delay-700' : 'opacity-100'}`}>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-900">15 new opportunities</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

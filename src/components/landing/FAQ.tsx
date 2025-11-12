'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FAQSchema } from '@/components/seo/StructuredData';

/**
 * FAQ Section Component
 * 
 * Accordion-style FAQ with Schema.org markup for SEO
 */
export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'How does ClientHunt find opportunities?',
      answer: 'ClientHunt uses AI to monitor Reddit 24/7 for posts matching your keywords. When someone posts looking for services you offer (like "need a React developer" or "hiring web designer"), our system automatically detects it, scores it based on relevance and quality, and notifies you instantly.',
    },
    {
      question: 'What is a "keyword search"?',
      answer: 'A keyword search is a saved search configuration with specific keywords, patterns, and subreddits you want to monitor. For example, you might create a search for "React developer" that monitors r/forhire and r/hiring. The limit (2, 5, or 10 depending on your plan) refers to how many active searches you can have running at once. You can disable, edit, or delete searches anytime.',
    },
    {
      question: 'How quickly will I get notified?',
      answer: 'Notifications are sent in real-time as soon as a matching opportunity is found. You\'ll receive email notifications within minutes of the post being made on Reddit. SMS notifications are coming soon for Professional and Power plans.',
    },
    {
      question: 'Can I try it before paying?',
      answer: 'Yes! All plans include a 1-month free trial. No credit card required. You can explore all features and see real opportunities before deciding to subscribe.',
    },
    {
      question: 'What platforms do you monitor?',
      answer: 'Currently, we monitor Reddit (subreddits like r/forhire, r/hiring, r/freelance, and others). We\'re actively working on adding LinkedIn, Twitter, and other platforms. All existing customers will get access to new platforms at no extra cost.',
    },
    {
      question: 'How is this different from manually checking Reddit?',
      answer: 'Manual checking is time-consuming and you often miss opportunities posted while you\'re not online. ClientHunt monitors Reddit 24/7, scores opportunities by relevance, filters out spam, and notifies you instantly. You can focus on your work while we handle the searching.',
    },
    {
      question: 'Can I cancel anytime?',
      answer: 'Yes, you can cancel your subscription at any time. There are no contracts or commitments. If you cancel, you\'ll retain access until the end of your current billing period.',
    },
    {
      question: 'Do you share opportunities with other users?',
      answer: 'No. Your opportunities are completely private. Even if multiple users are monitoring the same keywords, each user gets their own private copy of opportunities. We never share your data or opportunities with anyone.',
    },
    {
      question: 'What if I reach my monthly opportunity limit?',
      answer: 'If you reach your monthly limit, you won\'t receive new opportunities until the next billing cycle or you can upgrade to a higher plan. Your existing opportunities remain accessible, and your keyword searches continue running.',
    },
    {
      question: 'Can I change my plan later?',
      answer: 'Yes! You can upgrade or downgrade your plan at any time. When upgrading, you\'ll get immediate access to new features. When downgrading, changes take effect at the start of your next billing cycle.',
    },
  ];

  return (
    <section id="faq" className="py-12 lg:py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to know about ClientHunt
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              {/* Question Button */}
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                aria-expanded={openIndex === index}
              >
                <span className="text-lg font-semibold text-gray-900 pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Answer */}
              {openIndex === index && (
                <div className="px-6 pb-6">
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Still Have Questions CTA */}
        <div className="mt-12 text-center p-8 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Still have questions?
          </h3>
          <p className="text-gray-600 mb-4">
            We're here to help! Reach out to our support team.
          </p>
          <a
            href="mailto:support@clienthunt.app"
            className="btn-primary inline-block"
          >
            Contact Support
          </a>
        </div>
      </div>

      {/* FAQ Schema for SEO */}
      <FAQSchema faqs={faqs} />
    </section>
  );
}

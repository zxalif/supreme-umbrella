import Link from 'next/link';
import { HelpCircle, ArrowRight } from 'lucide-react';

export default function FAQPage() {
  const faqs = [
    {
      category: 'Getting Started',
      questions: [
        {
          q: 'How do I create an account?',
          a: 'Click "Start Free Trial" on the homepage, enter your email and password, then verify your email address. You\'ll get a 1-month free trial with full access to all features.',
        },
        {
          q: 'Do I need a credit card for the free trial?',
          a: 'No! The free trial requires no credit card. You can explore all features for a full month before deciding to subscribe.',
        },
        {
          q: 'How long does it take to set up?',
          a: 'Setting up takes just a few minutes. Create your account, verify your email, create your first keyword search, and start generating opportunities.',
        },
      ],
    },
    {
      category: 'Keyword Searches',
      questions: [
        {
          q: 'How many keyword searches can I create?',
          a: 'This depends on your plan. Starter plans typically allow 3-5 searches, while professional plans allow 10-20. Check your plan details in the subscription page.',
        },
        {
          q: 'What keywords should I use?',
          a: 'Use specific skill names (e.g., "React developer" not just "developer"), include variations and synonyms, and add industry terms like "freelance" or "remote". Start with 3-5 keywords per search.',
        },
        {
          q: 'Can I edit or delete keyword searches?',
          a: 'Yes! You can edit keywords and subreddits anytime, or delete searches you no longer need. Editing takes effect on the next opportunity generation.',
        },
        {
          q: 'How do I know which subreddits to monitor?',
          a: 'Use our auto-complete suggestions which show popular subreddits. Common ones include r/forhire, r/DesignJobs, r/HireAWriter, r/Jobs4Bitcoins, and many more. You can also add custom subreddits.',
        },
      ],
    },
    {
      category: 'Opportunities',
      questions: [
        {
          q: 'How often does ClientHunt check Reddit?',
          a: 'ClientHunt monitors Reddit 24/7 and checks for new posts continuously. When you generate opportunities, the system scans recent posts matching your keywords.',
        },
        {
          q: 'How long does it take to generate opportunities?',
          a: 'Typically 2-5 minutes, depending on how many keyword searches and subreddits you\'re monitoring. You\'ll see real-time progress and time estimates.',
        },
        {
          q: 'What is the relevance score?',
          a: 'The relevance score is an AI-powered rating (0-100) that indicates how well an opportunity matches your keywords. Higher scores mean better matches.',
        },
        {
          q: 'Can I export opportunities?',
          a: 'Yes! You can export opportunities to CSV format. Apply any filters you want, then click "Export CSV" to download all visible opportunities.',
        },
        {
          q: 'What do the different statuses mean?',
          a: 'New (default), Interested (considering), Applied (you\'ve applied), Won (successful), Lost (didn\'t work out). Update statuses to track your pipeline.',
        },
      ],
    },
    {
      category: 'Notifications',
      questions: [
        {
          q: 'How do I enable email notifications?',
          a: 'Go to Settings → Notifications, toggle email notifications on, and choose your preferred frequency (instant, daily digest, or weekly digest).',
        },
        {
          q: 'I\'m not receiving email notifications. What should I do?',
          a: 'Check your spam folder, verify your email address in settings, ensure notifications are enabled, and confirm you have active keyword searches.',
        },
        {
          q: 'Can I get notifications for specific searches only?',
          a: 'Yes! In notification settings, you can choose which keyword searches should trigger notifications. This helps reduce noise from less important searches.',
        },
      ],
    },
    {
      category: 'Plans & Billing',
      questions: [
        {
          q: 'What happens if I exceed my plan limits?',
          a: 'You\'ll be notified when approaching or exceeding limits. You can upgrade your plan, disable some searches, or wait until your usage resets.',
        },
        {
          q: 'Can I cancel my subscription anytime?',
          a: 'Yes! Cancel anytime from your account settings. Your subscription remains active until the end of your current billing period.',
        },
        {
          q: 'Do you offer refunds?',
          a: 'We offer a 30-day money-back guarantee. If you\'re not satisfied, contact support within 30 days of your first paid subscription for a full refund.',
        },
        {
          q: 'What payment methods do you accept?',
          a: 'We accept all major credit cards and PayPal. All payments are processed securely through our payment provider.',
        },
      ],
    },
    {
      category: 'Technical',
      questions: [
        {
          q: 'Is my data secure?',
          a: 'Yes! We use industry-standard encryption, secure authentication, and never share or sell your data. See our Security page for more details.',
        },
        {
          q: 'Do you respect Reddit\'s terms of service?',
          a: 'Absolutely. We follow Reddit\'s API guidelines and terms of service. We only collect publicly available data and implement rate limiting to be respectful.',
        },
        {
          q: 'Can I use ClientHunt on mobile?',
          a: 'Yes! ClientHunt is fully responsive and works on mobile browsers. We\'re also working on native mobile apps.',
        },
        {
          q: 'What browsers are supported?',
          a: 'ClientHunt works on all modern browsers including Chrome, Firefox, Safari, and Edge. We recommend using the latest version for best performance.',
        },
      ],
    },
  ];

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
        <HelpCircle className="w-10 h-10 text-blue-600 mr-3" />
        Frequently Asked Questions
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        Find answers to common questions about ClientHunt.
      </p>

      {/* FAQ Sections */}
      <div className="space-y-12">
        {faqs.map((category, categoryIndex) => (
          <section key={categoryIndex} className="border-b border-gray-200 pb-8 last:border-b-0">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">{category.category}</h2>
            <div className="space-y-6">
              {category.questions.map((faq, faqIndex) => (
                <div key={faqIndex} className="bg-gray-50 rounded-lg p-5">
                  <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                  <p className="text-gray-700">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Still Have Questions */}
      <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 p-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Still Have Questions?</h2>
        <p className="text-gray-700 mb-6">
          Can't find the answer you're looking for? Our support team is here to help.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/contact"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Contact Support
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
          <Link
            href="/dashboard/support"
            className="inline-flex items-center px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            In-App Support
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>

      {/* Related Documentation */}
      <div className="mt-8 border-t border-gray-200 pt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Related Documentation</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Link
            href="/docs/getting-started"
            className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
          >
            <h3 className="font-semibold text-gray-900 mb-1">Getting Started Guide</h3>
            <p className="text-sm text-gray-600">Learn how to set up your account and create your first search</p>
          </Link>
          <Link
            href="/docs/keyword-searches"
            className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
          >
            <h3 className="font-semibold text-gray-900 mb-1">Keyword Searches</h3>
            <p className="text-sm text-gray-600">Best practices for creating effective keyword searches</p>
          </Link>
        </div>
      </div>
    </div>
  );
}


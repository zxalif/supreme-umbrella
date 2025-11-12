'use client';

import { Check, Sparkles, Zap, Crown } from 'lucide-react';
import Link from 'next/link';

/**
 * Pricing Section Component
 * 
 * Modern pricing cards with Soft Blue design system
 */
export function Pricing() {
  const plans = [
    {
      name: 'Starter',
      price: 19,
      originalPrice: null,
      description: 'Perfect for new freelancers',
      icon: Zap,
      features: [
        '2 concurrent keyword searches',
        '5 searches created per month',
        '50 opportunities per month',
        'Basic AI scoring',
        'Email notifications',
        'CSV export',
        '14-day opportunity history',
        'Reddit monitoring',
        'Mobile-responsive dashboard',
        'Basic analytics'
      ],
      cta: '🚀 Start Free Trial',
      popular: false,
      gradient: 'from-gray-50 to-gray-100',
      borderColor: 'border-gray-200',
      buttonStyle: 'bg-gray-900 hover:bg-gray-800 text-white'
    },
    {
      name: 'Professional',
      price: 39,
      originalPrice: null,
      description: 'Most popular for serious freelancers',
      icon: Sparkles,
      features: [
        '5 concurrent keyword searches',
        '10 searches created per month',
        '200 opportunities per month',
        'Advanced AI scoring + insights',
        'Email notifications',
        'CSV/PDF export',
        '90-day opportunity history',
        'Advanced filtering',
        'Custom date ranges',
        'Saved insights',
        'Analytics dashboard',
        'Budget & location filtering',
        'Priority support (24-48h)',
        'SMS notifications (coming soon)'
      ],
      cta: '✨ Start Free Trial',
      popular: true,
      gradient: 'from-primary-50 to-primary-100',
      borderColor: 'border-primary-300',
      buttonStyle: 'bg-primary-500 hover:bg-primary-600 text-white'
    },
    {
      name: 'Power',
      price: 79,
      originalPrice: null,
      description: 'For power users and agencies',
      icon: Crown,
      features: [
        '10 concurrent keyword searches',
        '20 searches created per month',
        '500 opportunities per month',
        'Premium AI scoring + predictions',
        'Email notifications',
        'Unlimited opportunity history',
        'Advanced filtering',
        'Custom date ranges',
        'Saved insights',
        'Analytics dashboard',
        'Budget & location filtering',
        'CSV/PDF/JSON export',
        'Dedicated support (12-24h)',
        'SMS notifications (coming soon)',
        'Webhook integrations (coming soon)',
        'Full API access (coming soon)'
      ],
      cta: '👑 Start Free Trial',
      popular: false,
      gradient: 'from-secondary-50 to-secondary-100',
      borderColor: 'border-secondary-300',
      buttonStyle: 'bg-secondary-500 hover:bg-secondary-600 text-white'
    },
  ];

  return (
    <section id="pricing" className="py-16 lg:py-24 bg-gradient-to-br from-white via-primary-50/10 to-secondary-50/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-accent-100 text-accent-700 rounded-full text-sm font-medium mb-4">
            💰 Simple, Transparent Pricing
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Choose Your 
            <span className="text-primary-500"> Growth Plan</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Start with a 1-month free trial. No credit card required. Cancel anytime.
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
            <div className="flex items-center">
              <Check className="w-4 h-4 text-accent-500 mr-2" />
              1-month free trial
            </div>
            <div className="flex items-center">
              <Check className="w-4 h-4 text-accent-500 mr-2" />
              No credit card
            </div>
            <div className="flex items-center">
              <Check className="w-4 h-4 text-accent-500 mr-2" />
              Cancel anytime
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <div
                key={index}
                className={`relative bg-gradient-to-br ${plan.gradient} rounded-2xl p-8 border-2 ${plan.borderColor} hover:border-opacity-80 transition-all group ${
                  plan.popular ? 'scale-105 shadow-2xl' : 'hover:scale-105 shadow-lg hover:shadow-xl'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg">
                    ⭐ Most Popular
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <Icon className="w-6 h-6 text-gray-700" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-600 mb-6">
                  {plan.description}
                </p>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-4xl font-bold text-gray-900">
                    ${plan.price}
                  </span>
                  <span className="text-gray-600">/month</span>
                </div>
                {plan.originalPrice && (
                  <div className="text-sm text-accent-600 font-medium">
                    Save ${plan.originalPrice - plan.price}/month
                  </div>
                )}
              </div>

              {/* Features List */}
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <Check className="w-4 h-4 text-accent-500 mr-3 flex-shrink-0 mt-1" />
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Link
                href="/register"
                className={`block w-full text-center py-4 px-6 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl ${plan.buttonStyle}`}
              >
                {plan.cta}
              </Link>
            </div>
            );
          })}
        </div>

        {/* Bottom Note */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-2">
            All plans include access to our Reddit monitoring platform
          </p>
          <p className="text-sm text-gray-500">
            Need a custom plan? <a href="mailto:support@clienthunt.app" className="text-primary-500 hover:text-primary-600 underline">Contact us</a>
          </p>
        </div>
      </div>
    </section>
  );
}

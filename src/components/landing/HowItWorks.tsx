import { UserPlus, Search, Rocket } from 'lucide-react';
import { HowToSchema } from '@/components/seo/StructuredData';

/**
 * How It Works Section Component
 * 
 * Shows the 3-step process to get started
 */
export function HowItWorks() {
  const steps = [
    {
      icon: UserPlus,
      step: '1',
      title: 'Sign Up & Set Keywords',
      description: 'Create your account and add keywords related to your services. For example: "React developer", "web designer", "content writer".',
    },
    {
      icon: Search,
      step: '2',
      title: 'AI Monitors Reddit 24/7',
      description: 'Our AI continuously scans Reddit for posts matching your keywords. It scores each opportunity based on relevance and quality.',
    },
    {
      icon: Rocket,
      step: '3',
      title: 'Get Notified & Apply',
      description: 'Receive instant notifications for new opportunities. Review, respond, and land clients faster than your competition.',
    },
  ];

  return (
    <section id="how-it-works" className="py-12 lg:py-16 bg-gradient-to-br from-white via-indigo-50/20 to-purple-50/20">
      {/* HowTo Schema for SEO */}
      <HowToSchema
        name="How to Get Started with ClientHunt"
        description="Learn how to find freelance opportunities on Reddit using ClientHunt in 3 simple steps"
        steps={steps.map(step => ({
          name: step.title,
          text: step.description,
        }))}
        totalTime="PT5M"
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get started in minutes and start finding opportunities today
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative">
                {/* Connector Line (desktop only) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-16 left-1/2 w-full h-0.5 bg-gray-200 -z-10">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-gray-200 rounded-full"></div>
                  </div>
                )}

                {/* Step Card */}
                <div className="text-center">
                  {/* Icon Circle */}
                  <div className="relative inline-flex items-center justify-center w-32 h-32 mb-6">
                    {/* Step Number Background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${
                      index === 0 ? 'from-blue-400 to-cyan-400' :
                      index === 1 ? 'from-purple-400 to-pink-400' :
                      'from-green-400 to-emerald-400'
                    } rounded-full opacity-20`}></div>
                    
                    {/* Icon */}
                    <div className={`relative z-10 w-16 h-16 bg-gradient-to-br ${
                      index === 0 ? 'from-blue-500 to-cyan-500' :
                      index === 1 ? 'from-purple-500 to-pink-500' :
                      'from-green-500 to-emerald-500'
                    } rounded-full flex items-center justify-center shadow-lg`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    {/* Step Number Badge */}
                    <div className="absolute -top-2 -right-2 w-10 h-10 bg-white border-4 border-primary-500 rounded-full flex items-center justify-center">
                      <span className="text-primary-500 font-bold text-lg">{step.step}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-4 text-lg">
            Simple, automated, and effective
          </p>
          <a
            href="/register"
            className="btn-primary text-lg px-8 py-4 inline-block"
          >
            Get Started Now
          </a>
        </div>
      </div>
    </section>
  );
}

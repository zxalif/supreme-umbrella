import { Search, Zap, Target, Bell, TrendingUp, Shield, Clock, Brain, Sparkles } from 'lucide-react';

/**
 * Features Section Component
 * 
 * Modern Bento grid layout with Soft Blue design system
 */
export function Features() {
  const mainFeatures = [
    {
      icon: Brain,
      title: 'AI-Powered Lead Discovery',
      description: 'Advanced AI scans Reddit 24/7, finding high-quality freelance opportunities that match your exact skills and preferences.',
      highlight: 'Most Popular',
      gradient: 'from-primary-500 to-primary-600',
      bgGradient: 'from-primary-50 to-primary-100',
      size: 'large'
    },
    {
      icon: Zap,
      title: 'Instant Notifications',
      description: 'Get notified the moment a perfect opportunity appears. Never miss out on great clients again.',
      gradient: 'from-secondary-500 to-secondary-600', 
      bgGradient: 'from-secondary-50 to-secondary-100',
      size: 'medium'
    },
    {
      icon: Target,
      title: 'Smart Scoring System',
      description: 'Each lead gets an AI relevance score. Focus your time on the highest-quality opportunities first.',
      gradient: 'from-accent-500 to-accent-600',
      bgGradient: 'from-accent-50 to-accent-100', 
      size: 'medium'
    }
  ];

  const supportingFeatures = [
    {
      icon: TrendingUp,
      title: 'Analytics Dashboard',
      description: 'Track success rates and trends',
      gradient: 'from-warning-500 to-warning-600'
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Your data stays private & secure',
      gradient: 'from-gray-500 to-gray-600'
    },
    {
      icon: Clock,
      title: '24/7 Monitoring',
      description: 'Works while you sleep',
      gradient: 'from-primary-500 to-secondary-500'
    },
    {
      icon: Sparkles,
      title: 'Smart Filters',
      description: 'Customize your lead criteria',
      gradient: 'from-accent-500 to-primary-500'
    }
  ];

  return (
    <section id="features" className="py-16 lg:py-24 bg-gradient-to-br from-white via-primary-50/20 to-secondary-50/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-4">
            ⚡ Powerful Features
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Stop Missing Great 
            <span className="text-primary-500"> Opportunities</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            AI-powered lead generation that works 24/7 so you can focus on what you do best
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          {/* Main Feature - Large Card */}
          <div className="lg:col-span-2 lg:row-span-2 bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-8 border border-primary-200 hover:border-primary-300 transition-all group">
            <div className="flex items-start justify-between mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <span className="bg-primary-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                Most Popular
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              AI-Powered Lead Discovery
            </h3>
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              Advanced AI scans Reddit 24/7, finding high-quality freelance opportunities that match your exact skills and preferences.
            </p>
            <div className="flex items-center text-primary-600 font-medium">
              <span>Learn more</span>
              <Target className="w-4 h-4 ml-2" />
            </div>
          </div>

          {/* Secondary Features */}
          <div className="lg:col-span-2 bg-gradient-to-br from-secondary-50 to-secondary-100 rounded-2xl p-6 border border-secondary-200 hover:border-secondary-300 transition-all group">
            <div className="w-10 h-10 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Instant Notifications
            </h3>
            <p className="text-gray-700">
              Get notified the moment a perfect opportunity appears. Never miss out on great clients again.
            </p>
          </div>

          <div className="lg:col-span-2 bg-gradient-to-br from-accent-50 to-accent-100 rounded-2xl p-6 border border-accent-200 hover:border-accent-300 transition-all group">
            <div className="w-10 h-10 bg-gradient-to-br from-accent-500 to-accent-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Target className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Smart Scoring System
            </h3>
            <p className="text-gray-700">
              Each lead gets an AI relevance score. Focus your time on the highest-quality opportunities first.
            </p>
          </div>
        </div>

        {/* Supporting Features - Smaller Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {supportingFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl p-6 border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all group"
              >
                <div className={`w-10 h-10 bg-gradient-to-br ${feature.gradient} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

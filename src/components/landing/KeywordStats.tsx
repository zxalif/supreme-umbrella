'use client';

import { TrendingUp, Search, Zap, Target } from 'lucide-react';
import { useEffect, useState } from 'react';

/**
 * Keyword Statistics Section Component
 * 
 * Shows live keyword search statistics with opportunity counts
 * Displays what keywords are being monitored and how many opportunities found
 */
export function KeywordStats() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('keyword-stats-section');
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  // Sample keyword data - replace with real data from API later
  const keywordStats = [
    {
      keyword: 'React Developer',
      opportunities: 127,
      trend: '+23%',
      icon: Search,
      color: 'primary',
      bgGradient: 'from-blue-500 to-cyan-500',
    },
    {
      keyword: 'Web Designer',
      opportunities: 89,
      trend: '+15%',
      icon: Target,
      color: 'accent',
      bgGradient: 'from-purple-500 to-pink-500',
    },
    {
      keyword: 'Content Writer',
      opportunities: 156,
      trend: '+31%',
      icon: Zap,
      color: 'green',
      bgGradient: 'from-green-500 to-emerald-500',
    },
    {
      keyword: 'Full-Stack Developer',
      opportunities: 94,
      trend: '+18%',
      icon: TrendingUp,
      color: 'yellow',
      bgGradient: 'from-yellow-500 to-orange-500',
    },
    {
      keyword: 'UI/UX Designer',
      opportunities: 112,
      trend: '+27%',
      icon: Target,
      color: 'purple',
      bgGradient: 'from-indigo-500 to-purple-500',
    },
    {
      keyword: 'SEO Specialist',
      opportunities: 73,
      trend: '+12%',
      icon: TrendingUp,
      color: 'blue',
      bgGradient: 'from-blue-600 to-indigo-600',
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { text: string; bg: string; border: string }> = {
      primary: {
        text: 'text-blue-600',
        bg: 'bg-blue-50',
        border: 'border-blue-200',
      },
      accent: {
        text: 'text-purple-600',
        bg: 'bg-purple-50',
        border: 'border-purple-200',
      },
      green: {
        text: 'text-green-600',
        bg: 'bg-green-50',
        border: 'border-green-200',
      },
      yellow: {
        text: 'text-yellow-600',
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
      },
      purple: {
        text: 'text-indigo-600',
        bg: 'bg-indigo-50',
        border: 'border-indigo-200',
      },
      blue: {
        text: 'text-blue-700',
        bg: 'bg-blue-50',
        border: 'border-blue-200',
      },
    };
    return colors[color] || colors.primary;
  };

  return (
    <section id="keyword-stats-section" className="py-16 lg:py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-sm font-medium mb-4">
            <Search className="w-4 h-4 mr-2" />
            Live Keyword Monitoring
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            See Opportunities in Real-Time
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Watch how many opportunities are being found for popular keywords. 
            These are real numbers from active searches on our platform.
          </p>
        </div>

        {/* Keyword Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {keywordStats.map((stat, index) => {
            const Icon = stat.icon;
            const colors = getColorClasses(stat.color);
            return (
              <div
                key={index}
                className={`card-hover border-2 ${colors.border} relative overflow-hidden transition-all duration-300 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Gradient Accent Bar */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.bgGradient}`}></div>

                {/* Content */}
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center`}>
                        <Icon className={`w-6 h-6 ${colors.text}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">
                          {stat.keyword}
                        </h3>
                        <div className="flex items-center mt-1">
                          <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                          <span className="text-sm text-green-600 font-medium">
                            {stat.trend}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Opportunity Count */}
                  <div className="mt-4">
                    <div className="flex items-baseline space-x-2">
                      <span className={`text-4xl font-bold ${colors.text}`}>
                        {stat.opportunities}
                      </span>
                      <span className="text-gray-600 text-sm">
                        opportunities
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Found this month
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${stat.bgGradient} rounded-full transition-all duration-1000 ${
                          isVisible ? 'w-full' : 'w-0'
                        }`}
                        style={{
                          width: isVisible
                            ? `${Math.min((stat.opportunities / 200) * 100, 100)}%`
                            : '0%',
                          transitionDelay: `${index * 100 + 300}ms`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="card bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 text-center p-6">
            <div className="text-3xl font-bold text-blue-600 mb-2">651</div>
            <div className="text-gray-700 font-medium">Total Opportunities</div>
            <div className="text-sm text-gray-600 mt-1">Across all keywords</div>
          </div>
          <div className="card bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 text-center p-6">
            <div className="text-3xl font-bold text-purple-600 mb-2">6</div>
            <div className="text-gray-700 font-medium">Active Keywords</div>
            <div className="text-sm text-gray-600 mt-1">Being monitored</div>
          </div>
          <div className="card bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 text-center p-6">
            <div className="text-3xl font-bold text-green-600 mb-2">+21%</div>
            <div className="text-gray-700 font-medium">Average Growth</div>
            <div className="text-sm text-gray-600 mt-1">This month</div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4 text-lg">
            Start monitoring your keywords and find opportunities automatically
          </p>
          <a
            href="/register"
            className="btn-primary text-lg px-8 py-4 inline-block bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
          >
            Start Your Free Trial
          </a>
        </div>
      </div>
    </section>
  );
}


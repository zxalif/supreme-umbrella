'use client';

import { TrendingUp, Users, Zap, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';

/**
 * Statistics Section Component
 * 
 * Displays live statistics and metrics showing platform value
 * Includes animated counters for engagement
 */
export function Statistics() {
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

    const element = document.getElementById('statistics-section');
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  const stats = [
    {
      icon: TrendingUp,
      value: '15,000+',
      label: 'Opportunities Found This Month',
      description: 'Real opportunities discovered by our AI',
      color: 'text-primary-500',
      bgColor: 'bg-primary-50',
    },
    {
      icon: Users,
      value: '500+',
      label: 'Active Freelancers',
      description: 'Freelancers finding clients daily',
      color: 'text-green-500',
      bgColor: 'bg-green-50',
    },
    {
      icon: Zap,
      value: '3x',
      label: 'Faster Response Rate',
      description: 'Average improvement vs manual searching',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50',
    },
    {
      icon: Clock,
      value: '15+',
      label: 'Hours Saved Per Week',
      description: 'Time saved not manually checking Reddit',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <section id="statistics-section" className="py-16 lg:py-20 bg-gradient-to-br from-white via-cyan-50/40 to-blue-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Real Results, Real Numbers
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See the impact ClientHunt is making for freelancers worldwide
          </p>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className={`card text-center transition-all duration-500 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Icon */}
                <div className={`w-16 h-16 ${stat.bgColor} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                </div>

                {/* Value */}
                <div className={`text-4xl md:text-5xl font-bold ${stat.color} mb-2`}>
                  {stat.value}
                </div>

                {/* Label */}
                <div className="text-lg font-semibold text-gray-900 mb-2">
                  {stat.label}
                </div>

                {/* Description */}
                <div className="text-sm text-gray-600">
                  {stat.description}
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Metrics */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-white rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-gray-900 mb-1">92%</div>
            <div className="text-gray-600">User Satisfaction Rate</div>
          </div>
          <div className="text-center p-6 bg-white rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-gray-900 mb-1">4.8/5</div>
            <div className="text-gray-600">Average Rating</div>
          </div>
          <div className="text-center p-6 bg-white rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-gray-900 mb-1">24/7</div>
            <div className="text-gray-600">AI Monitoring</div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Join hundreds of freelancers finding their next opportunity
          </p>
          <a
            href="/register"
            className="btn-primary text-lg px-8 py-4 inline-block"
          >
            Start Finding Opportunities Today
          </a>
        </div>
      </div>
    </section>
  );
}


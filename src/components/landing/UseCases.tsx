import { Code, PenTool, FileText, Briefcase, Camera, BarChart } from 'lucide-react';
import Link from 'next/link';

/**
 * Use Cases Section Component
 * 
 * Shows specific use cases for different types of freelancers
 * Helps visitors see themselves using the product
 */
export function UseCases() {
  const useCases = [
    {
      icon: Code,
      title: 'Developers',
      description: 'Find React, Python, Node.js, and other development opportunities',
      keywords: ['React developer', 'Python developer', 'Full-stack developer'],
      benefits: [
        'Find projects matching your tech stack',
        'Get notified of high-budget projects first',
        'Filter by project complexity and timeline',
      ],
      color: 'primary',
    },
    {
      icon: PenTool,
      title: 'Designers',
      description: 'Discover UI/UX, graphic design, and branding opportunities',
      keywords: ['UI designer', 'Web designer', 'Brand designer'],
      benefits: [
        'Match with clients looking for your style',
        'See portfolio requirements upfront',
        'Connect with design-focused clients',
      ],
      color: 'accent',
    },
    {
      icon: FileText,
      title: 'Writers',
      description: 'Find content writing, copywriting, and editing gigs',
      keywords: ['Content writer', 'Copywriter', 'Blog writer'],
      benefits: [
        'Discover long-term content partnerships',
        'Find clients in your niche',
        'Get notified of urgent deadlines',
      ],
      color: 'green',
    },
    {
      icon: Briefcase,
      title: 'Consultants',
      description: 'Connect with businesses needing strategic advice',
      keywords: ['Business consultant', 'Marketing consultant', 'Strategy consultant'],
      benefits: [
        'Find high-value consulting opportunities',
        'Match with companies in your industry',
        'See project scope and budget upfront',
      ],
      color: 'purple',
    },
    {
      icon: Camera,
      title: 'Creatives',
      description: 'Discover photography, video, and creative project opportunities',
      keywords: ['Photographer', 'Videographer', 'Creative director'],
      benefits: [
        'Find projects matching your creative style',
        'See location and timeline requirements',
        'Connect with creative agencies',
      ],
      color: 'yellow',
    },
    {
      icon: BarChart,
      title: 'Marketers',
      description: 'Find digital marketing, SEO, and growth opportunities',
      keywords: ['SEO specialist', 'Digital marketer', 'Growth hacker'],
      benefits: [
        'Discover performance-based opportunities',
        'Find clients in your marketing niche',
        'See campaign budgets and goals',
      ],
      color: 'blue',
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string }> = {
      primary: {
        bg: 'bg-primary-50',
        text: 'text-primary-600',
        border: 'border-primary-200',
      },
      accent: {
        bg: 'bg-accent-50',
        text: 'text-accent-600',
        border: 'border-accent-200',
      },
      green: {
        bg: 'bg-green-50',
        text: 'text-green-600',
        border: 'border-green-200',
      },
      purple: {
        bg: 'bg-purple-50',
        text: 'text-purple-600',
        border: 'border-purple-200',
      },
      yellow: {
        bg: 'bg-yellow-50',
        text: 'text-yellow-600',
        border: 'border-yellow-200',
      },
      blue: {
        bg: 'bg-blue-50',
        text: 'text-blue-600',
        border: 'border-blue-200',
      },
    };
    return colors[color] || colors.primary;
  };

  return (
    <section className="py-12 lg:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Perfect for Every Type of Freelancer
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Whether you're a developer, designer, writer, or consultant, ClientHunt helps you find the right opportunities
          </p>
        </div>

        {/* Use Cases Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {useCases.map((useCase, index) => {
            const Icon = useCase.icon;
            const colors = getColorClasses(useCase.color);
            return (
              <div
                key={index}
                className={`card-hover border-2 ${colors.border} relative overflow-hidden`}
              >
                {/* Color Accent */}
                <div className={`absolute top-0 left-0 right-0 h-1 ${colors.bg}`}></div>

                {/* Icon */}
                <div className={`w-14 h-14 ${colors.bg} rounded-xl flex items-center justify-center mb-4`}>
                  <Icon className={`w-7 h-7 ${colors.text}`} />
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {useCase.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 mb-4">
                  {useCase.description}
                </p>

                {/* Keywords */}
                <div className="mb-4">
                  <div className="text-sm font-medium text-gray-700 mb-2">
                    Popular Keywords:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {useCase.keywords.map((keyword, i) => (
                      <span
                        key={i}
                        className={`px-3 py-1 ${colors.bg} ${colors.text} rounded-full text-xs font-medium`}
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Benefits */}
                <div className="space-y-2">
                  {useCase.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-start">
                      <div className={`w-1.5 h-1.5 ${colors.text} rounded-full mt-2 mr-2 flex-shrink-0`}></div>
                      <span className="text-sm text-gray-600">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-4 text-lg">
            Don't see your freelancer type? ClientHunt works for everyone!
          </p>
          <Link
            href="/register"
            className="btn-primary text-lg px-8 py-4 inline-block"
          >
            Get Started for Your Niche
          </Link>
        </div>
      </div>
    </section>
  );
}


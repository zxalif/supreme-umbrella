import { Shield, Lock, Award, CheckCircle } from 'lucide-react';

/**
 * Trust Badges Component
 * 
 * Displays security, guarantee, and trust indicators
 * Can be used in footer or as a standalone section
 */
export function TrustBadges() {
  const badges = [
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data is encrypted and never shared',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Lock,
      title: 'GDPR Compliant',
      description: 'We protect your privacy rights',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: Award,
      title: 'Money-Back Guarantee',
      description: '30-day guarantee if not satisfied',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      icon: CheckCircle,
      title: 'No Credit Card Required',
      description: 'Start your free trial today',
      color: 'text-primary-600',
      bgColor: 'bg-primary-50',
    },
  ];

  return (
    <section className="py-8 bg-white border-t border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {badges.map((badge, index) => {
            const Icon = badge.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-center text-center"
              >
                <div className={`w-12 h-12 ${badge.bgColor} rounded-lg flex items-center justify-center mb-3`}>
                  <Icon className={`w-6 h-6 ${badge.color}`} />
                </div>
                <div className="font-semibold text-gray-900 text-sm mb-1">
                  {badge.title}
                </div>
                <div className="text-xs text-gray-600">
                  {badge.description}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}


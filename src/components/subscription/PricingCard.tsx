'use client';

import { Check, Zap, Star, ArrowRight, Info } from 'lucide-react';
import type { SubscriptionPlan } from '@/types/subscription';
import { PRICING_PLANS } from '@/types/subscription';

interface PricingCardProps {
  plan: SubscriptionPlan;
  isPopular?: boolean;
  currentPlan?: SubscriptionPlan | null;
  onSelect: (plan: SubscriptionPlan) => void;
  isLoading?: boolean;
  className?: string;
}

/**
 * Enhanced Pricing Card Component
 * 
 * Modern, responsive pricing card with improved UX and accessibility
 */
export function PricingCard({
  plan,
  isPopular = false,
  currentPlan,
  onSelect,
  isLoading = false,
  className = '',
}: PricingCardProps) {
  const planData = PRICING_PLANS[plan];
  const isCurrentPlan = currentPlan === plan;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!isLoading && !isCurrentPlan) {
        onSelect(plan);
      }
    }
  };

  return (
    <div
      className={`
        relative group cursor-pointer transition-all duration-300 ease-out
        ${isPopular 
          ? 'transform hover:scale-105 lg:scale-105 lg:hover:scale-110' 
          : 'hover:scale-102'
        }
        ${className}
      `}
      onClick={() => !isLoading && !isCurrentPlan && onSelect(plan)}
      onKeyDown={handleKeyDown}
      tabIndex={isCurrentPlan ? -1 : 0}
      role="button"
      aria-label={`Select ${planData.name} plan for $${planData.price} per month`}
    >
      <div
        className={`
          relative bg-white rounded-2xl p-6 sm:p-8 h-full flex flex-col
          transition-all duration-300 ease-out
          ${isPopular
            ? 'border-2 border-blue-500 shadow-xl shadow-blue-500/20'
            : 'border border-gray-200 shadow-lg hover:shadow-xl'
          }
          ${isCurrentPlan 
            ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300' 
            : 'hover:border-gray-300'
          }
          ${!isCurrentPlan && !isLoading ? 'hover:shadow-2xl' : ''}
        `}
      >
        {/* Popular Badge */}
        {isPopular && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
            <div className="relative">
              <span className="px-4 py-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white text-sm font-bold rounded-full shadow-lg flex items-center gap-2">
                <Star className="w-4 h-4 fill-current" />
                Most Popular
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full blur opacity-30 animate-pulse"></div>
            </div>
          </div>
        )}

        {/* Current Plan Badge */}
        {isCurrentPlan && (
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
            <span className="px-3 py-1.5 bg-green-100 text-green-700 text-xs font-bold rounded-full border border-green-200 flex items-center gap-1">
              <Check className="w-3 h-3" />
              Current Plan
            </span>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
            {planData.name}
          </h3>
          <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6 leading-relaxed">
            {planData.description}
          </p>
          
          {/* Pricing */}
          <div className="flex items-baseline justify-center mb-2">
            <span className="text-4xl sm:text-5xl font-bold text-gray-900">
              ${planData.price}
            </span>
            <span className="text-gray-600 ml-2 text-lg">/month</span>
          </div>
          
          {/* Value proposition */}
          {isPopular && (
            <p className="text-sm text-blue-600 font-medium">
              Best value for growing businesses
            </p>
          )}
        </div>

        {/* Features */}
        <div className="flex-1 mb-6 sm:mb-8">
          <ul className="space-y-3 sm:space-y-4">
            {planData.features.map((feature, idx) => (
              <li key={idx} className="flex items-start group/feature">
                <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-green-100 flex items-center justify-center mr-3 sm:mr-4 mt-0.5">
                  <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                </div>
                <span className="text-sm sm:text-base text-gray-700 leading-relaxed group-hover/feature:text-gray-900 transition-colors">
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (!isLoading && !isCurrentPlan) {
              onSelect(plan);
            }
          }}
          disabled={isLoading || isCurrentPlan}
          className={`
            w-full py-3 sm:py-4 px-6 rounded-xl font-semibold text-sm sm:text-base
            transition-all duration-300 ease-out transform
            flex items-center justify-center gap-2 sm:gap-3
            ${isCurrentPlan
              ? 'bg-green-100 text-green-700 cursor-not-allowed border border-green-200'
              : isPopular
              ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95'
              : 'bg-gray-900 hover:bg-gray-800 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95'
            }
            ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}
          `}
        >
          {isCurrentPlan ? (
            <>
              <Check className="w-4 h-4 sm:w-5 sm:h-5" />
              Current Plan
            </>
          ) : isLoading ? (
            <>
              <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Processing...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
              Get Started
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>

        {/* Hover effect overlay */}
        {!isCurrentPlan && (
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        )}
      </div>
    </div>
  );
}


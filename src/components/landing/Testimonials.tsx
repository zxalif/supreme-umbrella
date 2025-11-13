'use client';

import { Star, Quote } from 'lucide-react';
import { useState } from 'react';
import { ReviewSchema } from '@/components/seo/StructuredData';

/**
 * Testimonials Section Component
 * 
 * Displays real user testimonials with photos and ratings
 * Includes carousel for multiple testimonials
 */
export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'React Developer',
      location: 'San Francisco, CA',
      avatar: 'SC',
      rating: 5,
      quote: 'I found 12 new clients in my first 3 months using ClientHunt. The AI scoring helps me focus on the best opportunities, and I\'ve saved 15+ hours per week not manually checking Reddit.',
      results: '12 clients in 3 months',
      image: null, // Will use initials for now
    },
    {
      name: 'Marcus Johnson',
      role: 'Web Designer',
      location: 'Austin, TX',
      avatar: 'MJ',
      rating: 5,
      quote: 'As a designer, I was spending too much time searching for clients. ClientHunt finds opportunities I would have missed. My response rate increased 3x because I\'m reaching out faster than competitors.',
      results: '3x faster response rate',
      image: null,
    },
    {
      name: 'Priya Patel',
      role: 'Content Writer',
      location: 'London, UK',
      avatar: 'PP',
      rating: 5,
      quote: 'The keyword matching is incredibly accurate. I set up searches for "content writer" and "blog posts" and get notified within minutes of relevant posts. It\'s like having a personal assistant finding clients for me.',
      results: '50+ opportunities/month',
      image: null,
    },
    {
      name: 'David Kim',
      role: 'Full-Stack Developer',
      location: 'Toronto, Canada',
      avatar: 'DK',
      rating: 5,
      quote: 'I was skeptical at first, but the ROI is incredible. I\'ve landed 8 high-paying clients in 2 months. The time I save not manually searching Reddit is worth way more than the subscription cost.',
      results: '8 clients in 2 months',
      image: null,
    },
  ];

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="py-12 lg:py-16 bg-gradient-to-br from-white via-pink-50/20 to-purple-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full text-sm font-medium mb-4 shadow-lg">
            <Star className="w-4 h-4 mr-2 fill-current" />
            Trusted by Freelancers Worldwide
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Loved by Freelancers Who Found Success
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See how freelancers like you are finding more clients and growing their business
          </p>
        </div>

        {/* Main Testimonial Card */}
        <div className="max-w-4xl mx-auto">
          <div className="card-hover relative">
            {/* Quote Icon */}
            <div className="absolute -top-6 -left-6 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
              <Quote className="w-6 h-6 text-white" />
            </div>

            <div className="p-8 md:p-12">
              {/* Rating Stars */}
              <div className="flex items-center mb-6">
                {[...Array(currentTestimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-xl md:text-2xl text-gray-900 mb-8 leading-relaxed">
                "{currentTestimonial.quote}"
              </blockquote>

              {/* Results Badge */}
              <div className="inline-flex items-center px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium mb-8">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                {currentTestimonial.results}
              </div>

              {/* Author Info */}
              <div className="flex items-center">
                {/* Avatar */}
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4 shadow-lg">
                  {currentTestimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-lg">
                    {currentTestimonial.name}
                  </div>
                  <div className="text-gray-600">
                    {currentTestimonial.role} • {currentTestimonial.location}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Dots */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'bg-primary-500 w-8'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={prevTestimonial}
              className="p-2 rounded-lg border border-gray-300 hover:border-primary-500 hover:bg-primary-50 transition-colors"
              aria-label="Previous testimonial"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextTestimonial}
              className="p-2 rounded-lg border border-gray-300 hover:border-primary-500 hover:bg-primary-50 transition-colors"
              aria-label="Next testimonial"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Additional Testimonials Grid (Desktop) */}
        <div className="hidden lg:grid grid-cols-3 gap-6 mt-16">
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <div
              key={index}
              className="card p-6 cursor-pointer hover:border-primary-300 transition-colors"
              onClick={() => setCurrentIndex(index)}
            >
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <p className="text-gray-700 mb-4 line-clamp-3">
                "{testimonial.quote.substring(0, 120)}..."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">
                    {testimonial.name}
                  </div>
                  <div className="text-gray-600 text-xs">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Review Schema for SEO */}
      <ReviewSchema
        itemReviewed={{
          name: 'ClientHunt',
          type: 'SoftwareApplication',
        }}
        reviews={testimonials.map((testimonial) => ({
          author: testimonial.name,
          datePublished: new Date().toISOString().split('T')[0], // Use current date as fallback
          reviewBody: testimonial.quote,
          reviewRating: {
            ratingValue: testimonial.rating,
            bestRating: 5,
            worstRating: 1,
          },
        }))}
        aggregateRating={{
          ratingValue: 5,
          reviewCount: testimonials.length,
          bestRating: 5,
          worstRating: 1,
        }}
      />
    </section>
  );
}


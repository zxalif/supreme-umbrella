'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { register, ApiClientError } from '@/lib/api/auth';
import { useAuthStore } from '@/store/authStore';
import { extractErrorMessage, extractFieldErrors } from '@/lib/utils/error-handler';
import { track } from '@/components/providers/AnalyticsProvider';
import { Eye, EyeOff, Mail, User, Lock, ArrowRight, CheckCircle, MailCheck } from 'lucide-react';

/**
 * Registration Page
 * 
 * User registration with email, name, and password
 * Redirects to dashboard if already logged in
 */
export default function RegisterPage() {
  const router = useRouter();
  const { isAuthenticated, fetchUser } = useAuthStore();
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    password: '',
    confirmPassword: '',
    consentDataProcessing: false,
    consentMarketing: false,
    consentCookies: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check if user is already authenticated and redirect
  useEffect(() => {
    const checkAuth = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      if (token) {
        try {
          await fetchUser();
          // Small delay to ensure state is updated
          setTimeout(() => {
            const { isAuthenticated: authState } = useAuthStore.getState();
            if (authState) {
              router.push('/dashboard');
              return;
            }
            setIsCheckingAuth(false);
          }, 100);
        } catch (error) {
          // Not authenticated, continue with registration page
          setIsCheckingAuth(false);
        }
      } else {
        setIsCheckingAuth(false);
      }
    };
    checkAuth();
  }, [fetchUser, router]);

  // Show loading state while checking auth
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-primary-50/30 to-secondary-50/20 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Name validation
    if (!formData.full_name) {
      newErrors.full_name = 'Full name is required';
    } else if (formData.full_name.length < 2) {
      newErrors.full_name = 'Name must be at least 2 characters';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Consent validation (required for GDPR/CCPA compliance)
    if (!formData.consentDataProcessing) {
      newErrors.consentDataProcessing = 'You must agree to data processing to create an account';
    }
    if (!formData.consentCookies) {
      newErrors.consentCookies = 'You must accept cookie usage to use our service';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Register user (verification email is sent automatically)
      await register({
        email: formData.email,
        full_name: formData.full_name,
        password: formData.password,
        consent_data_processing: formData.consentDataProcessing,
        consent_marketing: formData.consentMarketing,
        consent_cookies: formData.consentCookies,
      });
      
      // Track successful registration (signup tracking is done in authStore)
      track.trialStart(); // Track trial start on registration
      setSuccess(true);
    } catch (error) {
      if (error instanceof ApiClientError) {
        if (error.data.errors) {
          // Field-specific errors - extract string messages from objects
          setErrors(extractFieldErrors(error.data.errors));
        } else {
          setErrors({ general: extractErrorMessage(error, 'Registration failed') });
        }
      } else {
        setErrors({ general: 'An unexpected error occurred' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-primary-50/30 to-secondary-50/20 flex items-center justify-center px-4">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-100/20 to-secondary-100/20"></div>
        </div>

        <div className="relative max-w-md w-full">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <MailCheck className="w-8 h-8 text-primary-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Check Your Email! 📧
            </h2>
            <p className="text-gray-600 mb-4">
              We've sent a verification email to <strong>{formData.email}</strong>
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-left">
              <p className="text-sm text-blue-800 mb-2">
                <strong>Next steps:</strong>
              </p>
              <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                <li>Check your inbox (and spam folder)</li>
                <li>Click the verification link in the email</li>
                <li>Return here to log in</li>
              </ol>
            </div>
            <p className="text-xs text-gray-500 mb-6">
              Didn't receive the email? Check your spam folder or{' '}
              <button
                onClick={() => setSuccess(false)}
                className="text-primary-600 hover:text-primary-700 font-medium underline"
              >
                try registering again
              </button>
            </p>
            <Link
              href="/login"
              className="inline-flex items-center justify-center w-full bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white py-3 px-6 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
            >
              Go to Login
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-primary-50/30 to-secondary-50/20 flex items-center justify-center px-4 py-12">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-100/20 to-secondary-100/20"></div>
      </div>

      <div className="relative max-w-md w-full">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6 group">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              ClientHunt
            </span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Join ClientHunt! 🚀
          </h1>
          <p className="text-gray-600">
            Start finding amazing opportunities in minutes
          </p>
        </div>

        {/* Form Card */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* General Error */}
            {errors.general && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{errors.general}</p>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="form-label flex items-center">
                <Mail className="w-4 h-4 mr-2 text-gray-500" />
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`input ${errors.email ? 'input-error' : ''}`}
                placeholder="you@example.com"
                required
              />
              {errors.email && (
                <p className="form-error">{errors.email}</p>
              )}
            </div>

            {/* Full Name Field */}
            <div>
              <label htmlFor="full_name" className="form-label flex items-center">
                <User className="w-4 h-4 mr-2 text-gray-500" />
                Full Name
              </label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                className={`input ${errors.full_name ? 'input-error' : ''}`}
                placeholder="John Doe"
                required
              />
              {errors.full_name && (
                <p className="form-error">{errors.full_name}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="form-label flex items-center">
                <Lock className="w-4 h-4 mr-2 text-gray-500" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`input pr-10 ${errors.password ? 'input-error' : ''}`}
                  placeholder="At least 8 characters"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="form-error">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="form-label flex items-center">
                <Lock className="w-4 h-4 mr-2 text-gray-500" />
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`input pr-10 ${errors.confirmPassword ? 'input-error' : ''}`}
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label="Toggle password visibility"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="form-error">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Consent Checkboxes */}
            <div className="space-y-4 pt-2">
              {/* Required: Data Processing Consent */}
              <div>
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="consentDataProcessing"
                    checked={formData.consentDataProcessing}
                    onChange={(e) => {
                      setFormData((prev) => ({ ...prev, consentDataProcessing: e.target.checked }));
                      if (errors.consentDataProcessing) {
                        setErrors((prev) => ({ ...prev, consentDataProcessing: '' }));
                      }
                    }}
                    className="mt-1 w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    required
                  />
                  <span className="text-sm text-gray-700">
                    I consent to the collection and processing of my personal data as described in the{' '}
                    <Link href="/privacy" className="text-blue-600 hover:underline" target="_blank">
                      Privacy Policy
                    </Link>
                    {' '}*
                  </span>
                </label>
                {errors.consentDataProcessing && (
                  <p className="form-error mt-1">{errors.consentDataProcessing}</p>
                )}
              </div>

              {/* Required: Cookie Consent */}
              <div>
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="consentCookies"
                    checked={formData.consentCookies}
                    onChange={(e) => {
                      setFormData((prev) => ({ ...prev, consentCookies: e.target.checked }));
                      if (errors.consentCookies) {
                        setErrors((prev) => ({ ...prev, consentCookies: '' }));
                      }
                    }}
                    className="mt-1 w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    required
                  />
                  <span className="text-sm text-gray-700">
                    I accept the use of cookies and tracking technologies as described in the{' '}
                    <Link href="/cookies" className="text-blue-600 hover:underline" target="_blank">
                      Cookie Policy
                    </Link>
                    {' '}*
                  </span>
                </label>
                {errors.consentCookies && (
                  <p className="form-error mt-1">{errors.consentCookies}</p>
                )}
              </div>

              {/* Optional: Marketing Email Consent */}
              <div>
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="consentMarketing"
                    checked={formData.consentMarketing}
                    onChange={(e) => {
                      setFormData((prev) => ({ ...prev, consentMarketing: e.target.checked }));
                    }}
                    className="mt-1 w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">
                    I would like to receive marketing emails about new features, tips, and special offers (optional)
                  </span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center group"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
                Sign in
              </Link>
            </p>
            <p className="text-xs text-gray-500">
              By creating an account, you also agree to our{' '}
              <Link href="/terms" className="text-blue-600 hover:underline" target="_blank">
                Terms of Service
              </Link>
              . You can withdraw your consent at any time by contacting{' '}
              <a href="mailto:privacy@clienthunt.app" className="text-blue-600 hover:underline">
                privacy@clienthunt.app
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


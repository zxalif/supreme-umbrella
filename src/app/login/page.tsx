'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { login, resendVerificationEmail, ApiClientError } from '@/lib/api/auth';
import { extractErrorMessage } from '@/lib/api/client';
import { useAuthStore } from '@/store/authStore';
import { showToast } from '@/components/ui/Toast';
import { Eye, EyeOff, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';

/**
 * Login Page
 * 
 * User authentication with email and password
 * Redirects to dashboard if already logged in
 */
export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, fetchUser } = useAuthStore();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [showResendVerification, setShowResendVerification] = useState(false);
  const [isResending, setIsResending] = useState(false);

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
          // Not authenticated, continue with login page
          setIsCheckingAuth(false);
        }
      } else {
        setIsCheckingAuth(false);
      }
    };
    checkAuth();
  }, [fetchUser, router]);

  // Check for verified query param
  useEffect(() => {
    const verified = new URLSearchParams(window.location.search).get('verified');
    if (verified === 'true') {
      showToast.success('Email verified!', 'You can now sign in to your account.');
    }
  }, []);

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

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
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
      await login({
        email: formData.email,
        password: formData.password,
      });

      // Fetch user to update auth store
      await fetchUser();
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      if (error instanceof ApiClientError) {
        if (error.status === 401) {
          showToast.error('Invalid email or password', 'Please check your credentials and try again.');
        } else if (error.status === 403) {
          const errorMessage = extractErrorMessage(error.data, 'Your account is not active. Please contact support.');
          if (errorMessage.toLowerCase().includes('email not verified') || errorMessage.toLowerCase().includes('verify')) {
            showToast.error('Email Not Verified', errorMessage);
            setShowResendVerification(true);
          } else {
            showToast.error('Account Issue', errorMessage);
          }
        } else {
          showToast.error('Login Failed', extractErrorMessage(error.data, 'An error occurred during login. Please try again.'));
        }
      } else {
        showToast.error('Login Failed', 'An unexpected error occurred. Please try again.');
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
    if (errors.general) {
      setErrors((prev) => ({ ...prev, general: '' }));
      setShowResendVerification(false);
    }
  };

  const handleResendVerification = async () => {
    // Validate email is present
    const emailToUse = formData.email?.trim();
    if (!emailToUse) {
      showToast.error('Email Required', 'Please enter your email address in the email field above, then click "Resend verification email" again.');
      // Focus on email input
      const emailInput = document.getElementById('email') as HTMLInputElement;
      if (emailInput) {
        emailInput.focus();
      }
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailToUse)) {
      showToast.error('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    setIsResending(true);
    setShowResendVerification(false);
    
    try {
      await resendVerificationEmail({ email: emailToUse });
      showToast.success('Verification Email Sent', 'Please check your email and click the verification link.');
    } catch (error) {
      if (error instanceof ApiClientError) {
        const errorMessage = extractErrorMessage(error.data, 'Failed to resend verification email');
        // If it's a validation error about email field, show helpful message
        if (errorMessage.toLowerCase().includes('email') && errorMessage.toLowerCase().includes('required')) {
          showToast.error('Email Required', 'Please enter your email address in the email field above, then try again.');
        } else {
          showToast.error('Failed to Resend Email', errorMessage);
        }
        // Show resend button again if error
        setShowResendVerification(true);
      } else {
        showToast.error('Failed to Resend Email', 'An unexpected error occurred. Please try again.');
        setShowResendVerification(true);
      }
    } finally {
      setIsResending(false);
    }
  };

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
            Welcome Back! 👋
          </h1>
          <p className="text-gray-600">
            Sign in to continue finding amazing opportunities
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Resend Verification Button (shown when email not verified) */}
            {showResendVerification && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-blue-800 font-medium mb-2">Email verification required</p>
                    <button
                      type="button"
                      onClick={handleResendVerification}
                      disabled={isResending || !formData.email?.trim()}
                      className="text-sm text-primary-600 hover:text-primary-700 font-medium underline disabled:opacity-50 disabled:cursor-not-allowed"
                      title={!formData.email?.trim() ? 'Please enter your email address first' : ''}
                    >
                      {isResending ? 'Sending...' : 'Resend verification email'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-gray-500" />
                  Email Address
                </div>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border transition-all outline-none ${
                  errors.email 
                    ? 'border-error-300 focus:border-error-500 focus:ring-2 focus:ring-error-500 focus:ring-opacity-20' 
                    : 'border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-opacity-20'
                }`}
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
              {errors.email && (
                <p className="mt-2 text-sm text-error-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  <div className="flex items-center">
                    <Lock className="w-4 h-4 mr-2 text-gray-500" />
                    Password
                  </div>
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 pr-12 rounded-xl border transition-all outline-none ${
                    errors.password 
                      ? 'border-error-300 focus:border-error-500 focus:ring-2 focus:ring-error-500 focus:ring-opacity-20' 
                      : 'border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-opacity-20'
                  }`}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary-600 transition-colors"
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
                <p className="mt-2 text-sm text-error-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 px-6 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl disabled:cursor-not-allowed flex items-center justify-center group"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Signing in...
                </>
              ) : (
                <>
                  🚀 Sign In
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link href="/register" className="text-primary-600 hover:text-primary-700 font-semibold transition-colors">
                Sign up for free →
              </Link>
            </p>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-accent-500 rounded-full mr-2 animate-pulse"></div>
              Secure & encrypted
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              7-day free trial
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


'use client';

import { useState } from 'react';
import { Save, AlertCircle, CheckCircle, Bell, BellOff, Mail, MailCheck } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { apiPut } from '@/lib/api/client';
import { resendVerificationEmailAuthenticated } from '@/lib/api/auth';
import { showToast } from '@/components/ui/Toast';
import type { User } from '@/lib/api/auth';

interface ProfileFormProps {
  user: User;
  onSuccess?: () => void;
}

/**
 * Profile Form Component
 * 
 * Form for editing user profile (name, email, notification preferences)
 */
export function ProfileForm({ user, onSuccess }: ProfileFormProps) {
  const { fetchUser } = useAuthStore();
  const [formData, setFormData] = useState({
    full_name: user.full_name || '',
    email_notifications_enabled: user.email_notifications_enabled ?? true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isResendingVerification, setIsResendingVerification] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      // Update profile via API
      await apiPut<User>('/api/v1/users/me', formData);
      
      // Refresh user data
      await fetchUser();
      
      setSuccess('Profile updated successfully!');
      
      // Call success callback
      if (onSuccess) {
        onSuccess();
      }
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      const errorMessage = err?.data?.detail || 'Failed to update profile';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasChanges = 
    formData.full_name !== user.full_name ||
    formData.email_notifications_enabled !== (user.email_notifications_enabled ?? true);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Success Message */}
      {success && (
        <div className="card bg-green-50 border-green-200">
          <div className="flex items-start">
            <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-green-800 mb-1">Success</h3>
              <p className="text-sm text-green-600">{success}</p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="card bg-red-50 border-red-200">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-red-800 mb-1">Error</h3>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Full Name */}
      <div>
        <label htmlFor="full_name" className="form-label">
          Full Name
        </label>
        <input
          type="text"
          id="full_name"
          value={formData.full_name}
          onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
          className="input"
          placeholder="Enter your full name"
          required
        />
      </div>

      {/* Email (Read-only) */}
      <div>
        <label htmlFor="email" className="form-label">
          Email Address
        </label>
        <div className="relative">
          <input
            type="email"
            id="email"
            value={user.email}
            className="input bg-gray-50 cursor-not-allowed pr-10"
            disabled
            readOnly
          />
          {user.is_verified ? (
            <MailCheck className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600" />
          ) : (
            <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          )}
        </div>
        {user.is_verified ? (
          <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
            <MailCheck className="w-3 h-3" />
            Email verified
          </p>
        ) : (
          <div className="mt-2">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-yellow-800 mb-1">
                    Email not verified
                  </p>
                  <p className="text-xs text-yellow-700">
                    Please verify your email address to access all features. Check your inbox for the verification email.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={async () => {
                  setIsResendingVerification(true);
                  try {
                    await resendVerificationEmailAuthenticated();
                    showToast.success('Verification Email Sent', 'Please check your email and click the verification link.');
                    // Refresh user data to update verification status if they verify quickly
                    await fetchUser();
                  } catch (err: any) {
                    const errorMessage = err?.data?.detail || 'Failed to resend verification email';
                    showToast.error('Failed to Resend Email', errorMessage);
                  } finally {
                    setIsResendingVerification(false);
                  }
                }}
                disabled={isResendingVerification}
                className="mt-3 text-sm text-yellow-800 hover:text-yellow-900 font-medium underline disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isResendingVerification ? (
                  <>
                    <div className="w-4 h-4 border-2 border-yellow-800 border-t-transparent rounded-full animate-spin"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    Resend Verification Email
                  </>
                )}
              </button>
            </div>
          </div>
        )}
        <p className="text-xs text-gray-500 mt-1">
          Email address cannot be changed. Contact support if you need to update your email.
        </p>
      </div>

      {/* Email Notifications Toggle */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <label htmlFor="email_notifications" className="form-label flex items-center gap-2">
              {formData.email_notifications_enabled ? (
                <Bell className="w-5 h-5 text-blue-600" />
              ) : (
                <BellOff className="w-5 h-5 text-gray-400" />
              )}
              Email Notifications
            </label>
            <p className="text-sm text-gray-600 mt-1">
              Receive email notifications when new leads are found matching your keyword searches.
            </p>
            <p className="text-xs text-gray-500 mt-1">
              You'll receive emails every 6 hours when new opportunities are discovered.
            </p>
          </div>
          <div className="ml-4">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, email_notifications_enabled: !formData.email_notifications_enabled })}
              className={`
                relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                ${formData.email_notifications_enabled ? 'bg-blue-600' : 'bg-gray-200'}
              `}
              role="switch"
              aria-checked={formData.email_notifications_enabled}
              aria-labelledby="email_notifications"
            >
              <span
                className={`
                  pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
                  ${formData.email_notifications_enabled ? 'translate-x-5' : 'translate-x-0'}
                `}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-end space-x-3">
        <button
          type="submit"
          disabled={!hasChanges || isSubmitting}
          className="btn-primary inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </button>
      </div>
    </form>
  );
}


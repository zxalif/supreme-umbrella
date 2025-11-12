'use client';

import { useState } from 'react';
import { Save, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { apiPut } from '@/lib/api/client';
import type { User } from '@/lib/api/auth';

interface ProfileFormProps {
  user: User;
  onSuccess?: () => void;
}

/**
 * Profile Form Component
 * 
 * Form for editing user profile (name, email)
 */
export function ProfileForm({ user, onSuccess }: ProfileFormProps) {
  const { fetchUser } = useAuthStore();
  const [formData, setFormData] = useState({
    full_name: user.full_name || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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

  const hasChanges = formData.full_name !== user.full_name;

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
        <input
          type="email"
          id="email"
          value={user.email}
          className="input bg-gray-50 cursor-not-allowed"
          disabled
          readOnly
        />
        <p className="text-xs text-gray-500 mt-1">
          Email address cannot be changed. Contact support if you need to update your email.
        </p>
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


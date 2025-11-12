'use client';

import { useState } from 'react';
import { Save, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { apiPost } from '@/lib/api/client';

interface PasswordFormProps {
  onSuccess?: () => void;
}

/**
 * Password Form Component
 * 
 * Form for changing user password
 * 
 * Note: Backend endpoint may need to be created:
 * POST /api/v1/auth/change-password
 * Body: { current_password, new_password }
 */
export function PasswordForm({ onSuccess }: PasswordFormProps) {
  const [formData, setFormData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    // Validation
    if (formData.new_password !== formData.confirm_password) {
      setError('New passwords do not match');
      setIsSubmitting(false);
      return;
    }

    if (formData.new_password.length < 8) {
      setError('New password must be at least 8 characters long');
      setIsSubmitting(false);
      return;
    }

    try {
      // TODO: Update endpoint when backend is ready
      // For now, this will fail gracefully
      await apiPost('/api/v1/auth/change-password', {
        current_password: formData.current_password,
        new_password: formData.new_password,
      });
      
      setSuccess('Password changed successfully!');
      
      // Reset form
      setFormData({
        current_password: '',
        new_password: '',
        confirm_password: '',
      });
      
      // Call success callback
      if (onSuccess) {
        onSuccess();
      }
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      const errorMessage = err?.data?.detail || 'Failed to change password. Please check your current password.';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPasswordStrength = (password: string): { strength: string; color: string } => {
    if (password.length === 0) return { strength: '', color: '' };
    if (password.length < 8) return { strength: 'Weak', color: 'text-red-600' };
    if (password.length < 12) return { strength: 'Medium', color: 'text-yellow-600' };
    if (/[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) {
      return { strength: 'Strong', color: 'text-green-600' };
    }
    return { strength: 'Medium', color: 'text-yellow-600' };
  };

  const passwordStrength = getPasswordStrength(formData.new_password);

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

      {/* Current Password */}
      <div>
        <label htmlFor="current_password" className="form-label">
          Current Password
        </label>
        <div className="relative">
          <input
            type={showPasswords.current ? 'text' : 'password'}
            id="current_password"
            value={formData.current_password}
            onChange={(e) => setFormData({ ...formData, current_password: e.target.value })}
            className="input pr-10"
            placeholder="Enter your current password"
            required
          />
          <button
            type="button"
            onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPasswords.current ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* New Password */}
      <div>
        <label htmlFor="new_password" className="form-label">
          New Password
        </label>
        <div className="relative">
          <input
            type={showPasswords.new ? 'text' : 'password'}
            id="new_password"
            value={formData.new_password}
            onChange={(e) => setFormData({ ...formData, new_password: e.target.value })}
            className="input pr-10"
            placeholder="Enter your new password"
            required
            minLength={8}
          />
          <button
            type="button"
            onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPasswords.new ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
        {formData.new_password && (
          <p className={`text-xs mt-1 ${passwordStrength.color}`}>
            Password strength: <span className="font-medium">{passwordStrength.strength}</span>
          </p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          Must be at least 8 characters long. Use a mix of letters, numbers, and symbols for better security.
        </p>
      </div>

      {/* Confirm Password */}
      <div>
        <label htmlFor="confirm_password" className="form-label">
          Confirm New Password
        </label>
        <div className="relative">
          <input
            type={showPasswords.confirm ? 'text' : 'password'}
            id="confirm_password"
            value={formData.confirm_password}
            onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
            className="input pr-10"
            placeholder="Confirm your new password"
            required
            minLength={8}
          />
          <button
            type="button"
            onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPasswords.confirm ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
        {formData.confirm_password && formData.new_password !== formData.confirm_password && (
          <p className="text-xs text-red-600 mt-1">Passwords do not match</p>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-end space-x-3">
        <button
          type="submit"
          disabled={isSubmitting || !formData.current_password || !formData.new_password || !formData.confirm_password}
          className="btn-primary inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Changing Password...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Change Password
            </>
          )}
        </button>
      </div>
    </form>
  );
}


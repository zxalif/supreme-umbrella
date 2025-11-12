'use client';

import { PasswordForm } from '@/components/settings/PasswordForm';

/**
 * Settings Password Page
 * 
 * Change user password
 */
export default function PasswordSettingsPage() {
  return (
    <div className="card max-w-2xl">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Change Password</h2>
        <p className="text-sm text-gray-600">
          Update your password to keep your account secure. Use a strong password with at least 8 characters.
        </p>
      </div>

      <PasswordForm />
    </div>
  );
}


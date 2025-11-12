'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { ProfileForm } from '@/components/settings/ProfileForm';
import type { User } from '@/lib/api/auth';

/**
 * Settings Profile Page
 * 
 * Edit user profile information
 */
export default function ProfileSettingsPage() {
  const { user, fetchUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (!user) {
        await fetchUser();
      }
      setIsLoading(false);
    };
    loadUser();
  }, [user, fetchUser]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="card bg-red-50 border-red-200">
        <p className="text-red-600">Failed to load user profile. Please try refreshing the page.</p>
      </div>
    );
  }

  return (
    <div className="card max-w-2xl">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Profile Information</h2>
        <p className="text-sm text-gray-600">
          Update your personal information. Changes will be reflected across your account.
        </p>
      </div>

      <ProfileForm user={user} />
    </div>
  );
}


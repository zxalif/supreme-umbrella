'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Settings Page - Redirects to Profile
 * 
 * This page redirects to the profile settings by default
 */
export default function SettingsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard/settings/profile');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to settings...</p>
      </div>
    </div>
  );
}

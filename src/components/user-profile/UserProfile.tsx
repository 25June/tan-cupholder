'use client';

import { useSession } from '@/hooks/useSession';
import { signOut } from 'next-auth/react';

/**
 * UserProfile component demonstrating useSession hook usage
 * Shows user information and provides sign out functionality
 */
export const UserProfile = () => {
  const { user, isAuthenticated, isLoading } = useSession();

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <span className="ml-2 text-gray-600">Loading...</span>
      </div>
    );
  }

  // Show sign in prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="text-center p-4">
        <p className="text-gray-600 mb-4">
          Please sign in to view your profile
        </p>
        <a
          href="/admin"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Sign In
        </a>
      </div>
    );
  }

  // Show user profile information
  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-md mx-auto">
      <div className="text-center">
        <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
          <span className="text-2xl font-bold text-gray-600">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </span>
        </div>

        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          {user?.name || 'User'}
        </h2>

        <p className="text-gray-600 mb-4">{user?.email}</p>

        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

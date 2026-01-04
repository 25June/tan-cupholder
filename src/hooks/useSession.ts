'use client';

import { data } from 'motion/react-client';
import { useSession as useNextAuthSession } from 'next-auth/react';

/**
 * Custom hook to get user session data in client components
 * @returns {Object} Session data including user information and loading state
 */
export const useSession = () => {
  const { data: session, status } = useNextAuthSession();

  return {
    user: session?.user || null,
    isAuthenticated: !!session?.user,
    isLoading: status === 'loading',
    session
  };
};

import { auth } from '@/auth';
import { NextRequest } from 'next/server';

export interface AuthValidationResult {
  isValid: boolean;
  user?: {
    id: string;
    email: string;
    name: string;
  };
  error?: string;
}

/**
 * Validates authentication token and user email in API routes
 * @param request - NextRequest object from API route
 * @param requiredEmail - Optional specific email to validate against
 * @returns Promise<AuthValidationResult>
 */
export const validateAuth = async (
  requiredEmail?: string
): Promise<AuthValidationResult> => {
  try {
    // Get session from NextAuth
    const session = await auth();

    // Check if user is authenticated
    if (!session?.user) {
      return {
        isValid: false,
        error: 'No valid session found'
      };
    }

    // Validate user data
    if (!session.user.email) {
      return {
        isValid: false,
        error: 'Invalid user data in session'
      };
    }

    // Check specific email if provided
    if (requiredEmail && session.user.email !== requiredEmail) {
      return {
        isValid: false,
        error: `Access denied. Required email: ${requiredEmail}`
      };
    }

    return {
      isValid: true,
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name || 'Unknown'
      }
    };
  } catch (error) {
    console.error('Auth validation error:', error);
    return {
      isValid: false,
      error: 'Authentication validation failed'
    };
  }
};

export const requireAuth = async (requiredEmail?: string) => {
  const result = await validateAuth(requiredEmail);

  if (!result.isValid) {
    throw new Error(result.error || 'Authentication required');
  }

  return result.user!;
};

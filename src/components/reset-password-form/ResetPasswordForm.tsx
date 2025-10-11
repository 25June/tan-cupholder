'use client';

import { lusitana } from '@/app/admin/ui/fonts';
import {
  KeyIcon,
  ExclamationCircleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from '@/app/admin/ui/button';
import { useActionState } from 'react';
import {
  resetUserPassword,
  PasswordResetState
} from '@/app/admin/lib/actions/user-credential.actions';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ResetPasswordFormProps {
  userId: string;
  userEmail: string;
}

export default function ResetPasswordForm({
  userId,
  userEmail
}: ResetPasswordFormProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState<
    PasswordResetState,
    FormData
  >(resetUserPassword, { message: null });

  // Navigate to login page on successful password reset
  useEffect(() => {
    if (state.success) {
      setTimeout(() => {
        router.push('/admin');
      }, 2000);
    }
  }, [state.success, router]);

  return (
    <form
      onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        formAction(formData);
      }}
      className="space-y-3"
    >
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className={`${lusitana.className} mb-3 text-2xl`}>
          Reset Your Password
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          Reset password for: <span className="font-medium">{userEmail}</span>
        </p>

        <div className="w-full">
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="password"
            >
              New Password
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="password"
                type="password"
                name="password"
                placeholder="Enter new password"
                required
                minLength={8}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            {state.errors?.password && (
              <p className="text-red-500 text-xs mt-1">
                {state.errors.password[0]}
              </p>
            )}
          </div>

          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="confirmPassword"
            >
              Confirm New Password
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                placeholder="Confirm new password"
                required
                minLength={8}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            {state.errors?.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {state.errors.confirmPassword[0]}
              </p>
            )}
          </div>
        </div>

        {/* Password requirements */}
        <div className="mt-4 p-3 bg-blue-50 rounded-md">
          <p className="text-xs font-medium text-blue-900 mb-2">
            Password Requirements:
          </p>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>• At least 8 characters long</li>
            <li>• At least 1 uppercase letter</li>
            <li>• At least 1 lowercase letter</li>
            <li>• At least 1 number</li>
            <li>• At least 1 special character</li>
          </ul>
        </div>

        <input type="hidden" name="userId" value={userId} />

        <Button className="mt-4 w-full" aria-disabled={isPending}>
          {isPending ? 'Resetting...' : 'Reset Password'}
          <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
        </Button>

        <div
          className="flex h-8 items-end space-x-1"
          aria-live="polite"
          aria-atomic="true"
        >
          {state.message && !state.success && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{state.message}</p>
            </>
          )}
          {state.success && (
            <>
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
              <p className="text-sm text-green-500">{state.message}</p>
            </>
          )}
        </div>

        {state.success && (
          <div className="mt-4 p-3 bg-green-50 rounded-md">
            <p className="text-sm text-green-800">
              Password reset successfully! Redirecting to login page...
            </p>
          </div>
        )}
      </div>
    </form>
  );
}

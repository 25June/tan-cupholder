'use client';

import { useState } from 'react';
import { updateUser, State } from '@/app/admin/lib/actions/user.actions';
import { UserInfo } from '@/models/user';
import { UserStatus, USER_ROLE_LABEL } from '@/constants/user';
import { useRouter } from 'next/navigation';
import { formatUserData } from '@/shared/utils/user.utils';

const initialState: State = { message: null, errors: {} };

export default function UpdateUserForm({ user }: { user: UserInfo }) {
  const [state, setState] = useState<State>(initialState);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleFormSubmit = async (formData: FormData) => {
    formData.set('id', user.id);
    setIsLoading(true);
    const newData = formatUserData(formData);
    return updateUser(initialState, newData)
      .then((res: any) => {
        if (res.message) {
          setState({
            message: res.message,
            errors: res.errors
          });
        } else if (res.id) {
          router.push('/admin/dashboard/users');
        }
      })
      .catch((error) => {
        setState({
          message: error.message,
          errors: error.errors
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <form action={handleFormSubmit} className="space-y-6">
      <div className="p-4 md:p-6">
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          {/* First Name */}
          <fieldset className="fieldset">
            <legend className="fieldset-legend">First Name</legend>
            <input
              type="text"
              name="firstName"
              className="input w-full"
              placeholder="First Name"
              defaultValue={user.firstName}
            />
            <div id="firstName-error" aria-live="polite" aria-atomic="true">
              {state.errors?.firstName &&
                state.errors.firstName.map((error: string) => (
                  <p className="text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </fieldset>

          {/* Last Name */}
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Last Name</legend>
            <input
              type="text"
              name="lastName"
              className="input w-full"
              placeholder="Last Name"
              defaultValue={user.lastName}
            />
            <div id="lastName-error" aria-live="polite" aria-atomic="true">
              {state.errors?.lastName &&
                state.errors.lastName.map((error: string) => (
                  <p className="text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </fieldset>

          {/* Email */}
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Email</legend>
            <input
              type="email"
              name="email"
              className="input w-full"
              placeholder="Email"
              defaultValue={user.email}
              disabled
            />
            <div id="email-error" aria-live="polite" aria-atomic="true">
              {state.errors?.email &&
                state.errors.email.map((error: string) => (
                  <p className="text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
            <p className="text-xs font-bold text-gray-700">
              Email can not be changed once set.
            </p>
          </fieldset>

          {/* Role */}
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Role</legend>
            <select
              id="role"
              name="role"
              className="select w-full"
              aria-describedby="role-error"
              defaultValue={user.role}
            >
              <option value="" disabled>
                Select a role
              </option>
              {Object.values(USER_ROLE_LABEL).map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
            <div id="role-error" aria-live="polite" aria-atomic="true">
              {state.errors?.role &&
                state.errors.role.map((error: string) => (
                  <p className="text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </fieldset>

          {/* Status */}
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Status</legend>
            <select
              id="status"
              name="status"
              className="select w-full"
              aria-describedby="status-error"
              defaultValue={user.status}
            >
              <option value="" disabled>
                Select a status
              </option>
              {Object.values(UserStatus).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <div id="status-error" aria-live="polite" aria-atomic="true">
              {state.errors?.status &&
                state.errors.status.map((error: string) => (
                  <p className="text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </fieldset>
        </div>

        {state.message && (
          <div className="text-red-500 text-sm mt-4">{state.message}</div>
        )}

        <div className="mt-6 flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex h-10 items-center rounded-lg bg-logo-orange-border px-4 text-sm font-medium text-white transition-colors hover:bg-logo-orange-border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-logo-orange-border disabled:opacity-50"
          >
            {isLoading ? 'Updating...' : 'Update User'}
          </button>
        </div>
      </div>
    </form>
  );
}

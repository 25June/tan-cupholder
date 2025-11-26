'use client';

import { useEffect, useState, useRef } from 'react';
import {
  updateUser,
  State,
  fetchUserById
} from '@/app/admin/lib/actions/user.actions';
import { UserInfo } from '@/models/user';
import { onCloseModal } from '@/shared/utils/modal.utils';
import { MODAL_ID } from '@/constants/modal.const';
import { UserStatus, USER_ROLE_LABEL } from '@/constants/user';
import { formatUserData } from '@/shared/utils/user.utils';

const initialState: State = { message: null, errors: {} };

export default function EditUserModal({ userId }: { userId: string | null }) {
  const [state, setState] = useState<State>(initialState);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(userId);
  const modalRef = useRef<HTMLDialogElement | null>(null);
  const prevOpenRef = useRef<boolean>(false);

  useEffect(() => {
    const modal = document.getElementById(
      MODAL_ID.UPDATE_USER
    ) as HTMLDialogElement;
    modalRef.current = modal;
    if (!modal) return;

    const handleClose = () => {
      setUser(null);
      setCurrentUserId(null);
      setState(initialState);
    };

    modal.addEventListener('close', handleClose);
    return () => {
      modal.removeEventListener('close', handleClose);
    };
  }, []);

  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;

    const checkModalState = () => {
      const isOpen = modal.open;
      const id = modal.getAttribute('data-user-id');

      if (isOpen && !prevOpenRef.current && id) {
        setCurrentUserId(id);
      }

      prevOpenRef.current = isOpen;
    };

    const interval = setInterval(checkModalState, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      const idToLoad = userId || currentUserId;
      if (!idToLoad) return;

      try {
        const userData = await fetchUserById(idToLoad);
        setUser(userData);
      } catch (error) {
        console.error('Failed to load user data:', error);
      }
    };
    loadData();
  }, [userId, currentUserId]);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    const formData = new FormData(e.currentTarget);
    formData.set('id', user.id);
    setIsLoading(true);
    const newData = formatUserData(formData);
    return updateUser(initialState, newData)
      .then((res: any) => {
        if (res.errors) {
          setState({
            message: res.message,
            errors: res.errors
          });
          setIsLoading(false);
          return;
        }
        onCloseModal(MODAL_ID.UPDATE_USER);
        setState(initialState);
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

  const handleClose = () => {
    onCloseModal(MODAL_ID.UPDATE_USER);
    setState(initialState);
    setUser(null);
  };

  if (!user) {
    return (
      <dialog id={MODAL_ID.UPDATE_USER} className="modal">
        <div className="modal-box max-w-4xl">
          <div className="flex justify-center items-center p-8">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={handleClose}>close</button>
        </form>
      </dialog>
    );
  }

  return (
    <dialog id={MODAL_ID.UPDATE_USER} className="modal">
      <div className="modal-box max-w-4xl">
        <h3 className="font-bold text-lg mb-4">Edit User</h3>
        <form onSubmit={handleFormSubmit} className="space-y-6">
          <div className="p-4 md:p-6">
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
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
                onClick={handleClose}
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
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={handleClose}>close</button>
      </form>
    </dialog>
  );
}

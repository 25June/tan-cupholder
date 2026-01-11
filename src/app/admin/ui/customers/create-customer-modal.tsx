'use client';

import { useState } from 'react';
import {
  createCustomer,
  State
} from '@/app/admin/lib/actions/customers.action';
import { onCloseModal } from '@/shared/utils/modal.utils';
import { MODAL_ID } from '@/constants/modal.const';

const initialState: State = { message: null, errors: {} };

export default function CreateCustomerModal({
  onRefresh
}: {
  onRefresh: () => void;
}) {
  const [state, setState] = useState<State>(initialState);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setIsLoading(true);
    const newFormData = new FormData();
    newFormData.append('name', formData.get('name') as string);
    newFormData.append('email', formData.get('email') as string);
    newFormData.append('phone_number', formData.get('phone_number') as string);
    newFormData.append('address', formData.get('address') as string);
    newFormData.append('image_url', '');
    newFormData.append(
      'is_email_verified',
      formData.get('is_email_verified') as string
    );

    return createCustomer(initialState, newFormData)
      .then((res) => {
        if (res.errors) {
          setState({
            message: res.message,
            errors: res.errors
          });
          setIsLoading(false);
          return;
        }
        handleClose(true);
      })
      .catch((error) => {
        setState({
          message: error.message,
          errors: error.errors
        });
        setIsLoading(false);
      });
  };

  const handleClose = (refresh?: boolean) => {
    onCloseModal(MODAL_ID.ADD_CUSTOMER);
    setState(initialState);
    if (refresh) {
      onRefresh();
    }
  };

  return (
    <dialog id={MODAL_ID.ADD_CUSTOMER} className="modal">
      <div className="modal-box max-w-4xl">
        <h3 className="font-bold text-lg mb-4">Create Customer</h3>
        <form onSubmit={handleFormSubmit}>
          <div className="form-control w-full max-w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-4 w-full">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Name</legend>
                  <input
                    type="text"
                    name="name"
                    className="input w-full"
                    placeholder="Customer Name"
                  />
                  <div id="name-error" aria-live="polite" aria-atomic="true">
                    {state.errors?.name &&
                      state.errors.name.map((error: string) => (
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
                    placeholder="customer@example.com"
                  />
                  <div id="email-error" aria-live="polite" aria-atomic="true">
                    {state.errors?.email &&
                      state.errors.email.map((error: string) => (
                        <p className="text-sm text-red-500" key={error}>
                          {error}
                        </p>
                      ))}
                  </div>
                </fieldset>

                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Phone Number</legend>
                  <input
                    type="tel"
                    name="phone_number"
                    className="input w-full"
                    placeholder="+1234567890"
                  />
                  <div
                    id="phone_number-error"
                    aria-live="polite"
                    aria-atomic="true"
                  >
                    {state.errors?.phone_number &&
                      state.errors.phone_number.map((error: string) => (
                        <p className="text-sm text-red-500" key={error}>
                          {error}
                        </p>
                      ))}
                  </div>
                </fieldset>

                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Address</legend>
                  <textarea
                    name="address"
                    className="textarea h-24 w-full"
                    placeholder="Customer Address"
                  />
                  <div id="address-error" aria-live="polite" aria-atomic="true">
                    {state.errors?.address &&
                      state.errors.address.map((error: string) => (
                        <p className="text-sm text-red-500" key={error}>
                          {error}
                        </p>
                      ))}
                  </div>
                </fieldset>

                {/* <fieldset className="fieldset">
                  <legend className="fieldset-legend">Image URL</legend>
                  <input
                    type="url"
                    name="image_url"
                    className="input w-full"
                    placeholder="https://example.com/image.jpg"
                  />
                </fieldset> */}

                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Email Verified</legend>
                  <select
                    name="is_email_verified"
                    className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    defaultValue="false"
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </fieldset>
              </div>

              <div className="text-sm text-muted-foreground">
                <div className="mt-4 mb-4 w-full h-full rounded-md min-h-24">
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gray-200 rounded-md max-h-48 max-w-48 p-4">
                    <p className="text-sm text-gray-500">
                      Customer Information
                    </p>
                    <p className="text-xs text-gray-400 text-center mt-2">
                      Enter the customer's details including name, email, phone
                      number, and address.
                      <br />
                      The email verification status can be set here.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={() => handleClose()}
                className="btn btn-ghost max-w-40 w-full"
              >
                Cancel
              </button>

              <button type="submit" className="btn btn-primary grow-1">
                {isLoading && <span className="loading loading-spinner"></span>}{' '}
                Add Customer
              </button>
            </div>
          </div>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={() => handleClose()}>close</button>
      </form>
    </dialog>
  );
}

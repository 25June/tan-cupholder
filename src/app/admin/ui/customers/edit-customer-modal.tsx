'use client';

import { useEffect, useState } from 'react';
import {
  updateCustomer,
  State,
  fetchCustomerById
} from '@/app/admin/lib/actions/customers.action';
import { Customer } from '@/models/customer';
import { onCloseModal } from '@/shared/utils/modal.utils';
import { MODAL_ID } from '@/constants/modal.const';
import Image from 'next/image';

const initialState: State = { message: null, errors: {} };

export default function EditCustomerModal({
  customerId,
  onRefresh
}: {
  customerId: string | null;
  onRefresh: () => void;
}) {
  const [state, setState] = useState<State>(initialState);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [customer, setCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!customerId) {
        setCustomer(null);
        setState(initialState);
        return;
      }

      try {
        const customerData = await fetchCustomerById(customerId);
        setCustomer(customerData);
      } catch (error) {
        console.error('Failed to load customer data:', error);
      }
    };

    loadData();
  }, [customerId]);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!customer) return;

    const formData = new FormData(e.currentTarget);
    formData.set('id', customer.id);
    setIsLoading(true);
    return updateCustomer(initialState, formData)
      .then((res: any) => {
        if (res.errors) {
          setState({
            message: res.message,
            errors: res.errors
          });
          setIsLoading(false);
          return;
        }
        handleClose();
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
    onCloseModal(MODAL_ID.UPDATE_CUSTOMER);
    setState(initialState);
    setCustomer(null);
    onRefresh();
  };

  return (
    <dialog id={MODAL_ID.UPDATE_CUSTOMER} className="modal">
      <div className="modal-box max-w-4xl">
        <h3 className="font-bold text-lg mb-4">Edit Customer</h3>
        {!customer ? (
          <div className="flex justify-center items-center p-8">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <form onSubmit={handleFormSubmit}>
            <div className="form-control w-full max-w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-2">
                <div className="flex flex-col gap-4 w-full">
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">Name</legend>
                    <input
                      type="text"
                      name="name"
                      className="input w-full"
                      placeholder="Customer Name"
                      defaultValue={customer.name}
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
                      defaultValue={customer.email}
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
                      defaultValue={customer.phone_number || ''}
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
                      defaultValue={customer.address || ''}
                    />
                    <div
                      id="address-error"
                      aria-live="polite"
                      aria-atomic="true"
                    >
                      {state.errors?.address &&
                        state.errors.address.map((error: string) => (
                          <p className="text-sm text-red-500" key={error}>
                            {error}
                          </p>
                        ))}
                    </div>
                  </fieldset>

                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">Image URL</legend>
                    <input
                      type="url"
                      name="image_url"
                      className="input w-full"
                      placeholder="https://example.com/image.jpg"
                      defaultValue={customer.image_url || ''}
                    />
                  </fieldset>

                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">Email Verified</legend>
                    <select
                      name="is_email_verified"
                      className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                      defaultValue={
                        customer.is_email_verified ? 'true' : 'false'
                      }
                    >
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </fieldset>
                </div>

                <div>
                  <p className="text-sm font-bold mb-2">Customer Information</p>
                  <div className="w-full h-full rounded-md max-h-48 mb-4">
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-200 rounded-md max-h-48 p-4">
                      <p className="text-sm text-gray-500">Current Details</p>
                      <div className="text-xs text-gray-400 text-center mt-2">
                        <p>
                          <strong>Name:</strong> {customer.name}
                        </p>
                        <p>
                          <strong>Email:</strong> {customer.email}
                        </p>
                        <p>
                          <strong>Phone:</strong>{' '}
                          {customer.phone_number || 'N/A'}
                        </p>
                        <p>
                          <strong>Verified:</strong>{' '}
                          {customer.is_email_verified ? 'Yes' : 'No'}
                        </p>
                      </div>
                    </div>
                  </div>
                  {customer.image_url && (
                    <div>
                      <p className="text-sm font-bold mb-2">Profile Image</p>
                      <div className="w-full h-full rounded-md max-h-48 mb-4">
                        <Image
                          src={customer.image_url}
                          alt="Customer Profile"
                          width={200}
                          height={200}
                          className="object-cover w-full h-full rounded-md"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="btn btn-ghost max-w-40 w-full"
                >
                  Cancel
                </button>

                <button type="submit" className="btn btn-primary grow-1">
                  {isLoading && (
                    <span className="loading loading-spinner"></span>
                  )}
                  Update Customer
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={handleClose}>close</button>
      </form>
    </dialog>
  );
}

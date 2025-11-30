'use client';

import { useState } from 'react';
import {
  createProductType,
  State
} from '@/app/admin/lib/actions/product-types.actions';
import { onCloseModal } from '@/shared/utils/modal.utils';
import { MODAL_ID } from '@/constants/modal.const';

const initialState: State = { message: null, errors: {} };

export default function CreateProductTypeModal({
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
    newFormData.append('shortName', formData.get('shortName') as string);
    newFormData.append('description', formData.get('description') as string);

    return createProductType(initialState, newFormData)
      .then((res) => {
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
        setIsLoading(false);
      });
  };

  const handleClose = () => {
    onCloseModal(MODAL_ID.ADD_PRODUCT_TYPE);
    setState(initialState);
    onRefresh();
  };

  return (
    <dialog id={MODAL_ID.ADD_PRODUCT_TYPE} className="modal">
      <div className="modal-box max-w-2xl">
        <h3 className="font-bold text-lg mb-4">Create Product Type</h3>
        <form onSubmit={handleFormSubmit}>
          <div className="form-control w-full max-w-full">
            <div className="flex flex-col md:flex-row gap-4 w-full">
              <fieldset className="fieldset w-full">
                <legend className="fieldset-legend">Name</legend>
                <input
                  type="text"
                  name="name"
                  className="input w-full"
                  placeholder="Product Type Name"
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

              <fieldset className="fieldset w-full">
                <legend className="fieldset-legend">Short Name</legend>
                <input
                  type="text"
                  name="shortName"
                  className="input w-full"
                  placeholder="Short Name (e.g., CUP, GLASS)"
                />
                <div id="shortName-error" aria-live="polite" aria-atomic="true">
                  {state.errors?.shortName &&
                    state.errors.shortName.map((error: string) => (
                      <p className="text-sm text-red-500" key={error}>
                        {error}
                      </p>
                    ))}
                </div>
              </fieldset>
            </div>
            <div className="flex flex-col md:flex-row gap-4 w-full">
              <fieldset className="fieldset w-full">
                <legend className="fieldset-legend">Description</legend>
                <textarea
                  name="description"
                  className="textarea h-24 w-full"
                  placeholder="Product Type Description"
                />
                <div
                  id="description-error"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  {state.errors?.description &&
                    state.errors.description.map((error: string) => (
                      <p className="text-sm text-red-500" key={error}>
                        {error}
                      </p>
                    ))}
                </div>
              </fieldset>
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
                {isLoading && <span className="loading loading-spinner"></span>}{' '}
                Add Product Type
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

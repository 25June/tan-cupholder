'use client';

import { useState } from 'react';
import {
  updateProductType,
  State
} from '@/app/admin/lib/actions/product-types.actions';
import { ProductType } from '@/models/productType';
import Link from 'next/link';

const initialState: State = { message: null, errors: {} };

export default function UpdateProductTypeForm({
  productType
}: {
  productType: ProductType;
}) {
  const [state, setState] = useState<State>(initialState);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleFormSubmit = async (formData: FormData) => {
    formData.set('id', productType.id);
    formData.set('description', formData.get('description') as string);
    setIsLoading(true);
    return updateProductType(initialState, formData)
      .then((res: any) => {
        if (res.message) {
          setState({
            message: res.message,
            errors: res.errors
          });
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
    <form action={handleFormSubmit}>
      <div className="form-control w-full max-w-full">
        <div className="flex flex-col md:flex-row gap-4 w-full">
          <fieldset className="fieldset w-full">
            <legend className="fieldset-legend">Name</legend>
            <input
              type="text"
              name="name"
              className="input w-full"
              placeholder="Product Type Name"
              defaultValue={productType.name}
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
              defaultValue={productType.short_name}
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
              defaultValue={productType.description || ''}
            />
            <div id="description-error" aria-live="polite" aria-atomic="true">
              {state.errors?.description &&
                state.errors.description.map((error: string) => (
                  <p className="text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </fieldset>
        </div>

        <div className="flex justify-end gap-2">
          <Link
            href="/admin/dashboard/product-types"
            className="btn btn-ghost max-w-40 w-full"
          >
            Cancel
          </Link>

          <button type="submit" className="btn btn-primary grow-1">
            {isLoading && <span className="loading loading-spinner"></span>}
            Update Product Type
          </button>
        </div>
      </div>
    </form>
  );
}

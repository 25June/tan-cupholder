'use client';

import { useState } from 'react';
import {
  updateProductTag,
  State
} from '@/app/admin/lib/actions/product-tags.actions';
import { ProductTag } from '@/models/productTag';
import Link from 'next/link';

const initialState: State = { message: null, errors: {} };

export default function UpdateProductTagForm({
  productTag
}: {
  productTag: ProductTag;
}) {
  const [state, setState] = useState<State>(initialState);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set('id', productTag.id);
    formData.set('description', formData.get('description') as string);
    setIsLoading(true);
    return updateProductTag(initialState, formData)
      .then((res: any) => {
        if (res?.message) {
          setState({ message: res.message, errors: res.errors });
        }
      })
      .catch((error) => {
        setState({ message: error.message, errors: error.errors });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <div className="form-control w-full max-w-full">
        <div className="flex flex-col md:flex-row gap-4 w-full">
          <fieldset className="fieldset w-full">
            <legend className="fieldset-legend">Name</legend>
            <input
              type="text"
              name="name"
              className="input w-full"
              placeholder="Product Tag Name"
              defaultValue={productTag.name}
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
              placeholder="Short Name (e.g., NEW, HOT)"
              defaultValue={productTag.short_name}
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
            <legend className="fieldset-legend">Color (hex)</legend>
            <input
              type="text"
              name="color"
              className="input w-full"
              placeholder="#FF0000"
              defaultValue={productTag.color || ''}
            />
            <div id="color-error" aria-live="polite" aria-atomic="true">
              {state.errors?.color &&
                state.errors.color.map((error: string) => (
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
              placeholder="Product Tag Description"
              defaultValue={productTag.description || ''}
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
            href="/admin/dashboard/product-tags"
            prefetch={true}
            className="btn btn-ghost max-w-40 w-full"
          >
            Cancel
          </Link>
          <button type="submit" className="btn btn-primary grow-1">
            {isLoading && <span className="loading loading-spinner"></span>}{' '}
            Update Product Tag
          </button>
        </div>
      </div>
    </form>
  );
}

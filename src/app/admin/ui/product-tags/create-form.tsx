'use client';

import { useState } from 'react';
import {
  createProductTag,
  State
} from '@/app/admin/lib/actions/product-tags.actions';
import { useRouter } from 'next/navigation';

const initialState: State = { message: null, errors: {} };

export default function CreateProductTagForm() {
  const [state, setState] = useState<State>(initialState);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setIsLoading(true);
    const newFormData = new FormData();
    newFormData.append('name', formData.get('name') as string);
    newFormData.append('shortName', formData.get('shortName') as string);
    newFormData.append('description', formData.get('description') as string);
    newFormData.append('color', formData.get('color') as string);

    return createProductTag(initialState, newFormData)
      .then((res) => {
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
          <button
            type="button"
            onClick={() => router.push('/admin/dashboard/product-tags')}
            className="btn btn-ghost max-w-40 w-full"
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary grow-1">
            {isLoading && <span className="loading loading-spinner"></span>} Add
            Product Tag
          </button>
        </div>
      </div>
    </form>
  );
}

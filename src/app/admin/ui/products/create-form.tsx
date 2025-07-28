'use client';

import { useState } from 'react';
import { createProduct, State } from '@/app/admin/lib/actions/products.actions';
import { PhotoIcon } from '@heroicons/react/24/outline';
import { PercentBadgeIcon } from '@heroicons/react/24/outline';
import { uploadMedia } from '@/shared/utils/uploadMedia';
import { useRouter } from 'next/navigation';

const initialState: State = { message: null, errors: {} };

export default function CreateProductForm() {
  const [state, setState] = useState<State>(initialState);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [image, setImage] = useState<File | null>(null);
  const router = useRouter();
  const onUpload = async (presignedUrl: string) => {
    console.log('onUpload', image);
    if (!image) {
      console.error('No file selected');
      return;
    }
    return uploadMedia(image, presignedUrl, (progress: number) =>
      setProgress(progress)
    );
  };
  const handleFormSubmit = async (formData: FormData) => {
    if (!image) {
      console.error('No file selected');
      return;
    }

    setIsLoading(true);
    formData.set('image', image.name);
    formData.set('imageType', image.type);
    console.log(formData);
    return createProduct(initialState, formData)
      .then((res) => {
        onUpload(res?.['presignedUrl'] || '')
          .then(() => {
            setTimeout(() => {
              router.push('/admin/dashboard/products');
            }, 200);
          })
          .finally(() => {
            setIsLoading(false);
          });
      })
      .catch((error) => {
        setState({
          message: error.message,
          errors: error.errors
        });
        setIsLoading(false);
      });
  };

  return (
    <form action={handleFormSubmit}>
      <div className="form-control w-full max-w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-4 w-full">
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Name</legend>
              <input
                type="text"
                name="name"
                className="input w-full"
                placeholder="Product Name"
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
              <legend className="fieldset-legend">Price</legend>
              <input
                type="number"
                name="price"
                className="input w-full"
                placeholder="Product Price"
              />
              <div id="price-error" aria-live="polite" aria-atomic="true">
                {state.errors?.price &&
                  state.errors.price.map((error: string) => (
                    <p className="text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
              </div>
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">Type</legend>
              <input
                type="text"
                name="type"
                className="input w-full"
                placeholder="Product Type"
              />
              <div id="type-error" aria-live="polite" aria-atomic="true">
                {state.errors?.type &&
                  state.errors.type.map((error: string) => (
                    <p className="text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
              </div>
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">Sale</legend>
              <label className="input w-full">
                <PercentBadgeIcon className="w-4 h-4" />
                <input
                  type="number"
                  name="sale"
                  className="w-full"
                  placeholder="Sale Percentage"
                />
              </label>

              <div id="sale-error" aria-live="polite" aria-atomic="true">
                {state.errors?.sale ? (
                  state.errors.sale.map((error: string) => (
                    <p className="text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">Vd: 5, 10, 15, 20</p>
                )}
              </div>
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">Stock</legend>
              <input
                type="number"
                name="stock"
                className="input w-full"
                placeholder="Stock Amount"
              />
              <div id="stock-error" aria-live="polite" aria-atomic="true">
                {state.errors?.stock &&
                  state.errors.stock.map((error: string) => (
                    <p className=" text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
              </div>
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">Description</legend>
              <textarea
                name="description"
                className="textarea h-24 w-full"
                placeholder="Product Description"
              ></textarea>
              <div id="description-error" aria-live="polite" aria-atomic="true">
                {state.errors?.description &&
                  state.errors.description.map((error: string) => (
                    <p className=" text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
              </div>
            </fieldset>
          </div>
          <div className="text-sm text-muted-foreground">
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Main Image</legend>
              <input
                type="file"
                name="image"
                className="file-input w-full"
                placeholder="Product Image"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  if (event.target.files?.[0]) {
                    setImage(event.target.files[0]);
                  }
                }}
              />
              <div id="image-error" aria-live="polite" aria-atomic="true">
                {state.errors?.image &&
                  state.errors.image.map((error: string) => (
                    <p className=" text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
              </div>
            </fieldset>

            <div className="mt-4 w-full h-full rounded-md max-h-48">
              {/* image preview */}
              {image ? (
                <div
                  className={`w-full h-full bg-gray-200 rounded-md max-h-48 p-2`}
                >
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Product Image"
                    className="object-contain w-full h-full"
                  />
                  {progress > 0 && (
                    <progress
                      className="progress progress-primary w-full transition-all duration-100"
                      value={progress}
                      max="100"
                    ></progress>
                  )}
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-200 rounded-md max-h-48">
                  <PhotoIcon className="w-10 h-10 text-gray-500" />
                  <p className="text-sm text-gray-500">No image selected</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button type="button" className="btn btn-ghost max-w-40 w-full">
            Cancel
          </button>

          <button type="submit" className="btn btn-primary grow-1">
            {isLoading && <span className="loading loading-spinner"></span>} Add
            Product
          </button>
        </div>
      </div>
    </form>
  );
}

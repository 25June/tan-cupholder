'use client';

import { useState } from 'react';
import { createProduct, State } from '@/app/admin/lib/actions/products.actions';
import { BoltIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { PercentBadgeIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import FileUpload from '@/components/file-upload/FileUpload';
import { createImage } from '../../lib/actions/images.actions';
import { ProductType } from '@/models/productType';
import { useGenerateProductDescription } from '@/hooks/useGenerateProductDescription';

const initialState: State = { message: null, errors: {} };

export default function CreateProductForm({
  productTypes
}: {
  productTypes: ProductType[];
}) {
  const [state, setState] = useState<State>(initialState);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const [uploadImages, setUploadImages] = useState<File[]>([]);
  const [presignedUrlObject, setPresignedUrlObject] = useState<
    Record<string, string>
  >({});
  const { generateDescription, loading } = useGenerateProductDescription();

  const onUpload = async (productId: string) => {
    if (!uploadImages.length) {
      return Promise.resolve();
    }
    setIsLoading(true);
    const newUploadImage: Record<string, boolean> = {};
    const promises = uploadImages.map((image, index) => {
      const newFormData = new FormData();
      newFormData.append('name', image.name);
      newFormData.append('type', image.type);
      newFormData.append('productId', productId);
      newUploadImage[image.name] = false;
      if (index === 0) {
        newFormData.append('isMain', 'true');
      } else {
        newFormData.append('isMain', 'false');
      }
      return createImage(initialState, newFormData)
        .then((res) => {
          setPresignedUrlObject((prev) => ({
            ...prev,
            [image.name]: res?.['presignedUrl'] || ''
          }));
        })
        .catch((error) => {
          setState({
            message: error.message,
            errors: error.errors
          });
        });
    });
    return Promise.all(promises).finally(() => setIsLoading(false));
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setIsLoading(true);
    const newFormData = new FormData();
    newFormData.append('name', formData.get('name') as string);
    newFormData.append('price', formData.get('price') as string);
    newFormData.append('type', formData.get('type') as string);
    newFormData.append('sale', formData.get('sale') as string);
    newFormData.append('stock', formData.get('stock') as string);
    newFormData.append('description', formData.get('description') as string);
    return createProduct(initialState, newFormData)
      .then((res) => {
        const productId = res?.['id'] || '';
        onUpload(productId)
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

  const onSelectImages = (files: FileList) => {
    setUploadImages(Array.from(files));
  };

  return (
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

            <div className="flex gap-4 w-full">
              <fieldset className="fieldset">
                <legend className="fieldset-legend">Price</legend>
                <input
                  type="number"
                  name="price"
                  className="input w-full"
                  placeholder="Product Price"
                  defaultValue={100000}
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
                <legend className="fieldset-legend">Stock</legend>
                <input
                  type="number"
                  name="stock"
                  className="input w-full"
                  placeholder="Stock Amount"
                  defaultValue={100}
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
            </div>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">Type</legend>
              <select
                id="type"
                name="type"
                className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="type-error"
              >
                <option value="" disabled>
                  Select a type
                </option>
                {productTypes.map((productType) => (
                  <option key={productType.id} value={productType.id}>
                    {productType.name}
                  </option>
                ))}
              </select>
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
                  defaultValue={10}
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
              <div className="flex justify-between items-center"></div>
              <textarea
                name="description"
                className="textarea h-24 w-full"
                placeholder="Product Description"
                defaultValue={
                  'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.'
                }
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
              <legend className="fieldset-legend">Images</legend>
              <input
                multiple
                type="file"
                name="image"
                className="file-input w-full"
                placeholder="Product Image"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  if (event.target.files) {
                    onSelectImages(event.target.files);
                  }
                }}
              />
            </fieldset>

            <div className="mt-4 mb-4 w-full h-full rounded-md min-h-24">
              {/* image preview */}
              {uploadImages.length ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 w-full">
                  {uploadImages.map((uploadImage) => (
                    <div
                      key={uploadImage.name}
                      className="w-full h-full flex justify-center items-center"
                    >
                      <FileUpload
                        key={uploadImage.name}
                        image={uploadImage}
                        presignedUrl={
                          presignedUrlObject[uploadImage.name] || ''
                        }
                        setImageUploadCompleted={() => console.log('done')}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-200 rounded-md max-h-48 max-w-48 p-4">
                  <PhotoIcon className="w-10 h-10 text-gray-500" />
                  <p className="text-sm text-gray-500">No image selected</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => router.push('/admin/dashboard/products')}
            className="btn btn-ghost max-w-40 w-full"
          >
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

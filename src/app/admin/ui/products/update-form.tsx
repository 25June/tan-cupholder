'use client';

import { useState } from 'react';
import { updateProduct, State } from '@/app/admin/lib/actions/products.actions';
import { PhotoIcon } from '@heroicons/react/24/outline';
import { PercentBadgeIcon } from '@heroicons/react/24/outline';
import { getImageUrl } from '@/shared/utils/getImageUrl';
import { Product } from '@/models/product';
import Link from 'next/link';
import { Image as ImageType } from '@/models/image';
import Image from 'next/image';
import { ProductType } from '@/models/productType';

const initialState: State = { message: null, errors: {} };

export default function UpdateProductForm({
  product,
  images,
  productTypes
}: {
  product: Product;
  images: ImageType[];
  productTypes: ProductType[];
}) {
  const [state, setState] = useState<State>(initialState);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const mainImage = images.find((image) => image.isMain);
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set('id', product.id);
    setIsLoading(true);
    return updateProduct(initialState, formData)
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
                placeholder="Product Name"
                defaultValue={product.name}
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
                defaultValue={product.price}
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
              <select
                id="type"
                name="type"
                className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                defaultValue={product.type}
                aria-describedby="type-error"
              >
                <option value="" disabled>
                  Select type
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
                  defaultValue={product.sale}
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
                defaultValue={product.stock}
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
                defaultValue={product.description}
              />
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
          <div>
            <p className="text-sm font-bold mb-2">Main Image</p>
            <div className="w-full h-full rounded-md max-h-48 mb-4">
              {mainImage ? (
                <div
                  className={`w-full h-full bg-gray-200 rounded-md max-h-48 p-2`}
                >
                  <Image
                    src={getImageUrl(product.id, mainImage.name)}
                    alt="Product Image"
                    className="object-contain w-full h-full"
                    width={200}
                    height={200}
                  />
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-200 rounded-md max-h-48">
                  <PhotoIcon className="w-10 h-10 text-gray-500" />
                  <p className="text-sm text-gray-500">No image selected</p>
                </div>
              )}
            </div>
            <p className="text-sm font-bold mb-2">
              Other Images ({images.length})
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 w-full">
              {(images || []).map(
                (image) =>
                  !image.isMain && (
                    <div
                      key={image.id}
                      className={`w-full h-full bg-gray-200 rounded-md max-h-56 relative p-2`}
                    >
                      <Image
                        src={getImageUrl(product.id, image.name)}
                        alt={image.name}
                        className="object-contain w-full h-full"
                        width={200}
                        height={200}
                      />
                    </div>
                  )
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Link
            href="/admin/dashboard/products"
            prefetch={true}
            className="btn btn-ghost max-w-40 w-full"
          >
            Cancel
          </Link>

          <button type="submit" className="btn btn-primary grow-1">
            {isLoading && <span className="loading loading-spinner"></span>}
            Update Product
          </button>
        </div>
      </div>
    </form>
  );
}

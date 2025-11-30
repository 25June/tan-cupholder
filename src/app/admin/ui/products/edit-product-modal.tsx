'use client';

import { useEffect, useState, useRef } from 'react';
import {
  updateProduct,
  State,
  fetchProductImages
} from '@/app/admin/lib/actions/products.actions';
import { ProductResponse } from '@/models/product';
import { PhotoIcon, TagIcon } from '@heroicons/react/24/outline';
import { PercentBadgeIcon } from '@heroicons/react/24/outline';
import { getImageUrl } from '@/shared/utils/getImageUrl';
import { Product } from '@/models/product';
import { Image as ImageType } from '@/models/image';
import Image from 'next/image';
import { ProductType } from '@/models/productType';
import { onCloseModal } from '@/shared/utils/modal.utils';
import { MODAL_ID } from '@/constants/modal.const';
import { ProductTag } from '@/models/productTag';
import AutoComplete from '../autocomplete/AutoComplete';

const initialState: State = { message: null, errors: {} };

export default function EditProductModal({
  productId,
  productTypes,
  productTags,
  onRefresh
}: {
  productId: string | null;
  productTypes: ProductType[];
  productTags: ProductTag[];
  onRefresh: () => void;
}) {
  const [state, setState] = useState<State>(initialState);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [images, setImages] = useState<ImageType[]>([]);
  const [tagIds, setTagIds] = useState<string[]>([]);
  const [formId, setFormId] = useState<string>('');
  const modalRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    const onFetchProductById = async () => {
      const modal = modalRef.current;
      if (!modal) return;

      const idToLoad = productId;
      if (!idToLoad) return;

      try {
        // Try to get product data from data attribute first
        const productDataStr = modal.getAttribute('data-product');
        if (productDataStr) {
          try {
            const productData: ProductResponse = JSON.parse(productDataStr);
            // Convert ProductResponse to Product format
            setProduct({
              id: productData.id,
              name: productData.name,
              description: productData.description,
              price: productData.price,
              sale: productData.sale,
              stock: productData.stock,
              type: productData.type,
              tagIds: productData.tagIds
            });
            setTagIds(productData.tagIds || []);
          } catch (e) {
            console.error('Failed to parse product data:', e);
            // Fallback: if parsing fails, we'd need to fetch, but this shouldn't happen
          }
        }

        // Still need to fetch images (only images, not the full product)
        const imagesData = await fetchProductImages(idToLoad);
        setImages(imagesData || []);
      } catch (error) {
        console.error('Failed to load product data:', error);
      }
    };
    if (productId) {
      onFetchProductById();
    }
  }, [productId]);

  const mainImage = images.find((image) => image.isMain);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!product) return;

    const formData = new FormData(e.currentTarget);
    formData.set('id', product.id);
    formData.set('tagIds', tagIds.join(',') || '');
    setIsLoading(true);
    return updateProduct(initialState, formData)
      .then((res: any) => {
        if (res.errors) {
          setState({
            message: res.message,
            errors: res.errors
          });
          setIsLoading(false);
          return;
        }
        setState(initialState);
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
    onCloseModal(MODAL_ID.UPDATE_PRODUCT);
    setState(initialState);
    setProduct(null);
    setImages([]);
    setFormId(Date.now().toString());
    const modal = modalRef.current;
    if (modal) {
      modal.removeAttribute('data-product');
    }
    onRefresh();
  };

  const renderForm = () => {
    if (!product)
      return (
        <div className="flex justify-center items-center p-8">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      );
    return (
      <form key={formId} onSubmit={handleFormSubmit}>
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

              <div className="flex gap-4 w-full">
                <fieldset className="fieldset w-full max-w-[70px]">
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
                      <p className="text-sm text-gray-500">Vd: 5, 10</p>
                    )}
                  </div>
                </fieldset>
                <fieldset className="fieldset grow w-full">
                  <legend className="fieldset-legend">Tag</legend>
                  <AutoComplete<string>
                    options={productTags.map((tag) => ({
                      value: tag.id,
                      label: tag.name
                    }))}
                    defaultValue={tagIds}
                    onChange={(value) => {
                      setTagIds(value);
                    }}
                    placeholder="Select tags"
                  />

                  <div id="sale-error" aria-live="polite" aria-atomic="true">
                    {state.errors?.sale ? (
                      state.errors.sale.map((error: string) => (
                        <p className="text-sm text-red-500" key={error}>
                          {error}
                        </p>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">
                        Vd: Hot, New, Sale
                      </p>
                    )}
                  </div>
                </fieldset>
              </div>

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
                <div
                  id="description-error"
                  aria-live="polite"
                  aria-atomic="true"
                >
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

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={handleClose}
              className="btn btn-ghost max-w-40 w-full"
            >
              Cancel
            </button>

            <button type="submit" className="btn btn-primary grow-1">
              {isLoading && <span className="loading loading-spinner"></span>}
              Update Product
            </button>
          </div>
        </div>
      </form>
    );
  };

  return (
    <dialog id={MODAL_ID.UPDATE_PRODUCT} className="modal" ref={modalRef}>
      <div className="modal-box max-w-4xl">
        <h3 className="font-bold text-lg mb-4">Edit Product</h3>
        {renderForm()}
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={handleClose}>close</button>
      </form>
    </dialog>
  );
}

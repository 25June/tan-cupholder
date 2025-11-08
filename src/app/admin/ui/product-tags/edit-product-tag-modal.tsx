'use client';

import { useEffect, useState, useRef } from 'react';
import {
  updateProductTag,
  State,
  getProductTagById
} from '@/app/admin/lib/actions/product-tags.actions';
import { ProductTag } from '@/models/productTag';
import { onCloseModal } from '@/shared/utils/modal.utils';
import { MODAL_ID } from '@/constants/modal.const';

const initialState: State = { message: null, errors: {} };

export default function EditProductTagModal({
  productTagId
}: {
  productTagId: string | null;
}) {
  const [state, setState] = useState<State>(initialState);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [productTag, setProductTag] = useState<ProductTag | null>(null);
  const [currentProductTagId, setCurrentProductTagId] = useState<string | null>(
    productTagId
  );
  const modalRef = useRef<HTMLDialogElement | null>(null);
  const prevOpenRef = useRef<boolean>(false);

  useEffect(() => {
    const modal = document.getElementById(
      MODAL_ID.UPDATE_PRODUCT_TAG
    ) as HTMLDialogElement;
    modalRef.current = modal;
    if (!modal) return;

    const handleClose = () => {
      setProductTag(null);
      setCurrentProductTagId(null);
      setState(initialState);
    };

    modal.addEventListener('close', handleClose);
    return () => {
      modal.removeEventListener('close', handleClose);
    };
  }, []);

  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;

    const checkModalState = () => {
      const isOpen = modal.open;
      const id = modal.getAttribute('data-product-tag-id');

      if (isOpen && !prevOpenRef.current && id) {
        setCurrentProductTagId(id);
      }

      prevOpenRef.current = isOpen;
    };

    const interval = setInterval(checkModalState, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      const idToLoad = productTagId || currentProductTagId;
      if (!idToLoad) return;

      try {
        const productTagData = await getProductTagById(idToLoad);
        setProductTag(productTagData);
      } catch (error) {
        console.error('Failed to load product tag data:', error);
      }
    };
    loadData();
  }, [productTagId, currentProductTagId]);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!productTag) return;

    const formData = new FormData(e.currentTarget);
    formData.set('id', productTag.id);
    formData.set('description', formData.get('description') as string);
    setIsLoading(true);
    return updateProductTag(initialState, formData)
      .then((res: any) => {
        if (res?.errors) {
          setState({ message: res.message, errors: res.errors });
          setIsLoading(false);
          return;
        }
        onCloseModal(MODAL_ID.UPDATE_PRODUCT_TAG);
        setState(initialState);
        window.location.reload();
      })
      .catch((error) => {
        setState({ message: error.message, errors: error.errors });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleClose = () => {
    onCloseModal(MODAL_ID.UPDATE_PRODUCT_TAG);
    setState(initialState);
    setProductTag(null);
  };

  if (!productTag) {
    return (
      <dialog id={MODAL_ID.UPDATE_PRODUCT_TAG} className="modal">
        <div className="modal-box max-w-2xl">
          <div className="flex justify-center items-center p-8">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={handleClose}>close</button>
        </form>
      </dialog>
    );
  }

  return (
    <dialog id={MODAL_ID.UPDATE_PRODUCT_TAG} className="modal">
      <div className="modal-box max-w-2xl">
        <h3 className="font-bold text-lg mb-4">Edit Product Tag</h3>
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
                Update Product Tag
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

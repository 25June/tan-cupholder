'use client';

import {
  CheckCircleIcon,
  PencilIcon,
  PhotoIcon,
  PlusIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { onOpenModal } from '@/shared/utils/modal.utils';
import { MODAL_ID } from '@/constants/modal.const';
import Spinner from '@/components/spinner/Spinner';

export function CreateProduct() {
  const handleClick = () => {
    onOpenModal(MODAL_ID.ADD_PRODUCT);
  };

  return (
    <button
      onClick={handleClick}
      className="flex h-10 items-center rounded-lg bg-logo-orange-border px-4 text-sm font-medium text-white transition-colors hover:bg-logo-orange-border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-logo-orange-border"
    >
      <span className="hidden md:block">Create Product</span>
      <PlusIcon className="h-5 md:ml-4" />
    </button>
  );
}

export function UpdateProduct({
  id,
  product
}: {
  id: string;
  product?: {
    id: string;
    name: string;
    description: string;
    price: number;
    sale: number;
    stock: number;
    type: string;
  };
}) {
  const handleClick = () => {
    const modal = document.getElementById(
      MODAL_ID.UPDATE_PRODUCT
    ) as HTMLDialogElement;
    if (modal) {
      modal.setAttribute('data-product-id', id);
      if (product) {
        modal.setAttribute('data-product', JSON.stringify(product));
      }
      onOpenModal(MODAL_ID.UPDATE_PRODUCT);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="w-full flex items-center gap-2 rounded-md p-2 hover:bg-gray-100 text-left"
    >
      <PencilIcon className="w-5" />
      <span>Edit Product</span>
    </button>
  );
}

export function UpdateImage({ id }: { id: string }) {
  const handleClick = () => {
    const modal = document.getElementById(
      MODAL_ID.EDIT_PRODUCT_IMAGE
    ) as HTMLDialogElement;
    if (modal) {
      modal.setAttribute('data-product-id', id);
      onOpenModal(MODAL_ID.EDIT_PRODUCT_IMAGE);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="w-full flex items-center gap-2 rounded-md p-2 hover:bg-gray-100 text-left"
    >
      <PhotoIcon className="w-5" />
      <span>Update Images</span>
    </button>
  );
}

export function DeleteProduct({ id }: { id: string }) {
  const handleClick = () => {
    const modal = document.getElementById(
      MODAL_ID.DELETE_PRODUCT
    ) as HTMLDialogElement;
    if (modal) {
      modal.setAttribute('data-product-id', id);
      onOpenModal(MODAL_ID.DELETE_PRODUCT);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="w-full flex items-center gap-2 rounded-md p-2 hover:bg-gray-100 text-left text-red-600 hover:text-red-700"
    >
      <TrashIcon className="w-5" />
      <span>Delete</span>
    </button>
  );
}

export function DeleteImage({
  onClick,
  loading
}: {
  onClick: () => void;
  loading: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md border border-red-400 hover:bg-red-400 hover:text-white transition-all duration-300 ${
        loading ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      {loading ? (
        <div className="p-2">
          <Spinner />
        </div>
      ) : (
        <TrashIcon className="w-10 text-red-500 p-2 hover:text-white transition-all duration-300" />
      )}
    </button>
  );
}

export function ActiveButton({
  onClick,
  loading
}: {
  onClick: () => void;
  loading: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md border border-green-500 hover:bg-green-500 hover:text-white  transition-all duration-300 ${
        loading ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      {loading ? (
        <div className="p-2">
          <Spinner />
        </div>
      ) : (
        <CheckCircleIcon className="w-10 text-green-500 p-2 hover:text-white transition-all duration-300" />
      )}
    </button>
  );
}

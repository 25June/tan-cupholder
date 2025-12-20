'use client';

import {
  PencilIcon,
  PlusIcon,
  TrashIcon,
  CircleStackIcon
} from '@heroicons/react/24/outline';
import { onOpenModal } from '@/shared/utils/modal.utils';
import { MODAL_ID } from '@/constants/modal.const';

export function CreateProductType() {
  const handleClick = () => {
    onOpenModal(MODAL_ID.ADD_PRODUCT_TYPE);
  };

  return (
    <button
      onClick={handleClick}
      className="flex h-10 items-center rounded-lg bg-logo-orange-border px-4 text-sm font-medium text-white transition-colors hover:bg-logo-orange-border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-logo-orange-border"
    >
      <span className="hidden md:block">Create</span>
      <PlusIcon className="h-5 md:ml-4" />
    </button>
  );
}

export function ArrangeProductTypes() {
  const handleClick = () => {
    onOpenModal(MODAL_ID.ARRANGE_PRODUCT_TYPES);
  };
  return (
    <button
      onClick={handleClick}
      className="flex h-10 items-center rounded-lg  px-4 text-sm font-medium text-logo-orange-border hover:text-white transition-colors hover:bg-logo-orange-border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-logo-orange-border"
    >
      <span className="hidden md:block">Arrange</span>
      <CircleStackIcon className="h-5 md:ml-4" />
    </button>
  );
}

export function UpdateProductType({
  id,
  onSelectProductType
}: {
  id: string;
  onSelectProductType: (id: string) => void;
}) {
  const handleClick = () => {
    onSelectProductType(id);
    onOpenModal(MODAL_ID.UPDATE_PRODUCT_TYPE);
  };

  return (
    <button
      onClick={handleClick}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </button>
  );
}

export function DeleteProductType({
  id,
  onSelectProductType
}: {
  id: string;
  onSelectProductType: (id: string) => void;
}) {
  const handleClick = () => {
    onSelectProductType(id);
    onOpenModal(MODAL_ID.DELETE_PRODUCT_TYPE);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="rounded-md border p-2"
    >
      <span className="sr-only">Delete</span>
      <TrashIcon className="w-5" />
    </button>
  );
}

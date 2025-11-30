'use client';

import { PlusIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import { MODAL_ID } from '@/constants/modal.const';
import { onOpenModal } from '@/shared/utils/modal.utils';

export const CreateInvoice = () => {
  const handleOpenModal = () => {
    onOpenModal(MODAL_ID.CREATE_INVOICE);
  };

  return (
    <button
      onClick={handleOpenModal}
      className="flex h-10 items-center rounded-lg bg-logo-orange-border px-4 text-sm font-medium text-white transition-colors hover:bg-logo-orange-border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-logo-orange-border"
    >
      <span className="hidden md:block">Create Invoice</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </button>
  );
};

export const ViewInvoice = ({
  id,
  onSelect
}: {
  id: string;
  onSelect: (id: string) => void;
}) => {
  const handleOpenModal = () => {
    onSelect(id);
    onOpenModal(MODAL_ID.VIEW_INVOICE);
  };

  return (
    <button
      onClick={handleOpenModal}
      className="rounded-md border p-2 hover:bg-gray-100"
      title="View Invoice Details"
    >
      <span className="sr-only">View</span>
      <EyeIcon className="w-5" />
    </button>
  );
};

export const DeleteInvoice = ({
  id,
  onSelect
}: {
  id: string;
  onSelect: (id: string) => void;
}) => {
  const handleOpenModal = () => {
    onSelect(id);
    onOpenModal(MODAL_ID.DELETE_INVOICE);
  };

  return (
    <button
      onClick={handleOpenModal}
      className="rounded-md border p-2 hover:bg-gray-100"
      title="Delete Invoice"
    >
      <span className="sr-only">Delete</span>
      <TrashIcon className="w-5" />
    </button>
  );
};

'use client';

import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { onOpenModal } from '@/shared/utils/modal.utils';
import { MODAL_ID } from '@/constants/modal.const';

export function CreateUser() {
  const handleClick = () => {
    onOpenModal(MODAL_ID.ADD_USER);
  };

  return (
    <button
      onClick={handleClick}
      className="flex h-10 items-center rounded-lg bg-logo-orange-border px-4 text-sm font-medium text-white transition-colors hover:bg-logo-orange-border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-logo-orange-border"
    >
      <span className="hidden md:block">Create User</span>
      <PlusIcon className="h-5 md:ml-4" />
    </button>
  );
}

export function UpdateUser({ id }: { id: string }) {
  const handleClick = () => {
    const modal = document.getElementById(
      MODAL_ID.UPDATE_USER
    ) as HTMLDialogElement;
    if (modal) {
      modal.setAttribute('data-user-id', id);
      onOpenModal(MODAL_ID.UPDATE_USER);
    }
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

export function DeleteUser({ id }: { id: string }) {
  const handleClick = () => {
    const modal = document.getElementById(
      MODAL_ID.DELETE_USER
    ) as HTMLDialogElement;
    if (modal) {
      modal.setAttribute('data-user-id', id);
      onOpenModal(MODAL_ID.DELETE_USER);
    }
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

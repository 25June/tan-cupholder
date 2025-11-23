'use client';

import { PlusIcon } from '@heroicons/react/24/outline';
import {
  PencilIcon,
  TrashIcon,
  EllipsisVerticalIcon
} from '@heroicons/react/24/outline';
import { onOpenModal } from '@/shared/utils/modal.utils';
import { MODAL_ID } from '@/constants/modal.const';
import SimpleDropdown from '@/components/simple-dropdown/simple-downdown';

export function CreateEmailTemplate() {
  const handleClick = () => {
    onOpenModal(MODAL_ID.ADD_EMAIL_TEMPLATE);
  };

  return (
    <button
      onClick={handleClick}
      className="flex h-10 items-center rounded-lg bg-logo-orange-border px-4 text-sm font-medium text-white transition-colors hover:bg-logo-orange-border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-logo-orange-border"
    >
      <span className="hidden md:block">Create Template</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </button>
  );
}

export function UpdateEmailTemplate({ id }: { id: string }) {
  const handleClick = () => {
    const modal = document.getElementById(
      MODAL_ID.UPDATE_EMAIL_TEMPLATE
    ) as HTMLDialogElement;
    if (modal) {
      modal.setAttribute('data-email-template-id', id);
      onOpenModal(MODAL_ID.UPDATE_EMAIL_TEMPLATE);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="rounded-md p-2  w-full flex items-center gap-2"
    >
      <PencilIcon className="w-5" />
      <span>Edit</span>
    </button>
  );
}

export function DeleteEmailTemplate({ id }: { id: string }) {
  const handleClick = () => {
    const modal = document.getElementById(
      MODAL_ID.DELETE_EMAIL_TEMPLATE
    ) as HTMLDialogElement;
    if (modal) {
      modal.setAttribute('data-email-template-id', id);
      onOpenModal(MODAL_ID.DELETE_EMAIL_TEMPLATE);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="rounded-md p-2 w-full flex items-center gap-2"
    >
      <TrashIcon className="w-5" />
      <span>Delete</span>
    </button>
  );
}

export function More({ id }: { id: string }) {
  return (
    <SimpleDropdown
      host={
        <div
          tabIndex={0}
          role="button"
          className="rounded-md border p-2 hover:bg-gray-100"
        >
          <span className="sr-only">More</span>
          <EllipsisVerticalIcon className="w-5" />
        </div>
      }
      content={
        <>
          <li>
            <UpdateEmailTemplate id={id} />
          </li>
          <li>
            <DeleteEmailTemplate id={id} />
          </li>
        </>
      }
    />
  );
}

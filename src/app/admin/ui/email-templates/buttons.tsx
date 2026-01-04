'use client';

import { EnvelopeIcon, PlusIcon } from '@heroicons/react/24/outline';
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

export function UpdateEmailTemplate({
  id,
  onSelectTemplate
}: {
  id: string;
  onSelectTemplate: (id: string) => void;
}) {
  const handleClick = () => {
    onSelectTemplate(id);
    onOpenModal(MODAL_ID.UPDATE_EMAIL_TEMPLATE);
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

export function DeleteEmailTemplate({
  id,
  onSelectTemplate
}: {
  id: string;
  onSelectTemplate: (id: string) => void;
}) {
  const handleClick = () => {
    onSelectTemplate(id);
    onOpenModal(MODAL_ID.DELETE_EMAIL_TEMPLATE);
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

export function SendEmailTemplate({
  id,
  onSelectTemplate
}: {
  id: string;
  onSelectTemplate: (id: string) => void;
}) {
  const handleClick = () => {
    onSelectTemplate(id);
    onOpenModal(MODAL_ID.SEND_EMAIL);
  };
  return (
    <button
      type="button"
      onClick={handleClick}
      className="rounded-md p-2 w-full flex items-center gap-2"
    >
      <EnvelopeIcon className="w-5" />
      <span>Send</span>
    </button>
  );
}

export function More({
  id,
  onSelectTemplate
}: {
  id: string;
  onSelectTemplate: (id: string) => void;
}) {
  return (
    <SimpleDropdown
      host={
        <div
          tabIndex={0}
          role="button"
          className="rounded-md border border-gray-500 hover:border-gray-700 transition-all duration-100 p-2 hover:bg-gray-100"
        >
          <span className="sr-only">More</span>
          <EllipsisVerticalIcon className="w-5 text-gray-500" />
        </div>
      }
      content={
        <>
          <li>
            <UpdateEmailTemplate id={id} onSelectTemplate={onSelectTemplate} />
          </li>
          <li>
            <DeleteEmailTemplate id={id} onSelectTemplate={onSelectTemplate} />
          </li>
          <li>
            <SendEmailTemplate id={id} onSelectTemplate={onSelectTemplate} />
          </li>
        </>
      }
    />
  );
}

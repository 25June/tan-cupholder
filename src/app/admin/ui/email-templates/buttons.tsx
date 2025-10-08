'use client';

import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/24/outline';
import {
  PencilIcon,
  TrashIcon,
  EllipsisVerticalIcon
} from '@heroicons/react/24/outline';
import { deleteEmailTemplate } from '@/app/admin/lib/actions/email-templates.actions';

export function CreateEmailTemplate() {
  return (
    <Link
      href="/admin/dashboard/email-templates/create"
      prefetch={true}
      className="flex h-10 items-center rounded-lg bg-logo-orange-border px-4 text-sm font-medium text-white transition-colors hover:bg-logo-orange-border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-logo-orange-border"
    >
      <span className="hidden md:block">Create Template</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateEmailTemplate({ id }: { id: string }) {
  return (
    <Link
      href={`/admin/dashboard/email-templates/${id}/edit`}
      prefetch={true}
      className="rounded-md p-2  w-full flex items-center gap-2"
    >
      <PencilIcon className="w-5" />
      <span>Edit</span>
    </Link>
  );
}

export function DeleteEmailTemplate({ id }: { id: string }) {
  const deleteEmailTemplateWithId = deleteEmailTemplate.bind(null, id);

  return (
    <form action={deleteEmailTemplateWithId} className="w-full p-0">
      <button className="rounded-md p-2 w-full flex items-center gap-2">
        <TrashIcon className="w-5" />
        <span>Delete</span>
      </button>
    </form>
  );
}

export function More({ id }: { id: string }) {
  return (
    <div className="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="rounded-md border p-2 hover:bg-gray-100"
      >
        <span className="sr-only">More</span>
        <EllipsisVerticalIcon className="w-5" />
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content menu bg-white border border-gray-200 rounded-lg w-36 shadow-lg z-50"
      >
        <li>
          <UpdateEmailTemplate id={id} />
        </li>
        <li>
          <DeleteEmailTemplate id={id} />
        </li>
      </ul>
    </div>
  );
}

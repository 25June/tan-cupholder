import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/24/outline';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { deleteEmailTemplate } from '@/app/admin/lib/actions/email-templates.actions';

export function CreateEmailTemplate() {
  return (
    <Link
      href="/admin/dashboard/email-templates/create"
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
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <span className="sr-only">Edit</span>
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteEmailTemplate({ id }: { id: string }) {
  const deleteEmailTemplateWithId = deleteEmailTemplate.bind(null, id);

  return (
    <form action={deleteEmailTemplateWithId}>
      <button className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
    </form>
  );
}

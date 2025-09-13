import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/24/outline';

export default function CreateFeatureImage() {
  return (
    <Link
      href="/admin/dashboard/feature-images/create"
      className="flex h-10 items-center rounded-lg bg-logo-orange-border px-4 text-sm font-medium text-white transition-colors hover:bg-logo-orange-border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-logo-orange-border"
    >
      <span className="hidden md:block">Add</span>
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

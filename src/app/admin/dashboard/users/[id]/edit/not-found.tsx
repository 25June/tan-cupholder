import Link from 'next/link';
import { FaceFrownIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/admin/ui/fonts';

export default function NotFound() {
  return (
    <main className="flex h-full flex-col items-center justify-center gap-2">
      <FaceFrownIcon className="w-10 text-gray-400" />
      <h2 className={`${lusitana.className} text-xl`}>404 Not Found</h2>
      <p>Could not find the requested user.</p>
      <Link
        href="/admin/dashboard/users"
        className="mt-4 rounded-md bg-logo-orange-border px-4 py-2 text-sm text-white transition-colors hover:bg-logo-orange-border"
      >
        Go Back
      </Link>
    </main>
  );
}

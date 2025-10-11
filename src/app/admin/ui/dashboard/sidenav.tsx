import Link from 'next/link';
import Image from 'next/image';
import NavLinks from '@/app/admin/ui/dashboard/nav-links';
import { PencilIcon, PowerIcon } from '@heroicons/react/24/outline';
import { signOut } from '@/auth';
import { auth } from '@/auth';
import { Suspense } from 'react';
import Spinner from '@/components/spinner/Spinner';

export async function UserEmail() {
  const session = await auth();
  const user = session?.user;
  return (
    <div className="bg-gray-50 p-3 flex items-center justify-between">
      <p className="text-sm text-gray-500">
        Hi <span className="font-bold">{user?.email}</span>
      </p>
      <Link
        href="/admin/dashboard/profile"
        prefetch={true}
        className="text-sm text-gray-500"
      >
        <PencilIcon className="w-4" />
      </Link>
    </div>
  );
}

export default function SideNav() {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <Link
        className="mb-2 flex h-20 md:h-40 items-center justify-center rounded-md bg-logo-orange-border p-4 "
        href="/"
        prefetch={true}
      >
        <Image
          src="/logo.png"
          alt="TAN cupholder logo"
          width={200}
          height={200}
          className={`rounded-full w-16 h-16 md:w-32 md:h-32`}
        />
      </Link>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
        <Suspense fallback={<Spinner color="orange" />}>
          <UserEmail />
        </Suspense>
        <form
          onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            ('use server');
            await signOut({ redirectTo: '/' });
          }}
        >
          <button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-logo-orange-border md:flex-none md:justify-start md:p-2 md:px-3">
            <PowerIcon className="w-6" />
            <div className="hidden md:block">Sign Out</div>
          </button>
        </form>
      </div>
    </div>
  );
}

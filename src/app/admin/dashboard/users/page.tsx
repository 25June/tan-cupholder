import {
  fetchUsers,
  fetchTotalUsers
} from '@/app/admin/lib/actions/user.actions';
import { Metadata } from 'next';
import UsersTable from '../../ui/users/table';
import { lusitana } from '@/app/admin/ui/fonts';
import Search from '../../ui/search';
import { CreateUser } from '../../ui/users/buttons';
import { Suspense } from 'react';
import Pagination from '../../ui/invoices/pagination';

export const metadata: Metadata = {
  title: 'Users'
};

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;

  const users = await fetchUsers({ query, page: currentPage.toString() });
  const totalUsers = await fetchTotalUsers();

  return (
    <main>
      <div className="flex w-full items-center justify-between mb-8">
        <h1 className={`${lusitana.className}  text-xl md:text-2xl`}>Users</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search users..." />
        <CreateUser />
      </div>
      <Suspense key={query + currentPage} fallback={<div>Loading...</div>}>
        <UsersTable users={users} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={Math.ceil(totalUsers / 10)} />
      </div>
    </main>
  );
}

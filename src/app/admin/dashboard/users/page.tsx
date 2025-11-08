'use client';

import { useEffect, useState } from 'react';
import {
  fetchUsers,
  fetchTotalUsers
} from '@/app/admin/lib/actions/user.actions';
import UsersTable from '../../ui/users/table';
import { lusitana } from '@/app/admin/ui/fonts';
import Search from '../../ui/search';
import { CreateUser } from '../../ui/users/buttons';
import Pagination from '../../ui/invoices/pagination';
import { UserInfo } from '@/models/user';
import CreateUserModal from '../../ui/users/create-user-modal';
import EditUserModal from '../../ui/users/edit-user-modal';
import DeleteUserModal from '../../ui/users/delete-user-modal';
import { useSearchParams } from 'next/navigation';

export default function Page() {
  const searchParams = useSearchParams();
  const query = searchParams?.get('query') || '';
  const currentPage = Number(searchParams?.get('page')) || 1;

  const [users, setUsers] = useState<UserInfo[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [usersData, totalData] = await Promise.all([
          fetchUsers({ query, page: currentPage.toString() }),
          fetchTotalUsers()
        ]);

        setUsers(usersData);
        setTotalUsers(totalData);
      } catch (error) {
        console.error('Failed to load users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [query, currentPage]);

  return (
    <main>
      <div className="flex w-full items-center justify-between mb-8">
        <h1 className={`${lusitana.className}  text-xl md:text-2xl`}>Users</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search users..." />
        <CreateUser />
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center p-8">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <>
          <UsersTable users={users} />
          <div className="mt-5 flex w-full justify-center">
            <Pagination totalPages={Math.ceil(totalUsers / 10)} />
          </div>
        </>
      )}
      <CreateUserModal />
      <EditUserModal userId={null} />
      <DeleteUserModal userId={null} />
    </main>
  );
}

'use client';

import Image from 'next/image';
import { UserInfo } from '@/models/user';
import { DeleteUser, UpdateUser } from './buttons';
import { UserRole } from '@/constants/user';
import SimpleTable, { Column } from '@/components/simple-table/SimpleTable';

export default function UsersTable({
  users,
  loading = false,
  onSelectUser
}: {
  users: UserInfo[];
  loading: boolean;
  onSelectUser: (id: string) => void;
}) {
  const columns: Column<UserInfo>[] = [
    {
      header: 'User',
      render: (user) => (
        <div className="flex items-center gap-3">
          <Image
            src={user.avatarURL || '/cup.png'}
            className="rounded-full w-16 h-16 object-cover shrink-0"
            alt={`${
              user.fullName || `${user.firstName} ${user.lastName}`
            }'s profile picture`}
            width={128}
            height={128}
          />
          <div>
            <p className="font-medium">
              {user.fullName || `${user.firstName} ${user.lastName}`}
            </p>
            <p className="text-sm text-gray-500">ID: {user.id}</p>
          </div>
        </div>
      )
    },
    {
      header: 'Email',
      accessor: 'email'
    },
    {
      header: 'Role',
      render: (user) => (
        <span
          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
            user.role === UserRole.Admin
              ? 'bg-purple-100 text-purple-800'
              : user.role === UserRole.Staff
              ? 'bg-red-100 text-red-800'
              : 'bg-blue-100 text-blue-800'
          }`}
        >
          {user.role}
        </span>
      )
    },
    {
      header: 'Status',
      render: (user) => (
        <span
          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
            user.status === 'ACTIVE'
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {user.status}
        </span>
      )
    },
    {
      header: 'Email Verified',
      render: (user) => (
        <span
          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
            user.emailVerified
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {user.emailVerified ? 'Verified' : 'Pending'}
        </span>
      )
    },
    {
      header: 'Created At',
      render: (user) =>
        user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'
    }
  ];

  return (
    <SimpleTable
      data={users}
      columns={columns}
      keyExtractor={(user) => user.id}
      actions={(user) => (
        <>
          <UpdateUser id={user.id} onSelectUser={onSelectUser} />
          <DeleteUser id={user.id} onSelectUser={onSelectUser} />
        </>
      )}
      emptyMessage="No users found"
      loading={loading}
    />
  );
}

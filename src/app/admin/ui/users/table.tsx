'use client';

import { useState } from 'react';
import Image from 'next/image';
import { UserInfo } from '@/models/user';
import { DeleteUser, UpdateUser } from './buttons';
import { TrashIcon } from '@heroicons/react/24/outline';

export default function UsersTable({ users }: { users: UserInfo[] }) {
  const [doubleClick, setDoubleClick] = useState<Record<string, boolean>>({});

  return (
    <div className="w-full">
      <div className="mt-6 flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden rounded-md bg-gray-50 p-2 md:pt-0">
              <div className="md:hidden">
                {users?.map((user) => (
                  <div
                    key={user.id}
                    className="mb-2 w-full rounded-md bg-white p-4"
                  >
                    <div className="flex items-center justify-between border-b pb-4">
                      <div>
                        <div className="mb-2 flex items-center">
                          <div className="flex items-center gap-3 shrink-0">
                            <Image
                              src={user.avatarURL || '/cup.png'}
                              className="rounded-full w-16 h-16 object-cover"
                              alt={`${
                                user.fullName ||
                                `${user.firstName} ${user.lastName}`
                              }'s profile picture`}
                              width={128}
                              height={128}
                            />
                            <div>
                              <p className="font-medium">
                                {user.fullName ||
                                  `${user.firstName} ${user.lastName}`}
                              </p>
                              <p className="text-sm text-gray-500">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex w-full items-center justify-between border-b py-5">
                      <div className="flex w-1/2 flex-col">
                        <p className="text-xs">Role</p>
                        <p className="font-medium">{user.role}</p>
                      </div>
                      <div className="flex w-1/2 flex-col">
                        <p className="text-xs">Status</p>
                        <p className="font-medium">{user.status}</p>
                      </div>
                    </div>
                    <div className="pt-4 text-sm">
                      <p>Email verified: {user.emailVerified ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                ))}
              </div>
              <table className="hidden min-w-full rounded-md text-gray-900 md:table">
                <thead className="rounded-md bg-gray-50 text-left text-sm font-normal">
                  <tr>
                    <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                      User
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Email
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Role
                    </th>
                    <th scope="col" className="px-4 py-5 font-medium">
                      Status
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Email Verified
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Created At
                    </th>
                    <th scope="col" className="relative py-3 pl-6 pr-3">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 text-gray-900">
                  {users?.map((user) => (
                    <tr key={user.id} className="group bg-white">
                      <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
                        <div className="flex items-center gap-3">
                          <Image
                            src={user.avatarURL || '/cup.png'}
                            className="rounded-full w-16 h-16 object-cover shrink-0"
                            alt={`${
                              user.fullName ||
                              `${user.firstName} ${user.lastName}`
                            }'s profile picture`}
                            width={128}
                            height={128}
                          />
                          <div>
                            <p className="font-medium">
                              {user.fullName ||
                                `${user.firstName} ${user.lastName}`}
                            </p>
                            <p className="text-sm text-gray-500">
                              ID: {user.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-4 py-5 text-sm">
                        {user.email}
                      </td>
                      <td className="whitespace-nowrap px-4 py-5 text-sm">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                            user.role === 'ADMIN'
                              ? 'bg-purple-100 text-purple-800'
                              : user.role === 'SUPER_ADMIN'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-5 text-sm">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                            user.status === 'ACTIVE'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-5 text-sm">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                            user.emailVerified
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {user.emailVerified ? 'Verified' : 'Pending'}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-5 text-sm">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : 'N/A'}
                      </td>
                      <td className="whitespace-nowrap py-3 pl-6 pr-3">
                        <div className="flex justify-end gap-3">
                          <UpdateUser id={user.id} />
                          {doubleClick[user.id] ? (
                            <DeleteUser id={user.id} />
                          ) : (
                            <button
                              onClick={() =>
                                setDoubleClick((prev) => ({
                                  ...prev,
                                  [user.id]: true
                                }))
                              }
                              className="rounded-md border p-2 hover:bg-gray-100"
                            >
                              <span className="sr-only">Delete</span>
                              <TrashIcon className="w-5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

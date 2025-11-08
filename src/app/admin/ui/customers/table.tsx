'use client';

import Image from 'next/image';
import { Customer } from '@/models/customer';
import { DeleteCustomer, UpdateCustomer } from './buttons';

export default function CustomersTable({
  customers
}: {
  customers: Customer[];
}) {
  return (
    <div className="w-full">
      <div className="mt-6 flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden rounded-md bg-gray-50 p-2 md:pt-0">
              <div className="md:hidden">
                {customers?.map((customer) => (
                  <div
                    key={customer.id}
                    className="mb-2 w-full rounded-md bg-white p-4"
                  >
                    <div className="flex items-center justify-between border-b pb-4">
                      <div>
                        <div className="mb-2 flex items-center">
                          <div className="flex items-center gap-3">
                            <Image
                              src={customer.image_url || '/cup.png'}
                              className="rounded-full w-16 h-16 object-cover"
                              alt={`${customer.name}'s profile picture`}
                              width={64}
                              height={64}
                            />
                            <p className="font-medium">{customer.name}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex w-full items-center justify-between border-b py-5">
                      <div className="flex w-1/2 flex-col">
                        <p className="text-xs">Email</p>
                        <p className="font-medium">{customer.email}</p>
                      </div>
                      <div className="flex w-1/2 flex-col">
                        <p className="text-xs">Phone</p>
                        <p className="font-medium">
                          {customer.phone_number || 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="pt-4 text-sm">
                      <p>
                        Verified: {customer.is_email_verified ? 'Yes' : 'No'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <table className="hidden min-w-full rounded-md text-gray-900 md:table">
                <thead className="rounded-md bg-gray-50 text-left text-sm font-normal">
                  <tr>
                    <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                      Name
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Email
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Phone
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Address
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Verified
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Created
                    </th>
                    <th scope="col" className="relative py-3 pl-6 pr-3">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 text-gray-900">
                  {customers?.map((customer) => (
                    <tr key={customer.id} className="group bg-white">
                      <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
                        <div className="flex items-center gap-3">
                          <Image
                            src={customer.image_url || '/cup.png'}
                            className="rounded-full w-16 h-16 object-cover shrink-0"
                            alt={`${customer.name}'s profile picture`}
                            width={64}
                            height={64}
                          />
                          <p className="font-medium">{customer.name}</p>
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-4 py-5 text-sm">
                        {customer.email}
                      </td>
                      <td className="whitespace-nowrap px-4 py-5 text-sm">
                        {customer.phone_number || 'N/A'}
                      </td>
                      <td className="whitespace-nowrap px-4 py-5 text-sm text-ellipsis overflow-hidden max-w-32">
                        {customer.address || 'N/A'}
                      </td>
                      <td className="whitespace-nowrap px-4 py-5 text-sm">
                        {customer.is_email_verified ? 'Yes' : 'No'}
                      </td>
                      <td className="whitespace-nowrap px-4 py-5 text-sm">
                        {customer.created_at
                          ? new Date(customer.created_at).toLocaleDateString()
                          : 'N/A'}
                      </td>
                      <td className="whitespace-nowrap py-3 pl-6 pr-3">
                        <div className="flex justify-end gap-3">
                          <UpdateCustomer id={customer.id} />
                          <DeleteCustomer id={customer.id} />
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

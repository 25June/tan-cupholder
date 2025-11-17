'use client';

import { OrderWithCustomer } from '@/app/admin/lib/actions/orders.actions';
import Link from 'next/link';
import { EyeIcon } from '@heroicons/react/24/outline';
import {
  getOrderStatusColor,
  getOrderStatusText
} from '@/shared/utils/order.utils';
import { formatPriceWithoutSymbol } from '@/shared/utils/formatPrice';

export default function OrdersTable({
  orders
}: {
  orders: OrderWithCustomer[];
}) {
  return (
    <div className="w-full">
      <div className="mt-6 flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden rounded-md bg-gray-50 p-2 md:pt-0">
              <div className="md:hidden">
                {orders?.map((order) => (
                  <div
                    key={order.id}
                    className="mb-2 w-full rounded-md bg-white p-4"
                  >
                    <div className="flex items-center justify-between border-b pb-4">
                      <div className="flex items-center gap-3">
                        <p className="font-medium">
                          Order #{order.id.slice(-8)}
                        </p>
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${getOrderStatusColor(
                            order.status as any
                          )}`}
                        >
                          {getOrderStatusText(order.status as any)}
                        </span>
                      </div>
                    </div>
                    <div className="flex w-full items-center justify-between border-b py-5">
                      <div className="flex w-1/2 flex-col">
                        <p className="text-xs">Customer</p>
                        <p className="font-medium">{order.customer_name}</p>
                        <p className="text-sm text-gray-500">
                          {order.customer_email}
                        </p>
                      </div>
                      <div className="flex w-1/2 flex-col">
                        <p className="text-xs">Total</p>
                        <p className="font-medium">
                          {formatPriceWithoutSymbol(order.total_price)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {order.total_items} items
                        </p>
                      </div>
                    </div>
                    <div className="flex w-full items-center justify-between py-5">
                      <div className="flex w-1/2 flex-col">
                        <p className="text-xs">Payment</p>
                        <p className="font-medium capitalize">
                          {order.payment_status}
                        </p>
                      </div>
                      <div className="flex w-1/2 flex-col">
                        <p className="text-xs">Created</p>
                        <p className="font-medium">
                          {order.created_at
                            ? new Date(order.created_at).toLocaleDateString()
                            : 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="pt-4 text-sm">
                      <Link
                        href={`/admin/dashboard/orders/${order.id}`}
                        prefetch={true}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
                      >
                        <EyeIcon className="w-4 h-4" />
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
              <table className="hidden min-w-full rounded-md text-gray-900 md:table">
                <thead className="rounded-md bg-gray-50 text-left text-sm font-normal">
                  <tr>
                    <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                      Order ID
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Customer
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Email
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Status
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Items
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Total Price
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Created Date
                    </th>
                    <th scope="col" className="relative py-3 pl-6 pr-3">
                      <span className="sr-only">Action</span>
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 text-gray-900">
                  {orders?.map((order) => (
                    <tr key={order.id} className="group bg-white">
                      <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
                        <div className="flex items-center gap-3">
                          <span className="font-medium font-mono">
                            #{order.id.slice(-8)}
                          </span>
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-4 py-5 text-sm">
                        <div>
                          <p className="font-medium">{order.customer_name}</p>
                          {order.customer_phone && (
                            <p className="text-gray-500 text-xs">
                              {order.customer_phone}
                            </p>
                          )}
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-4 py-5 text-sm">
                        <div className="text-gray-600 truncate max-w-32">
                          {order.customer_email}
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-4 py-5 text-sm">
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${getOrderStatusColor(
                            order.status as any
                          )}`}
                        >
                          {getOrderStatusText(order.status as any)}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-4 py-5 text-sm">
                        <div className="text-center">
                          <span className="font-medium">
                            {order.total_items}
                          </span>
                          <p className="text-xs text-gray-500 capitalize">
                            {order.payment_status}
                          </p>
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-4 py-5 text-sm">
                        <span className="font-medium">
                          {formatPriceWithoutSymbol(order.total_price)}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-4 py-5 text-sm">
                        {order.created_at
                          ? new Date(order.created_at).toLocaleDateString()
                          : 'N/A'}
                      </td>

                      <td className="whitespace-nowrap py-3 pl-6 pr-3">
                        <div className="flex justify-end gap-3">
                          <Link
                            href={`/admin/dashboard/orders/${order.id}`}
                            prefetch={true}
                            className="rounded-md bg-logo-orange-border px-3 py-2 text-sm font-medium text-white hover:bg-logo-orange-border/90 transition-colors duration-200"
                          >
                            <span className="flex items-center gap-1">
                              <EyeIcon className="w-4 h-4" />
                              View Detail
                            </span>
                          </Link>
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

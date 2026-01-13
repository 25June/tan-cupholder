'use client';

import { OrderWithCustomer } from '@/app/admin/lib/actions/orders.actions';
import Link from 'next/link';
import { EyeIcon } from '@heroicons/react/24/outline';
import {
  getOrderStatusColor,
  getOrderStatusText
} from '@/shared/utils/order.utils';
import { formatPrice } from '@/shared/utils/formatPrice';
import SimpleTable, { Column } from '@/components/simple-table/SimpleTable';

interface OrdersTableProps {
  readonly orders: OrderWithCustomer[];
  readonly loading: boolean;
}

export default function OrdersTable({
  orders,
  loading = false
}: OrdersTableProps) {
  const columns: Column<OrderWithCustomer>[] = [
    {
      header: 'Order ID',
      render: (order) => (
        <div className="flex items-center gap-3">
          <span className="font-medium font-mono">#{order.id.slice(-8)}</span>
        </div>
      )
    },
    {
      header: 'Customer',
      render: (order) => (
        <div>
          <p className="font-medium">{order.customer_name}</p>
          {order.customer_phone && (
            <p className="text-gray-500 text-xs">{order.customer_phone}</p>
          )}
        </div>
      )
    },
    {
      header: 'Email',
      render: (order) => (
        <div className="text-gray-600 truncate max-w-32">
          {order.customer_email}
        </div>
      )
    },
    {
      header: 'Status',
      render: (order) => (
        <span
          className={`rounded-full px-2 py-1 text-xs font-medium ${getOrderStatusColor(
            order.status as any
          )}`}
        >
          {getOrderStatusText(order.status as any)}
        </span>
      )
    },
    {
      header: 'Items',
      render: (order) => (
        <div className="text-center">
          <span className="font-medium">{order.total_items}</span>
          <p className="text-xs text-gray-500 capitalize">
            {order.payment_status}
          </p>
        </div>
      )
    },
    {
      header: 'Total Price',
      render: (order) => (
        <span className="font-medium">{formatPrice(order.total_price)}</span>
      )
    },
    {
      header: 'Created Date',
      render: (order) =>
        order.created_at
          ? new Date(order.created_at).toLocaleDateString()
          : 'N/A'
    }
  ];

  return (
    <SimpleTable
      data={orders}
      columns={columns}
      keyExtractor={(order) => order.id}
      actions={(order) => (
        <div className="flex justify-end items-center gap-1">
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
      )}
      emptyMessage="No orders found"
      loading={loading}
    />
  );
}

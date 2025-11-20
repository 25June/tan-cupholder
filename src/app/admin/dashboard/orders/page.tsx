'use client';

import { useEffect, useState } from 'react';
import {
  fetchOrders,
  fetchTotalOrders
} from '@/app/admin/lib/actions/orders.actions';
import OrdersTable from '@/app/admin/ui/orders/table';
import { lusitana } from '@/app/admin/ui/fonts';
import Search from '@/app/admin/ui/search';
import Pagination from '@/app/admin/ui/invoices/pagination';
import { OrderWithCustomer } from '@/app/admin/lib/actions/orders.actions';
import { useSearchParams } from 'next/navigation';

export default function OrdersPage() {
  const searchParams = useSearchParams();
  const query = searchParams?.get('query') || '';
  const currentPage = Number(searchParams?.get('page')) || 1;

  const [orders, setOrders] = useState<OrderWithCustomer[]>([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [ordersData, totalData] = await Promise.all([
          fetchOrders({ query, page: currentPage.toString() }),
          fetchTotalOrders(query)
        ]);

        setOrders(ordersData);
        setTotalOrders(totalData);
      } catch (error) {
        console.error('Failed to load orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [query, currentPage]);

  const totalPages = Math.ceil(totalOrders / 10);

  return (
    <main>
      <div className="flex w-full items-center justify-between mb-8">
        <h1 className={`${lusitana.className} text-xl md:text-2xl`}>
          Orders Management
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">
            Total: {totalOrders} orders
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search orders by customer name, email, or order ID..." />
      </div>

      <OrdersTable orders={orders} loading={isLoading} />
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </main>
  );
}

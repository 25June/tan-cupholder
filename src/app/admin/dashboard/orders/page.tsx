import {
  fetchOrders,
  fetchTotalOrders
} from '@/app/admin/lib/actions/orders.actions';
import { Metadata } from 'next';
import OrdersTable from '@/app/admin/ui/orders/table';
import { lusitana } from '@/app/admin/ui/fonts';
import Search from '@/app/admin/ui/search';
import { Suspense } from 'react';
import Pagination from '@/app/admin/ui/invoices/pagination';

export const metadata: Metadata = {
  title: 'Orders Management'
};

export default async function OrdersPage(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;

  const [orders, totalOrders] = await Promise.all([
    fetchOrders({ query, page: currentPage.toString() }),
    fetchTotalOrders(query)
  ]);

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

      <Suspense
        key={query + currentPage}
        fallback={
          <div className="mt-6 flex items-center justify-center">
            <div className="flex items-center gap-2 text-gray-500">
              <div className="animate-spin h-4 w-4 border-2 border-logo-orange-border border-t-transparent rounded-full"></div>
              Loading orders...
            </div>
          </div>
        }
      >
        <OrdersTable orders={orders} />
      </Suspense>

      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </main>
  );
}

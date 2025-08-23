import {
  fetchCustomers,
  fetchTotalCustomers
} from '@/app/admin/lib/actions/customers.action';
import { Metadata } from 'next';
import CustomersTable from '@/app/admin/ui/customers/table';
import { lusitana } from '@/app/admin/ui/fonts';
import Search from '@/app/admin/ui/search';
import { CreateCustomer } from '@/app/admin/ui/customers/buttons';
import { Suspense } from 'react';
import Pagination from '@/app/admin/ui/invoices/pagination';

export const metadata: Metadata = {
  title: 'Customers'
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

  const customers = await fetchCustomers({
    query,
    page: currentPage.toString()
  });
  const totalCustomers = await fetchTotalCustomers();

  return (
    <main>
      <div className="flex w-full items-center justify-between mb-8">
        <h1 className={`${lusitana.className}  text-xl md:text-2xl`}>
          Customers
        </h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search customers..." />
        <CreateCustomer />
      </div>
      <Suspense key={query + currentPage} fallback={<div>Loading...</div>}>
        <CustomersTable customers={customers} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={Math.ceil(totalCustomers / 10)} />
      </div>
    </main>
  );
}

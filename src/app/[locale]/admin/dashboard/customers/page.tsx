import { fetchFilteredCustomers } from '@/app/[locale]/admin/lib/data';
import CustomersTable from '@/app/[locale]/admin/ui/customers/table';
import { Metadata } from 'next';

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

  const customers = await fetchFilteredCustomers(query);

  return (
    <main>
      <CustomersTable customers={customers} />
    </main>
  );
}

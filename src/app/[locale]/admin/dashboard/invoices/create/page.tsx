import { fetchCustomers } from '@/app/[locale]/admin/lib/data';
import Form from '@/app/[locale]/admin/ui/invoices/create-form';
import Breadcrumbs from '@/app/[locale]/admin/ui/invoices/breadcrumbs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Invoice'
};

export default async function Page() {
  const customers = await fetchCustomers();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          {
            label: 'Create Invoice',
            href: '/dashboard/invoices/create',
            active: true
          }
        ]}
      />
      <Form customers={customers} />
    </main>
  );
}

import Form from '@/app/admin/ui/customers/create-form';
import Breadcrumbs from '@/app/admin/ui/invoices/breadcrumbs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Customer'
};

export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Customers', href: '/admin/dashboard/customers' },
          {
            label: 'Create Customer',
            href: '/admin/dashboard/customers/create',
            active: true
          }
        ]}
      />
      <Form />
    </main>
  );
}

import Form from '@/app/[locale]/admin/ui/products/create-form';
import Breadcrumbs from '@/app/[locale]/admin/ui/invoices/breadcrumbs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Invoice'
};

export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Products', href: '/admin/dashboard/products' },
          {
            label: 'Create Product',
            href: '/admin/dashboard/products/create',
            active: true
          }
        ]}
      />
      <Form />
    </main>
  );
}

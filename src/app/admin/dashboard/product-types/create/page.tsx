import Form from '@/app/admin/ui/product-types/create-form';
import Breadcrumbs from '@/app/admin/ui/invoices/breadcrumbs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Product Type'
};

export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Product Types', href: '/admin/dashboard/product-types' },
          {
            label: 'Create Product Type',
            href: '/admin/dashboard/product-types/create',
            active: true
          }
        ]}
      />
      <Form />
    </main>
  );
}

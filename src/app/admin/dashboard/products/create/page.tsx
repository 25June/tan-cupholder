import Form from '@/app/admin/ui/products/create-form';
import Breadcrumbs from '@/app/admin/ui/invoices/breadcrumbs';
import { Metadata } from 'next';
import { getProductTypes } from '@/app/admin/lib/actions/productTypes.actions';

export const metadata: Metadata = {
  title: 'Create Invoice'
};

export default async function Page() {
  const productTypes = await getProductTypes();

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
      <Form productTypes={productTypes} />
    </main>
  );
}

import Form from '@/app/admin/ui/products/create-form';
import Breadcrumbs from '@/app/admin/ui/invoices/breadcrumbs';
import { Metadata } from 'next';
import { getProductTypes } from '@/app/admin/lib/actions/product-types.actions';

export const metadata: Metadata = {
  title: 'Create Invoice'
};

export default async function Page() {
  const productTypes = await getProductTypes({
    query: '',
    page: '0'
  });

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

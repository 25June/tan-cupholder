import Form from '@/app/admin/ui/products/update-form';
import Breadcrumbs from '@/app/admin/ui/invoices/breadcrumbs';
import { fetchProductById } from '@/app/admin/lib/data';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Product'
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const product = await fetchProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Products', href: '/admin/dashboard/products' },
          {
            label: 'Edit Product',
            href: `/admin/dashboard/products/${id}/edit`,
            active: true
          }
        ]}
      />
      <Form product={product} />
    </main>
  );
}

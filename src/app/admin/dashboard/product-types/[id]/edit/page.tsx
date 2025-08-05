import Form from '@/app/admin/ui/product-types/update-form';
import Breadcrumbs from '@/app/admin/ui/invoices/breadcrumbs';
import { getProductTypeById } from '@/app/admin/lib/actions/product-types.actions';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Product Type'
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const productType = await getProductTypeById(id);

  if (!productType) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Product Types', href: '/admin/dashboard/product-types' },
          {
            label: 'Edit Product Type',
            href: `/admin/dashboard/product-types/${id}/edit`,
            active: true
          }
        ]}
      />
      <Form productType={productType} />
    </main>
  );
}

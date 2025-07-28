import Breadcrumbs from '@/app/admin/ui/invoices/breadcrumbs';
import { fetchProductById } from '@/app/admin/lib/data';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import UpdateImageForm from '@/app/admin/ui/products/update-image-form';

export const metadata: Metadata = {
  title: 'Edit Product Images'
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const { product, images } = await fetchProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Products', href: '/admin/dashboard/products' },
          {
            label: 'Edit Product Images',
            href: `/admin/dashboard/products/${id}/edit-image`,
            active: true
          }
        ]}
      />
      <UpdateImageForm product={product} images={images} />
    </main>
  );
}

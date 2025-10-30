import { Metadata } from 'next';
import { lusitana } from '@/app/admin/ui/fonts';
import UpdateProductTagForm from '@/app/admin/ui/product-tags/update-form';
import { getProductTagById } from '@/app/admin/lib/actions/product-tags.actions';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Edit Product Tag'
};

export default async function Page({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const productTag = await getProductTagById(id);
  if (!productTag) notFound();

  return (
    <main>
      <div className="flex w-full items-center justify-between mb-8">
        <h1 className={`${lusitana.className}  text-xl md:text-2xl`}>
          Edit Product Tag
        </h1>
      </div>
      <UpdateProductTagForm productTag={productTag} />
    </main>
  );
}

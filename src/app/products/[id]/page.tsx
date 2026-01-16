import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { publicFetchProductById } from '@/app/lib/public-products.actions';
import ProductPageClient from './ProductPageClient';
import RelatedProductsServer from './RelatedProductsServer';
import RelatedProductsSkeleton from './RelatedProductsSkeleton';

interface Props {
  params: Promise<{ id: string }>;
}

// Main page component - Server Component with streaming
export default async function ProductPage({ params }: Props) {
  const { id } = await params;

  const data = await publicFetchProductById(id);

  if (!data) {
    notFound();
  }

  const { product, images, productType, tags } = data;
  return (
    <ProductPageClient
      product={product}
      images={images}
      productType={productType}
      productId={id}
      tags={tags}
    >
      {/* Related products stream in via Suspense */}
      <Suspense fallback={<RelatedProductsSkeleton />}>
        <RelatedProductsServer />
      </Suspense>
    </ProductPageClient>
  );
}

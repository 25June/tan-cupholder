import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { fetchProductById } from '@/app/admin/lib/actions/products.actions';
import Footer from '@/components/footer/Footer';
import ProductPageClient from './ProductPageClient';
import RelatedProductsServer from './RelatedProductsServer';
import RelatedProductsSkeleton from './RelatedProductsSkeleton';

interface Props {
  params: Promise<{ id: string }>;
}

// Main page component - Server Component with streaming
export default async function ProductPage({ params }: Props) {
  const { id } = await params;

  const data = await fetchProductById(id);

  if (!data) {
    notFound();
  }

  const { product, images, productType } = data;

  return (
    <div className="min-h-screen">
      <ProductPageClient
        product={product}
        images={images}
        productType={productType}
        productId={id}
      >
        {/* Related products stream in via Suspense */}
        <Suspense fallback={<RelatedProductsSkeleton />}>
          <RelatedProductsServer />
        </Suspense>
      </ProductPageClient>

      <div className="mt-8 md:mt-24">
        <Footer />
      </div>
    </div>
  );
}

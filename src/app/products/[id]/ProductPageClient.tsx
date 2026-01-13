'use client';

import { useState } from 'react';
import StaticMenuBar from '@/components/menu-bar/StaticMenuBar';
import Breadcrumbs from '@/app/admin/ui/invoices/breadcrumbs';
import ProductDetailClient from './ProductDetailClient';
import { Product } from '@/models/product';
import { Image as ImageType } from '@/models/image';
import { ProductType } from '@/models/productType';
import { ProductTag } from '@/models/productTag';

interface Props {
  readonly product: Product;
  readonly images: ImageType[];
  readonly productType: ProductType | null;
  readonly productId: string;
  readonly tags: ProductTag[];
  readonly children: React.ReactNode; // Related products (streamed from server)
}

// Client wrapper that manages cart state between menu bar and product detail
export default function ProductPageClient({
  product,
  images,
  productType,
  productId,
  tags,
  children
}: Props) {
  const [triggerCartCount, setTriggerCartCount] = useState<number>(Date.now());

  const handleCartUpdate = () => {
    setTriggerCartCount(Date.now());
  };

  return (
    <main className="relative h-full flex flex-col justify-between mt-4 md:mt-24 p-4">
      {/* Breadcrumb navigation */}
      <nav className="w-full max-w-7xl mx-auto" aria-label="Breadcrumb">
        <Breadcrumbs
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Products', href: '/products' },
            {
              label: product.name,
              href: `/products/${productId}`,
              active: true
            }
          ]}
        />
      </nav>

      {/* Product details */}
      <ProductDetailClient
        product={product}
        images={images}
        productType={productType}
        onCartUpdate={handleCartUpdate}
        tags={tags}
      />

      {/* Related products - Streamed from server via children */}
      {children}
    </main>
  );
}

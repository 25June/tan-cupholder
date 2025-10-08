'use client';

import { useEffect } from 'react';
import SliderContainer from '@/components/product-slider/SliderContainer';
import { useGetOtherProducts } from '@/hooks/useGetOtherProducts';
import Spinner from '@/components/spinner/Spinner';

export default function RelatedProducts() {
  const { products, loading, onFetchOtherProducts } = useGetOtherProducts();

  useEffect(() => {
    onFetchOtherProducts();
  }, []);
  return (
    <section className="mx-auto space-y-12 px-4">
      <h2 className="text-2xl font-bold mb-2 text-center text-logo-orange-border">
        Related Products
      </h2>
      {loading && <Spinner />}
      <div>
        <SliderContainer products={products} />
      </div>
    </section>
  );
}

'use client';

import StaticMenuBar from '@/components/menu-bar/StaticMenuBar';
import ProductDetailSkeleton from '@/components/skeleton/ProductDetail.skeleton';
import { useEffect } from 'react';
import Image from 'next/image';
import { useProduct } from '@/hooks/useProduct';
import { useParams } from 'next/navigation';
import Quantity from '@/components/quantity/Quantity';
import { formatPrice } from '@/shared/utils/formatPrice';
import { calculatePercent } from '@/shared/utils/formatNumber';
import Footer from '@/components/footer/Footer';
import { getImageUrl } from '@/shared/utils/getImageUrl';

export default function ProductPage() {
  const { id } = useParams();
  const { product, isLoading, onGetProduct, images } = useProduct();

  useEffect(() => {
    if (typeof id === 'string') {
      onGetProduct(id);
    }
  }, [id]);
  const mainImage = images.find((img) => img.isMain);

  return (
    <div className="min-h-screen">
      <StaticMenuBar />

      <div className="relative h-full flex flex-col justify-between mt-8 md:mt-24 p-4">
        {isLoading && <ProductDetailSkeleton />}
        {product && (
          <div className="w-full max-w-7xl mx-auto flex gap-12 flex-col md:flex-row">
            <div className="flex flex-1 gap-4 flex-col-reverse md:flex-row">
              <div className="shrink-0 max-h-[600px] overflow-auto hidden md:flex flex-row md:flex-col gap-2">
                {images.map((img, index) => (
                  <div
                    key={index}
                    className="w-12 h-12 rounded-md cursor-pointer transition-transform hover:scale-105"
                  >
                    <Image
                      src={getImageUrl(product.id, img.name)}
                      alt={img.name}
                      width={600}
                      height={600}
                    />
                  </div>
                ))}
              </div>
              <div className="w-full h-full">
                {mainImage && (
                  <Image
                    src={getImageUrl(product.id, mainImage.name)}
                    alt={mainImage.name}
                    width={600}
                    height={600}
                    className="rounded-md"
                  />
                )}
              </div>
            </div>
            <div className="flex-1 mt-4 flex flex-col gap-4 justify-between">
              <div>
                <h1 className="text-5xl font-bold mb-4">{product.name}</h1>
                <div className="flex items-center gap-4 mb-6">
                  <h3 className="text-3xl font-bold text-slate-400 ">
                    {formatPrice(
                      calculatePercent(product.price, product.sale),
                      ''
                    )}
                  </h3>
                  <h5 className="text-slate-400 line-through decoration-slate-400">
                    {formatPrice(product.price, '')}
                  </h5>
                </div>
                <div className="mb-4">{product.description}</div>
              </div>
              <div>
                <Quantity />
                <div className="flex gap-4 mt-4">
                  <button className="btn btn-primary btn-md btn-outline flex-1">
                    Add to Cart
                  </button>
                  <button className="btn btn-primary btn-md flex-1">
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="mt-8 md:mt-24">
        <Footer />
      </div>
    </div>
  );
}

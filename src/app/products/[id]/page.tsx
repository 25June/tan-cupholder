'use client';

import StaticMenuBar from '@/components/menu-bar/StaticMenuBar';
import ProductDetailSkeleton from '@/components/skeleton/ProductDetail.skeleton';
import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useProduct } from '@/hooks/useProduct';
import { useParams, useRouter } from 'next/navigation';
import Quantity from '@/components/quantity/Quantity';
import { formatPrice } from '@/shared/utils/formatPrice';
import { calculatePercent } from '@/shared/utils/formatNumber';
import Footer from '@/components/footer/Footer';
import { getImageUrl } from '@/shared/utils/getImageUrl';
import { Image as ImageType } from '@/models/image';
import DynamicShape from '@/components/icons/shapes/DynamicShape';
import Breadcrumbs from '@/app/admin/ui/invoices/breadcrumbs';
import { getRandomImageArr } from '@/shared/utils/getRandom';
import {
  getCartFromStorage,
  saveProductToCart,
  saveViewedProductToStorage
} from '@/shared/utils/storage';
import RelatedProducts from '@/components/related-products/RelatedProducts';
import Link from 'next/link';
import CDNImage from '@/components/cdn-image/CDNImage';

export default function ProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const { product, isLoading, onGetProduct, images, productType } =
    useProduct();

  const [triggerCartCount, setTriggerCartCount] = useState<number>(Date.now());
  const [quantity, setQuantity] = useState<number>(1);
  const [isAddedToCart, setIsAddedToCart] = useState<boolean>(false);

  const mainImage = images.find((img) => img.isMain);
  const [selectedImage, setSelectedImage] = useState<ImageType | null>(
    mainImage || null
  );

  useEffect(() => {
    if (typeof id === 'string') {
      onGetProduct(id).then(() => {
        saveViewedProductToStorage(id);
      });
      const cart = getCartFromStorage();
      setIsAddedToCart(
        cart.some((item: { productId: string }) => item.productId === id)
      );
    }
  }, [id]);

  useEffect(() => {
    setSelectedImage(mainImage || null);
  }, [mainImage]);

  const randomArr = useMemo(() => {
    return !isLoading && product
      ? getRandomImageArr(3, images, product.id)
      : [];
  }, [isLoading, product, images]);

  const handleAddToCart = (productId: string) => {
    saveProductToCart(productId, quantity);
    setTriggerCartCount(triggerCartCount + 1);
    setIsAddedToCart(true);
  };

  return (
    <div className="min-h-screen">
      <StaticMenuBar triggerCartCount={triggerCartCount} />

      <main className="relative h-full flex flex-col justify-between mt-4 md:mt-24 p-4">
        <div className="w-full max-w-7xl mx-auto">
          <Breadcrumbs
            breadcrumbs={[
              { label: 'Home', href: '/' },
              { label: 'Products', href: '/products' },
              {
                label: product?.name || '',
                href: `/products/${id}`,
                active: true
              }
            ]}
          />
        </div>
        {isLoading && <ProductDetailSkeleton />}
        {product && (
          <div className="w-full max-w-7xl mx-auto flex gap-12 flex-col md:flex-row">
            <div className="flex flex-1 gap-4 flex-col-reverse md:flex-row">
              <div className="shrink-0 md:h-full max-h-24 md:max-h-88 w-full md:max-w-24 overflow-auto flex flex-row md:flex-col gap-2">
                {images.map((img, index) => (
                  <div
                    key={index}
                    className="w-full max-w-full md:max-w-24 min-w-12 h-12 md:h-full flex justify-center items-center rounded-md cursor-pointer transition-transform hover:scale-105"
                  >
                    <div
                      className={`w-full md:h-full bg-gray-100 rounded-md max-h-full flex justify-center items-center md:max-h-56 relative p-1 md:p-2`}
                    >
                      <button
                        onClick={() => setSelectedImage(img)}
                        className="h-10 md:h-full"
                      >
                        <CDNImage
                          src={getImageUrl(product.id, img.name)}
                          alt={img.name}
                          width={700}
                          height={700}
                          className="object-contain w-full h-full"
                        />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="w-full h-88 bg-gray-100 p-2 rounded-md">
                {selectedImage && (
                  <CDNImage
                    src={getImageUrl(product.id, selectedImage.name)}
                    alt={selectedImage.name}
                    width={700}
                    height={700}
                    className="object-contain w-full h-full"
                  />
                )}
              </div>
            </div>
            <div className="flex-1 mt-2 md:mt-4 flex flex-col gap-4 justify-between">
              <div>
                <h1 className="text-2xl md:text-5xl font-bold mb-4">
                  {product.name}
                </h1>
                <div className="flex items-center gap-4 mb-6">
                  <h3 className="text-xl md:text-3xl font-bold text-slate-400 ">
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
                <Quantity setQuantity={setQuantity} quantity={quantity} />
                <div className="flex gap-4 mt-4">
                  <button
                    className="btn btn-primary btn-md btn-outline flex-1"
                    onClick={() => handleAddToCart(product.id)}
                    disabled={isAddedToCart}
                  >
                    {isAddedToCart ? 'Added to Cart' : 'Add to Cart'}
                  </button>
                  <Link
                    className="btn btn-primary btn-md flex-1"
                    href={`/payment/${id}?quantity=${quantity}`}
                    prefetch={true}
                  >
                    Buy Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <article className="mt-8 md:mt-24">
        <section className="max-w-4xl mx-auto space-y-12 px-6 mb-16">
          <p className="text-lg text-gray-700 leading-relaxed first-letter:text-4xl first-letter:font-serif first-letter:mr-2 first-letter:float-left first-letter:text-primary">
            {product?.description ||
              `Our premium cup holder is designed with both style and functionality
            in mind. Cra
            fted from high-quality materials, this elegant solution
            keeps your beverages secure and within easy reach. The sturdy
            construction ensures stability for cups and mugs of various sizes,
            while the sleek design complements any interior décor.`}
          </p>
          <div className="flex flex-row gap-4 justify-center w-full h-full">
            {randomArr.map(({ mediaUrl, shapeIndex }) => {
              return (
                <DynamicShape
                  key={shapeIndex}
                  imageUrl={mediaUrl}
                  shapeIndex={shapeIndex}
                />
              );
            })}
          </div>

          <p className="text-lg text-gray-700 leading-relaxed border-l-4 border-primary pl-6 italic">
            {productType?.description ||
              `The innovative design features a non-slip base and protective
            padding to prevent scratches on your furniture. Whether you're
            working at your desk, relaxing on your couch, or entertaining
            guests, this cup holder provides the perfect balance of convenience
            and protection. The carefully considered dimensions allow for easy
            storage when not in use, making it an ideal accessory for any space.`}
          </p>

          <p className="text-lg text-gray-700 leading-relaxed bg-gray-50 p-6 rounded-lg shadow-sm">
            Maintenance is effortless with our cup holder's water-resistant
            surface that can be easily wiped clean. The durable materials ensure
            long-lasting performance, making this an investment in both
            convenience and peace of mind. Experience the perfect blend of form
            and function with our thoughtfully designed cup holder that makes
            beverage management a breeze.
          </p>
        </section>
        <RelatedProducts />
      </article>
      <div className="mt-8 md:mt-24">
        <Footer />
      </div>
    </div>
  );
}

'use client';

import StaticMenuBar from '@/components/menu-bar/StaticMenuBar';
import ProductDetailSkeleton from '@/components/skeleton/ProductDetail.skeleton';
import { useEffect, useState } from 'react';
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

export default function ProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const { product, isLoading, onGetProduct, images, productType } =
    useProduct();

  const [quantity, setQuantity] = useState<number>(1);

  const mainImage = images.find((img) => img.isMain);
  const [selectedImage, setSelectedImage] = useState<ImageType | null>(
    mainImage || null
  );

  useEffect(() => {
    if (typeof id === 'string') {
      onGetProduct(id);
    }
  }, [id]);

  useEffect(() => {
    setSelectedImage(mainImage || null);
  }, [mainImage]);

  return (
    <div className="min-h-screen">
      <StaticMenuBar />

      <div className="relative h-full flex flex-col justify-between mt-8 md:mt-24 p-4">
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
              <div className="shrink-0 max-h-88 overflow-auto hidden md:flex flex-row md:flex-col gap-2">
                {images.map((img, index) => (
                  <div
                    key={index}
                    className="w-full max-w-24 h-full flex justify-center items-center rounded-md cursor-pointer transition-transform hover:scale-105"
                  >
                    <div
                      className={`w-full h-full bg-gray-100 rounded-md max-h-56 relative p-2`}
                    >
                      <button onClick={() => setSelectedImage(img)}>
                        <Image
                          src={getImageUrl(product.id, img.name)}
                          alt={img.name}
                          width={600}
                          height={600}
                          className="object-contain w-full h-full"
                        />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="w-full h-full max-h-88 bg-gray-50 p-2 rounded-md">
                {selectedImage && (
                  <Image
                    src={getImageUrl(product.id, selectedImage.name)}
                    alt={selectedImage.name}
                    width={600}
                    height={600}
                    className="object-contain w-full h-full "
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
                <Quantity setQuantity={setQuantity} quantity={quantity} />
                <div className="flex gap-4 mt-4">
                  <button className="btn btn-primary btn-md btn-outline flex-1">
                    Add to Cart
                  </button>
                  <button
                    className="btn btn-primary btn-md flex-1"
                    onClick={() => {
                      router.push(`/payment/${id}?quantity=${quantity}`);
                    }}
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="mt-8 md:mt-24">
        <div className="max-w-4xl mx-auto space-y-12 px-6">
          <p className="text-lg text-gray-700 leading-relaxed first-letter:text-4xl first-letter:font-serif first-letter:mr-2 first-letter:float-left first-letter:text-primary">
            {product?.description ||
              `Our premium cup holder is designed with both style and functionality
            in mind. Crafted from high-quality materials, this elegant solution
            keeps your beverages secure and within easy reach. The sturdy
            construction ensures stability for cups and mugs of various sizes,
            while the sleek design complements any interior décor.`}
          </p>
          <div className="flex flex-row gap-4 justify-center w-full h-full">
            {product && (
              <>
                {getRandomImageArr(3, images.length).map((item) => (
                  <div
                    key={item.imageIndex}
                    className="max-w-24 m-0 w-full h-full"
                  >
                    <DynamicShape
                      imageUrl={getImageUrl(
                        product.id,
                        images[item.imageIndex].name
                      )}
                      // shapeIndex={}
                    />
                  </div>
                ))}
              </>
            )}
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
        </div>
      </div>
      <div className="mt-8 md:mt-24">
        <Footer />
      </div>
    </div>
  );
}

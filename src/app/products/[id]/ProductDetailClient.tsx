'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Quantity from '@/components/quantity/Quantity';
import { formatPrice } from '@/shared/utils/formatPrice';
import { calculatePercent } from '@/shared/utils/formatNumber';
import ImageGallery from '@/components/image-gallery/ImageGallery';
import { Image as ImageType } from '@/models/image';
import { Product } from '@/models/product';
import { ProductType } from '@/models/productType';
import DynamicShape from '@/components/icons/shapes/DynamicShape';
import { getRandomImageArr } from '@/shared/utils/getRandom';
import {
  getCartFromStorage,
  saveProductToCart,
  saveViewedProductToStorage
} from '@/shared/utils/storage';
import { ProductTag } from '@/models/productTag';

interface Props {
  readonly product: Product;
  readonly images: ImageType[];
  readonly productType: ProductType | null;
  readonly onCartUpdate?: () => void;
  readonly tags: ProductTag[];
}

// Purchase actions component
const PurchaseActions = ({
  product,
  onCartUpdate
}: {
  product: Product;
  onCartUpdate?: () => void;
}) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [isAddedToCart, setIsAddedToCart] = useState<boolean>(false);

  // Check if product is already in cart on mount
  useEffect(() => {
    const cart = getCartFromStorage();
    setIsAddedToCart(
      cart.some((item: { productId: string }) => item.productId === product.id)
    );
  }, [product.id]);

  const handleAddToCart = () => {
    saveProductToCart(product.id, quantity);
    setIsAddedToCart(true);
    onCartUpdate?.();
  };

  return (
    <div>
      <Quantity setQuantity={setQuantity} quantity={quantity} />
      <div className="flex gap-4 mt-4">
        <button
          className="btn btn-primary btn-md btn-outline flex-1"
          onClick={handleAddToCart}
          disabled={isAddedToCart}
        >
          {isAddedToCart ? 'Added to cart' : 'Add to cart'}
        </button>
        <Link
          className="btn btn-primary btn-md flex-1"
          href={`/payment/${product.id}?quantity=${quantity}`}
          prefetch={true}
        >
          Book now
        </Link>
      </div>
    </div>
  );
};

export default function ProductDetailClient({
  product,
  images,
  productType,
  onCartUpdate,
  tags
}: Props) {
  // Save viewed product on mount
  useEffect(() => {
    saveViewedProductToStorage(product.id);
  }, [product.id]);

  // Generate random image shapes for decoration
  const randomArr = useMemo(() => {
    return getRandomImageArr(3, images, product.id);
  }, [images, product.id]);

  const autoDescription = useMemo(() => {
    try {
      const description = JSON.parse(product.description);
      if (
        !description.productDescription ||
        !description.productAppearance ||
        !description.productPromise
      ) {
        return {
          productDescription: '',
          productAppearance: '',
          productPromise: ''
        };
      }
      return {
        productDescription: description.productDescription,
        productAppearance: description.productAppearance,
        productPromise: description.productPromise
      };
    } catch {
      // Fallback to empty strings if JSON parsing fails
      return {
        productDescription: '',
        productAppearance: '',
        productPromise: ''
      };
    }
  }, [product.description]);

  return (
    <>
      {/* Product detail section */}
      <section className="w-full max-w-7xl mx-auto flex gap-12 flex-col md:flex-row items-center">
        <ImageGallery product={product} images={images} />

        <div className="flex-1 flex flex-col gap-4 justify-between">
          <div>
            <h1 className="text-2xl md:text-5xl font-bold mb-4">
              {product.name}
            </h1>
            <div className="flex items-center gap-4 mb-2">
              {tags.map((tag) => (
                <span
                  key={tag.id}
                  className={`text-xs p-2 rounded-lg font-semibold`}
                  style={{ backgroundColor: tag.color || '#000000' }}
                >
                  {tag.name}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-4 mb-2">
              <span className="text-xl md:text-3xl font-bold text-logo-orange-border">
                {formatPrice(calculatePercent(product.price, product.sale), '')}
              </span>
              <span className="text-slate-400 line-through decoration-slate-400">
                {formatPrice(product.price, '')}
              </span>
            </div>

            <p>{product.shortDescription}</p>
          </div>
          <PurchaseActions product={product} onCartUpdate={onCartUpdate} />
        </div>
      </section>

      {/* Product article section */}
      <article className="mt-8 md:mt-24">
        <section className="max-w-4xl mx-auto space-y-12 px-6 mb-16">
          <p className="text-lg text-gray-700 leading-relaxed first-letter:text-4xl first-letter:font-serif first-letter:mr-2 first-letter:float-left first-letter:text-primary">
            {autoDescription.productDescription ||
              `Our premium cup holder is designed with both style and functionality
            in mind. Crafted from high-quality materials, this elegant solution
            keeps your beverages secure and within easy reach. The sturdy
            construction ensures stability for cups and mugs of various sizes,
            while the sleek design complements any interior décor.`}
          </p>

          {/* Decorative image shapes */}
          <div className="flex flex-row gap-4 justify-center w-full h-full">
            {randomArr.map(({ mediaUrl, shapeIndex }) => (
              <DynamicShape
                key={shapeIndex}
                imageUrl={mediaUrl}
                shapeIndex={shapeIndex}
              />
            ))}
          </div>

          <blockquote
            className="text-lg text-gray-700 leading-relaxed border-r-4 border-primary rounded-lg pr-6 italic"
            style={{ textAlign: 'right' }}
          >
            {autoDescription.productAppearance ||
              `The innovative design features a non-slip base and protective
            padding to prevent scratches on your furniture. Whether you're
            working at your desk, relaxing on your couch, or entertaining
            guests, this cup holder provides the perfect balance of convenience
            and protection. The carefully considered dimensions allow for easy
            storage when not in use, making it an ideal accessory for any space.`}
          </blockquote>

          <blockquote className="text-lg text-gray-700 leading-relaxed border-l-4 border-primary pl-6 italic">
            {autoDescription.productPromise ||
              `The innovative design features a non-slip base and protective
            padding to prevent scratches on your furniture. Whether you're
            working at your desk, relaxing on your couch, or entertaining
            guests, this cup holder provides the perfect balance of convenience
            and protection. The carefully considered dimensions allow for easy
            storage when not in use, making it an ideal accessory for any space.`}
          </blockquote>

          <p className="text-lg text-gray-700 leading-relaxed bg-logo-orange-pale-companion p-6 rounded-lg shadow-sm">
            {productType?.description ||
              `Maintenance is effortless with our cup holder's water-resistant
            surface that can be easily wiped clean. The durable materials ensure
            long-lasting performance, making this an investment in both
            convenience and peace of mind. Experience the perfect blend of form
            and function with our thoughtfully designed cup holder that makes
            beverage management a breeze.`}
          </p>
        </section>
      </article>
    </>
  );
}

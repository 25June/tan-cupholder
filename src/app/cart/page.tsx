'use client';

import { useEffect, useState, memo, useMemo } from 'react';
import {
  useGetProductsFromCart,
  ProductWithQuantity
} from '@/hooks/useGetProductsFromcart';
import Footer from '@/components/footer/Footer';
import StaticMenuBar from '@/components/menu-bar/StaticMenuBar';
import { getImageUrl } from '@/shared/utils/getImageUrl';
import Image from 'next/image';
import { formatPrice } from '@/shared/utils/formatPrice';
import Quantity from '@/components/quantity/Quantity';
import { TrashIcon } from '@heroicons/react/24/outline';
import Spinner from '@/components/spinner/Spinner';
import Link from 'next/link';

const ProductCard = memo(
  ({
    product,
    onUpdateQuantity
  }: {
    product: ProductWithQuantity;
    onUpdateQuantity: (productId: string, quantity: number) => void;
  }) => {
    const [quantity, setQuantity] = useState<number>(1);

    useEffect(() => {
      const id = setTimeout(() => {
        onUpdateQuantity(product.id, quantity);
      }, 1000);
      return () => clearTimeout(id);
    }, [quantity]);

    return (
      <div className="border border-gray-200 rounded-lg p-4 flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 grow">
          <div className="h-32 w-24 rounded-lg overflow-hidden shrink-0">
            <Image
              src={getImageUrl(product.id, product.product_image.name)}
              alt={product.name}
              width={300}
              height={400}
              className="object-cover h-32 w-24"
            />
          </div>
          <div className="flex flex-col gap-2 justify-between">
            <div>
              <p className="text-gray-500 text-sm font-bold mb-1">
                {product.name}
              </p>
              <p className="text-gray-500 text-sm mb-2">
                {formatPrice(product.price, 'VND')}
              </p>
            </div>

            <Quantity setQuantity={setQuantity} quantity={quantity} size="sm" />
          </div>
        </div>
        <div className="shrink-0">
          <button
            onClick={() => {
              console.log('delete');
            }}
            className="rounded-md border hover:bg-red-500 hover:text-white text-red-500 p-2 transition-all duration-300"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.product.quantity === nextProps.product.quantity;
  }
);

export default function CartPage() {
  const { products, loading, onUpdateQuantity } = useGetProductsFromCart();
  const { totalAmount, totalQuantity } = Object.values(products).reduce(
    (acc, product) => {
      return {
        totalAmount: acc.totalAmount + product.price * product.quantity,
        totalQuantity: acc.totalQuantity + product.quantity
      };
    },
    { totalAmount: 0, totalQuantity: 0 }
  );
  const productIds = useMemo(() => {
    return Object.keys(products);
  }, [products]);
  return (
    <div className="flex flex-col min-h-screen">
      <StaticMenuBar triggerCartCount={1} />
      <main className="max-w-7xl w-full p-4 mx-auto grow flex flex-col md:flex-row gap-4">
        <section className="flex flex-col gap-4 w-full flex-grow">
          <h1 className="text-3xl font-bold mb-4 text-center mt-12 uppercase">
            Cart
          </h1>
          {loading && <Spinner />}
          {!loading && productIds.length === 0 && (
            <div className="text-center text-xl ">
              <p className="mb-4">No products in cart</p>
              <Link
                href="/products"
                className="btn btn-primary btn-lg w-full text-white"
              >
                Let's shopping
              </Link>
            </div>
          )}
          {productIds.map((productId) => (
            <ProductCard
              key={productId}
              product={products[productId]}
              onUpdateQuantity={onUpdateQuantity}
            />
          ))}
        </section>
        <section className="max-w-full md:max-w-[300px] w-full">
          <h2 className="text-3xl font-bold mb-8 text-center mt-12 uppercase">
            Total
          </h2>
          <div className="border border-gray-200 rounded-lg p-4 w-full max-w-full md:max-w-[300px]">
            {Object.values(products).map((product) => (
              <div
                key={product.id}
                className="grid grid-cols-[50%_10%_auto] gap-4 py-2"
              >
                <p className="text-sm">{product.name}</p>
                <p className="text-sm">x {product.quantity}</p>
                <p className="text-sm">
                  {formatPrice(product.price * product.quantity, 'VND')}
                </p>
              </div>
            ))}
            <div className="mt-4 flex justify-between">
              <span className="text-sm font-bold ">Total amount:</span>
              <span className="text-lg font-bold text-right">
                {totalQuantity}
              </span>
            </div>
            <div className="mb-4 flex justify-between">
              <span className="text-sm font-bold ">Total price:</span>
              <span className="text-lg font-bold text-right">
                {formatPrice(totalAmount, 'VND')}
              </span>
            </div>

            <Link
              href="/payment"
              className="btn btn-primary btn-lg w-full text-white"
            >
              Checkout
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

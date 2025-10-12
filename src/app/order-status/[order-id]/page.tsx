'use client';

import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { useGetOrderProgress } from '@/hooks/useGetOrderProgress';
import PageLoader from '@/components/page-loader/PageLoader';
import { ORDER_STATUSES } from '@/constants/common';
import { getImageUrl } from '@/shared/utils/getImageUrl';
import Image from 'next/image';
import { formatPrice } from '@/shared/utils/formatPrice';
import { OrderProduct } from '@/models/order';
import { useGetOtherProducts } from '@/hooks/useGetOtherProducts';
import Spinner from '@/components/spinner/Spinner';
import StaticMenuBar from '@/components/menu-bar/StaticMenuBar';
import Link from 'next/link';
import Footer from '@/components/footer/Footer';
import CDNImage from '@/components/cdn-image/CDNImage';

export default function OrderStatusPage() {
  // const t = useTranslations('OrderStatusPage');
  const params = useParams();
  const orderId = params['order-id'] as string;
  const {
    order,
    products: orderProducts,
    loading,
    onFetchOrderProgress
  } = useGetOrderProgress();
  const {
    products: otherProducts,
    loading: otherProductsLoading,
    onFetchOtherProducts
  } = useGetOtherProducts();
  useEffect(() => {
    if (orderId) {
      onFetchOrderProgress(orderId);
      onFetchOtherProducts();
    }
  }, [orderId]);

  if (loading) {
    return <PageLoader />;
  }

  if (!order) {
    return <div>Order not found</div>;
  }

  const activeStatusIndex = ORDER_STATUSES.findIndex(
    (status) => status.id === order.status
  );

  return (
    <div className="w-full h-full relative">
      <StaticMenuBar triggerCartCount={1} />
      <div>
        <div className={`w-screen h-48 md:h-96`}>
          <CDNImage
            src={
              'https://pub-485637738840450490e408cee2acb72c.r2.dev/feature-images/IMG_7414.jpg'
            }
            alt={`hero-image-1`}
            width={1600}
            height={900}
            className="w-screen h-48 md:h-96 object-cover"
          />
        </div>
      </div>
      <main className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 relative z-1 pt-16 pb-16 px-4">
        <section className="col-span-1 md:col-span-2 border border-gray-200 rounded-lg p-4 bg-white">
          <h1 className="text-2xl font-bold tracking-wide">
            Thank You For Your Order!
          </h1>
          <div className="mt-4 flex flex-wrap gap-2 justify-between">
            <p className="text-gray-500 shrink-0">
              Order #{order?.id.slice(order?.id.length - 5)}
            </p>
            <p className="text-gray-500 text-right">
              {order?.created_at
                ? new Date(order?.created_at).toLocaleDateString('en-AU')
                : ''}
            </p>
          </div>
          <div className="flex justify-between items-center mt-4">
            <p className="text-gray-500">Total items</p>
            <p className="text-gray-500 font-bold">
              {order?.order_products?.reduce(
                (acc, product) => acc + product.quantity,
                0
              )}
            </p>
          </div>
          <div className="flex justify-between items-center mt-2">
            <p className="text-gray-500">Total price</p>
            <p className="text-gray-500 font-bold">
              {formatPrice(
                order?.order_products?.reduce(
                  (acc, product) =>
                    acc +
                    product.quantity *
                      (product.product_id
                        ? orderProducts[product.product_id].price
                        : product.price),
                  0
                ),
                'VND'
              )}
            </p>
          </div>
          <div className="mt-4">
            <p>Your Order is being processed</p>
            <ul className="steps w-full">
              {ORDER_STATUSES.map((status, index) => (
                <li
                  key={status.id}
                  className={`step ${
                    activeStatusIndex >= index ? 'step-primary' : ''
                  }`}
                >
                  {activeStatusIndex >= index ? status.name : ''}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mt-4">
            <div className="flex items-center justify-start space-x-4 w-full overflow-x-auto scrollbar-hide">
              {order.order_products?.map(
                (product: OrderProduct['order_products'][number]) => {
                  const productDetails = orderProducts[product.product_id];
                  return (
                    <div
                      className="flex-shrink-0 relative border border-gray-300 rounded-lg overflow-hidden"
                      key={product.id}
                    >
                      <div className="h-full max-h-64">
                        <Image
                          src={
                            productDetails?.image
                              ? getImageUrl(
                                  productDetails.id,
                                  productDetails.image.name
                                )
                              : '/cup.png'
                          }
                          alt={productDetails.name}
                          width={250}
                          height={500}
                          className="object-cover h-64 w-48 scale-110 hover:scale-100 transition-all duration-300"
                        />
                      </div>
                      <div className="flex-1 min-w-0 absolute bottom-0 left-0 h-32 w-full p-2 bg-gradient-to-b from-transparent to-white to-45% flex justify-between items-end">
                        <div>
                          <p className="text-xs text-gray-500">
                            {productDetails.type_name}
                          </p>
                          <h3 className="text-md font-medium text-gray-900">
                            {productDetails.name}
                          </h3>
                        </div>
                        <div className="shrink-0">
                          <span className="text-sm text-logo-orange font-bold">
                            x {product.quantity}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </section>
        <article className="col-span-1 border border-gray-200 rounded-lg p-4 bg-white">
          <div className="space-y-6">
            <h2 className="text-lg font-bold">Other Products</h2>
            {otherProductsLoading && <Spinner />}
            <div className="flex flex-col gap-4 max-h-[250px] md:max-h-[450px] overflow-y-auto light-mask py-2">
              {otherProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-2 w-full border border-gray-200 rounded-lg p-2"
                >
                  <div className="h-20 w-16 rounded-lg overflow-hidden shrink-0">
                    <Image
                      src={getImageUrl(product.id, product.product_image.name)}
                      alt={product.name}
                      width={300}
                      height={400}
                      className="object-cover h-20 w-16"
                    />
                  </div>

                  <div className="flex flex-col gap-1 grow">
                    <p className="text-gray-500 text-sm font-bold mb-1">
                      {product.name}
                    </p>
                    <div className="flex justify-between items-center gap-2 w-full">
                      <p className="text-gray-500 text-sm">
                        {formatPrice(product.price)}
                      </p>
                      <Link
                        href={`/products/${product.id}`}
                        prefetch={true}
                        className="btn btn-primary btn-soft btn-xs"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-4">
              <Link
                href="/products"
                prefetch={true}
                className="btn btn-primary btn-wide btn-soft btn-sm"
              >
                View All
              </Link>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}

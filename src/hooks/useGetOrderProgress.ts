'use client';

import { getOrderById } from '@/app/lib/public-order.actions';
import { OrderProduct } from '@/models/order';
import { OrderProductDetails } from '@/models/product';
import { useState } from 'react';

export const useGetOrderProgress = () => {
  const [order, setOrder] = useState<OrderProduct | null>(null);
  const [products, setProducts] = useState<Record<string, OrderProductDetails>>(
    {}
  );
  const [loading, setLoading] = useState<boolean>(false);
  const handleFetchOrderProgress = (orderId: string) => {
    if (!orderId) {
      return Promise.reject(new Error('Order ID is required'));
    }
    setLoading(true);
    return getOrderById(orderId)
      .then(({ order, products }) => {
        order && setOrder(order as OrderProduct);
        const productMap = products?.reduce((acc, product) => {
          return { ...acc, [product.id]: product };
        }, {} as Record<string, OrderProductDetails>);
        productMap && setProducts(productMap);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  // console.log({ products, order });

  return {
    order,
    products,
    loading,
    onFetchOrderProgress: handleFetchOrderProgress
  };
};

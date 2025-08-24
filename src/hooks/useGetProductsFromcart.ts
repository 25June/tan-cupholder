import { ProductResponse } from '@/models/product';
import { getCartFromStorage } from '@/shared/utils/storage';
import { useEffect, useState } from 'react';
import { publicFetchProductByIds } from '@/app/lib/public-products.actions';

export type ProductWithQuantity = ProductResponse & { quantity: number };

export const useGetProductsFromCart = () => {
  const [products, setProducts] = useState<Record<string, ProductWithQuantity>>(
    {}
  );
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const cart = getCartFromStorage();
    const { productIds, quantity } = cart.reduce(
      (
        acc: {
          productIds: string[];
          quantity: { [key: string]: number };
        },
        item: { productId: string; quantity: number }
      ) => {
        return {
          quantity: {
            ...acc.quantity,
            [item.productId]: item.quantity
          },
          productIds: acc.productIds.concat(item.productId)
        };
      },
      { productIds: [], quantity: {} }
    );

    if (productIds.length > 0) {
      setLoading(true);
      publicFetchProductByIds(productIds)
        .then((products) => {
          setProducts(
            products.reduce((acc, product) => {
              acc[product.id] = { ...product, quantity: quantity[product.id] };
              return acc;
            }, {} as Record<string, ProductWithQuantity>)
          );
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, []);

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    setProducts((prev) => {
      return {
        ...prev,
        [productId]: {
          ...prev[productId],
          quantity
        }
      };
    });
  };

  return { products, loading, onUpdateQuantity: handleUpdateQuantity };
};

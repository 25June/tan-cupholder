import { mockProducts } from '@/mocks/products';
import { useState } from 'react';
import { Product } from '@/models/product';

export const useProduct = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const handleGetProducts = () => {
    setIsLoading(true);
    const response = new Promise<Product[]>((resolve) => {
      setTimeout(() => {
        resolve(mockProducts);
      }, 1000);
    });

    response
      .then((value: Product[]) => {
        setProducts(value);
      })
      .finally(() => setIsLoading(false));
  };

  return { products, isLoading, onGetProducts: handleGetProducts };
};

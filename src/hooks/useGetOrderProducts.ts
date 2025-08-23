import { useState } from 'react';
import { ProductResponse } from '@/models/product';
import { publicFetchOtherProducts } from '@/app/lib/public-products.actions';

export const useGetOtherProducts = () => {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFetchOtherProducts = () => {
    setLoading(true);
    publicFetchOtherProducts()
      .then((products) => {
        setProducts(products as unknown as ProductResponse[]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return { products, loading, onFetchOtherProducts: handleFetchOtherProducts };
};

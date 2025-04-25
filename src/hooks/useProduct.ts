import { mockProducts } from '@/mocks/products';
import { useState } from 'react';
import { Product } from '@/models/product';

export const useProduct = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [limit] = useState<number>(8);
  const [page, setPage] = useState<number>(1);
  const [isEnd, setIsEnd] = useState<boolean>(false);

  const handleGetProducts = (keywords?: string) => {
    setIsLoading(true);
    const response = new Promise<Product[]>((resolve) => {
      setTimeout(() => {
        const nextPage = page + 1;
        setPage(nextPage);
        if (keywords) {
          resolve(
            mockProducts.filter((product) =>
              product.name
                .toLocaleLowerCase()
                .includes(keywords.toLocaleLowerCase())
            )
          );
        } else {
          const result = mockProducts.slice((page - 1) * limit, page * limit);
          resolve(result);
        }
      }, 1000);
    });

    return response
      .then((value: Product[]) => {
        if (value.length === 0) {
          setIsEnd(true);
        }
        setProducts((prev) => [...prev, ...value]);
      })
      .finally(() => setIsLoading(false));
  };

  return { products, isLoading, onGetProducts: handleGetProducts, isEnd };
};

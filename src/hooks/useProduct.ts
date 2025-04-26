import { useState } from 'react';
import { Product, GetProductsResponse } from '@/models/product';
import { getProducts } from '@/api/product';

export const useProduct = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [limit] = useState<number>(8);
  const [page, setPage] = useState<number>(0);
  const [isEnd, setIsEnd] = useState<boolean>(false);
  const [keyword, setKeyword] = useState<string>('');
  const [total, setTotal] = useState<number>(0);

  const handleGetProducts = (keywords?: string) => {
    setIsLoading(true);
    const response = getProducts(page, limit, keyword, total, isEnd, keywords);

    return response
      .then((data: GetProductsResponse) => {
        setTotal(data.total);
        setPage(data.page);
        setIsEnd(data.isEnd);
        setKeyword(data.keywords || '');
        console.log({ data });
        if (typeof keywords === 'string') {
          setProducts(data.data);
        } else {
          setProducts((prev) => [...prev, ...data.data]);
        }
      })
      .finally(() => setIsLoading(false));
  };

  return { products, isLoading, onGetProducts: handleGetProducts, isEnd };
};

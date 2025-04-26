import { useState } from 'react';
import { Product, GetProductsResponse } from '@/models/product';
import { getProducts, getProduct } from '@/api/product';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [limit] = useState<number>(8);
  const [page, setPage] = useState<number>(0);
  const [isEnd, setIsEnd] = useState<boolean>(false);
  const [keyword, setKeyword] = useState<string>('');
  const [total, setTotal] = useState<number>(0);

  const handleGetProducts = (keywords?: string) => {
    setIsLoading(true);
    const response = getProducts(page, limit, keyword, total, keywords);

    return response
      .then((data: GetProductsResponse) => {
        setTotal(data.total);
        setPage(data.page);
        setIsEnd(data.isEnd);
        setKeyword(data.keywords || '');
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

export const useProduct = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleGetProduct = (id: string) => {
    setIsLoading(true);
    const response = getProduct(id);

    return response
      .then((data: Product | null) => {
        if (data) {
          setProduct(data);
        }
      })
      .finally(() => setIsLoading(false));
  };

  return { product, isLoading, onGetProduct: handleGetProduct };
};

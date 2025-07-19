'use client';

import { useEffect, useState } from 'react';
import { Product } from '@/models/product';
import { getProduct } from '@/api/product';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';

export const useProducts = (
  page: number,
  totalCount?: number,
  products?: any[]
) => {
  const [isEnd, setIsEnd] = useState<boolean>(false);
  const [productList, setProductList] = useState<Product[]>(products || []);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const param = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();
  console.log(pageIndex, totalCount, productList);

  useEffect(() => {
    if (pageIndex !== page) {
      setProductList((prev) => prev.concat(products || []));
      setPageIndex(page);
    }
  }, [page, pageIndex]);

  const handleSearch = (search: string, isNextPage: boolean) => {
    const params = new URLSearchParams(param);
    if (search) {
      params.set('search', search);
    } else {
      params.delete('search');
    }
    if (isNextPage) {
      params.set('page', (pageIndex + 1).toString());
    }
    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    if (totalCount && totalCount / 10 <= pageIndex) {
      setIsEnd(true);
    }
  }, [totalCount, pageIndex]);

  return { onGetProducts: handleSearch, isEnd, productList };
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

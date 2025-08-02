'use client';

import { useEffect, useState } from 'react';
import { Product } from '@/models/product';
import { Image } from '@/models/image';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { fetchProductById } from '@/app/admin/lib/actions/products.actions';

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
  const [images, setImages] = useState<Image[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleGetProduct = (id: string) => {
    setIsLoading(true);
    const response = fetchProductById(id);

    return response
      .then((data: { product: Product; images: Image[] } | null) => {
        if (data) {
          setProduct(data.product);
          setImages(data.images);
        }
      })
      .finally(() => setIsLoading(false));
  };

  return { product, images, isLoading, onGetProduct: handleGetProduct };
};

'use client';

import { useEffect, useState } from 'react';
import { Product, ProductResponse } from '@/models/product';
import { Image } from '@/models/image';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { fetchProductById } from '@/app/admin/lib/actions/products.actions';
import { publicFetchProducts } from '@/app/lib/public-products.actions';

export const useProducts = () => {
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isEnd, setIsEnd] = useState<boolean>(false);
  const [productList, setProductList] = useState<ProductResponse[]>([]);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const fetchData = async () => {
      const { products, totalCount } = await publicFetchProducts({
        query: searchParams.get('query') || undefined,
        page: pageIndex.toString()
      });
      setProductList(products);
      setTotalCount(totalCount);
    };
    fetchData();
  }, [pageIndex, searchParams]);

  const handleSearch = (search: string, isNextPage: boolean) => {
    const params = new URLSearchParams(searchParams);
    if (search) {
      params.set('query', search);
      params.set('page', '1');
      setProductList([]);
    } else {
      params.delete('query');
      params.delete('page');
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

  return {
    onGetProducts: handleSearch,
    isEnd,
    productList,
    searchParams: {
      page: pageIndex.toString(),
      query: searchParams.get('query')
    }
  };
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

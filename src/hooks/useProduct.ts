'use client';

import { useEffect, useState } from 'react';
import { Product, ProductResponse } from '@/models/product';
import { Image } from '@/models/image';
import { fetchProductById } from '@/app/admin/lib/actions/products.actions';
import { publicFetchProducts } from '@/app/lib/public-products.actions';

export const useProducts = () => {
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isEnd, setIsEnd] = useState<boolean>(false);
  const [productList, setProductList] = useState<ProductResponse[]>([]);
  const [page, setPage] = useState<number>(0);
  const [query, setQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchData = async (search: string, page: number) => {
    if (isLoading) return;
    setIsLoading(true);
    const { products, totalCount } = await publicFetchProducts({
      query: search,
      page: page.toString()
    });
    setProductList((prev) => [...prev, ...products]);
    setTotalCount(totalCount);
    setIsLoading(false);
  };

  const handleSearch = (search: string) => {
    setQuery(search);
    setPage(1);
    setProductList([]);
    fetchData(search, 1);
  };

  const handleGetNextPage = () => {
    console.log('handleGetNextPage', page);
    if (isLoading) return;
    setPage(page + 1);
    fetchData(query, page + 1);
  };

  useEffect(() => {
    if (totalCount && totalCount / 10 <= page) {
      setIsEnd(true);
    } else {
      setIsEnd(false);
    }
  }, [totalCount, page]);

  return {
    onSearch: handleSearch,
    onGetNextPage: handleGetNextPage,
    isEnd,
    productList,
    isLoading
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

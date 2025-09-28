'use client';

import { useEffect, useState } from 'react';
import { Product, ProductResponse } from '@/models/product';
import { Image } from '@/models/image';
import { fetchProductById } from '@/app/admin/lib/actions/products.actions';
import { publicFetchProducts } from '@/app/lib/public-products.actions';
import { ProductType } from '@/models/productType';

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
    if (products.length === 0) {
      setIsEnd(true);
    }
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
    if (isLoading) return;
    setPage((prev) => prev + 1);
    fetchData(query, page + 1);
  };

  useEffect(() => {
    if (isLoading) return;
    if (totalCount && totalCount / 10 <= page) {
      setIsEnd(true);
    } else {
      setIsEnd(false);
    }
  }, [totalCount, page, isLoading]);

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
  const [productType, setProductType] = useState<ProductType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleGetProduct = (id: string) => {
    setIsLoading(true);
    const response = fetchProductById(id);

    return response
      .then(
        (
          data: {
            product: Product;
            images: Image[];
            productType: ProductType;
          } | null
        ) => {
          if (data) {
            setProduct(data.product);
            setImages(data.images);
            setProductType(data.productType);
          }
        }
      )
      .finally(() => setIsLoading(false));
  };

  return {
    product,
    images,
    isLoading,
    onGetProduct: handleGetProduct,
    productType
  };
};

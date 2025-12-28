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
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  const fetchData = async (
    search: string,
    page: number,
    selectedColors: string[],
    isSearching: boolean
  ) => {
    if (isLoading) return;
    setIsLoading(true);
    const { products, totalCount } = await publicFetchProducts({
      query: search,
      page: page.toString(),
      selectedColors: selectedColors.length > 0 ? selectedColors.join(',') : ''
    });
    console.log('totalCount', totalCount);
    if (products.length === 0 || totalCount === 0) {
      setIsEnd(true);
    }

    if (isSearching) {
      setProductList(() => [...products]);
    } else {
      setProductList((prev) => [...prev, ...products]);
    }
    setTotalCount(totalCount);
    setIsLoading(false);
  };

  const handleSearch = (search: string, color: string) => {
    if (color) {
      setSelectedColors(JSON.parse(color));
    }
    setQuery(search);
    setPage(1);
    fetchData(search, 1, color ? JSON.parse(color) : selectedColors, true);
  };

  const handleGetNextPage = () => {
    if (isLoading) return;
    setPage((prev) => prev + 1);
    fetchData(query, page + 1, selectedColors, false);
  };

  useEffect(() => {
    if (isLoading) return;
    if (totalCount && totalCount / 10 <= page) {
      setIsEnd(true);
    } else if (totalCount / 10 > page) {
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

'use client';

import { useEffect, useState } from 'react';
import {
  fetchProducts,
  fetchTotalProducts
} from '@/app/admin/lib/actions/products.actions';
import ProductsTable from '../../ui/products/table';
import { lusitana } from '@/app/admin/ui/fonts';
import Search from '../../ui/search';
import { CreateProduct } from '../../ui/products/buttons';
import Pagination from '../../ui/invoices/pagination';
import { getProductTypes } from '@/app/admin/lib/actions/product-types.actions';
import { ProductResponse } from '@/models/product';
import { ProductType } from '@/models/productType';
import CreateProductModal from '../../ui/products/create-product-modal';
import EditProductModal from '../../ui/products/edit-product-modal';
import DeleteProductModal from '../../ui/products/delete-product-modal';
import { useSearchParams } from 'next/navigation';

export default function Page() {
  const searchParams = useSearchParams();
  const query = searchParams?.get('query') || '';
  const currentPage = Number(searchParams?.get('page')) || 1;

  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [productsData, totalData, typesData] = await Promise.all([
          fetchProducts({ query, page: currentPage.toString() }),
          fetchTotalProducts(),
          getProductTypes({
            query: '',
            page: '1'
          })
        ]);

        setProducts(productsData);
        setTotalProducts(totalData);
        setProductTypes(typesData);
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [query, currentPage]);

  const formattedProducts = productTypes.reduce((acc, cur) => {
    acc[cur.id] = cur.name;
    return acc;
  }, {} as Record<string, string>);

  return (
    <main>
      <div className="flex w-full items-center justify-between mb-8">
        <h1 className={`${lusitana.className}  text-xl md:text-2xl`}>
          Products
        </h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search products..." />
        <CreateProduct />
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center p-8">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <>
          <ProductsTable products={products} productTypes={formattedProducts} />
          <div className="mt-5 flex w-full justify-center">
            <Pagination totalPages={Math.ceil(totalProducts / 10)} />
          </div>
        </>
      )}
      <CreateProductModal />
      <EditProductModal productId={null} />
      <DeleteProductModal productId={null} />
    </main>
  );
}

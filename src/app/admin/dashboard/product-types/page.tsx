'use client';

import { useEffect, useState } from 'react';
import {
  getProductTypes,
  fetchTotalProductTypes
} from '@/app/admin/lib/actions/product-types.actions';
import ProductTypesTable from '../../ui/product-types/table';
import { lusitana } from '@/app/admin/ui/fonts';
import Search from '../../ui/search';
import { CreateProductType } from '@/app/admin/ui/product-types/buttons';
import Pagination from '../../ui/invoices/pagination';
import { ProductType } from '@/models/productType';
import CreateProductTypeModal from '../../ui/product-types/create-product-type-modal';
import EditProductTypeModal from '../../ui/product-types/edit-product-type-modal';
import DeleteProductTypeModal from '../../ui/product-types/delete-product-type-modal';
import { useSearchParams } from 'next/navigation';

export default function Page() {
  const searchParams = useSearchParams();
  const query = searchParams?.get('query') || '';
  const currentPage = Number(searchParams?.get('page')) || 1;

  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [totalProductTypes, setTotalProductTypes] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [typesData, totalData] = await Promise.all([
          getProductTypes({
            query,
            page: currentPage.toString()
          }),
          fetchTotalProductTypes()
        ]);

        setProductTypes(typesData);
        setTotalProductTypes(totalData);
      } catch (error) {
        console.error('Failed to load product types:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [query, currentPage]);

  return (
    <main>
      <div className="flex w-full items-center justify-between mb-8">
        <h1 className={`${lusitana.className}  text-xl md:text-2xl`}>
          Product Types
        </h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search product types..." />
        <CreateProductType />
      </div>
      <ProductTypesTable productTypes={productTypes} loading={isLoading} />
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={Math.ceil(totalProductTypes / 50)} />
      </div>
      <CreateProductTypeModal />
      <EditProductTypeModal productTypeId={null} />
      <DeleteProductTypeModal productTypeId={null} />
    </main>
  );
}

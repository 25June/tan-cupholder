'use client';

import { useCallback, useEffect, useState } from 'react';
import { lusitana } from '@/app/admin/ui/fonts';
import Search from '@/app/admin/ui/search';
import { CreateProductTag } from '@/app/admin/ui/product-tags/buttons';
import ProductTagsTable from '@/app/admin/ui/product-tags/table';
import {
  fetchTotalProductTags,
  getProductTags
} from '@/app/admin/lib/actions/product-tags.actions';
import Pagination from '@/app/admin/ui/invoices/pagination';
import { ProductTag } from '@/models/productTag';
import CreateProductTagModal from '@/app/admin/ui/product-tags/create-product-tag-modal';
import EditProductTagModal from '@/app/admin/ui/product-tags/edit-product-tag-modal';
import DeleteProductTagModal from '@/app/admin/ui/product-tags/delete-product-tag-modal';
import { useSearchParams } from 'next/navigation';

export default function Page() {
  const searchParams = useSearchParams();
  const query = searchParams?.get('query') || '';
  const currentPage = Number(searchParams?.get('page')) || 1;

  const [productTags, setProductTags] = useState<ProductTag[]>([]);
  const [totalProductTags, setTotalProductTags] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProductTagId, setSelectedProductTagId] = useState<
    string | null
  >(null);

  const onFetchProductTags = useCallback(async () => {
    setIsLoading(true);
    try {
      const [tagsData, totalData] = await Promise.all([
        getProductTags({
          query,
          page: currentPage.toString()
        }),
        fetchTotalProductTags()
      ]);

      setProductTags(tagsData);
      setTotalProductTags(totalData);
    } catch (error) {
      console.error('Failed to load product tags:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, query]);

  useEffect(() => {
    onFetchProductTags();
  }, [onFetchProductTags]);

  const handleRefresh = () => {
    onFetchProductTags();
    setSelectedProductTagId(null);
  };

  return (
    <main>
      <div className="flex w-full items-center justify-between mb-8">
        <h1 className={`${lusitana.className}  text-xl md:text-2xl`}>
          Product Tags
        </h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search product tags..." />
        <CreateProductTag />
      </div>
      <ProductTagsTable
        productTags={productTags}
        loading={isLoading}
        onSelectProductTag={setSelectedProductTagId}
      />
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={Math.ceil(totalProductTags / 50)} />
      </div>
      <CreateProductTagModal onRefresh={onFetchProductTags} />
      <EditProductTagModal
        productTagId={selectedProductTagId}
        onRefresh={handleRefresh}
      />
      <DeleteProductTagModal
        productTagId={selectedProductTagId}
        onRefresh={handleRefresh}
      />
    </main>
  );
}

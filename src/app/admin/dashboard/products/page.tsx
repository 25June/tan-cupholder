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
import PaginationState from '../../ui/pagination-state';
import { getProductTypes } from '@/app/admin/lib/actions/product-types.actions';
import { ProductResponse } from '@/models/product';
import { ProductType } from '@/models/productType';
import CreateProductModal from '../../ui/products/create-product-modal';
import EditProductModal from '../../ui/products/edit-product-modal';
import DeleteProductModal from '../../ui/products/delete-product-modal';
import EditProductImageModal from '../../ui/products/edit-product-image-modal';
import { useSearchParams } from 'next/navigation';
import ProductSummary from '../../ui/products/product-summary';
import { ProductTag } from '@/models/productTag';
import { getProductTags } from '@/app/admin/lib/actions/product-tags.actions';

export default function Page() {
  const searchParams = useSearchParams();
  const query = searchParams?.get('query') || '';
  const [currentPage, setCurrentPage] = useState(1);

  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [productTags, setProductTags] = useState<ProductTag[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch product types only once on initial render
  useEffect(() => {
    const loadProductTypes = async () => {
      try {
        const typesData = await getProductTypes({
          query: '',
          page: '0'
        });
        setProductTypes(typesData);
      } catch (error) {
        console.error('Failed to load product types:', error);
      }
    };
    loadProductTypes();

    const loadProductTags = async () => {
      try {
        const tagsData = await getProductTags({
          query: '',
          page: '0'
        });
        setProductTags(tagsData);
      } catch (error) {
        console.error('Failed to load product tags:', error);
      }
    };
    loadProductTags();
  }, []);

  // Reset to page 1 when query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [query]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [productsData, totalData] = await Promise.all([
          fetchProducts({ query, page: currentPage.toString() }),
          fetchTotalProducts()
        ]);

        setProducts(productsData);
        setTotalProducts(totalData);
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
      <div className="flex w-full items-center justify-between gap-4 mb-8">
        <h1 className={`${lusitana.className} text-xl md:text-2xl shrink-0`}>
          Products
        </h1>
        <div className="flex items-center gap-2">
          <Search placeholder="Search products..." />
          <CreateProduct />
        </div>
      </div>
      <div>
        <ProductSummary />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center p-8">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <>
          <ProductsTable
            products={products}
            productTypes={formattedProducts}
            productTags={productTags || []}
          />
          <div className="mt-5 flex w-full justify-center">
            <PaginationState
              totalPages={Math.ceil(totalProducts / 10)}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </div>
        </>
      )}
      <CreateProductModal
        productTypes={productTypes}
        productTags={productTags}
      />
      <EditProductModal
        productId={null}
        productTypes={productTypes}
        productTags={productTags}
      />
      <DeleteProductModal productId={null} />
      <EditProductImageModal productId={null} />
    </main>
  );
}

import {
  fetchProducts,
  fetchTotalProducts
} from '@/app/admin/lib/actions/products.actions';
import { Metadata } from 'next';
import ProductsTable from '../../ui/products/table';
import { lusitana } from '@/app/admin/ui/fonts';
import Search from '../../ui/search';
import { CreateProduct } from '../../ui/products/buttons';
import { Suspense } from 'react';
import Pagination from '../../ui/invoices/pagination';
import { getProductTypes } from '@/app/admin/lib/actions/product-types.actions';

export const metadata: Metadata = {
  title: 'Products'
};

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;

  const products = await fetchProducts({ query, page: currentPage.toString() });
  const totalProducts = await fetchTotalProducts();
  const productTypes = await getProductTypes({
    query: '',
    page: '1'
  });
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
      <Suspense key={query + currentPage} fallback={<div>Loading...</div>}>
        <ProductsTable products={products} productTypes={formattedProducts} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={Math.ceil(totalProducts / 10)} />
      </div>
    </main>
  );
}

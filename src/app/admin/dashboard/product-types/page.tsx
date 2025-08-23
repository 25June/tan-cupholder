import {
  getProductTypes,
  fetchTotalProductTypes
} from '@/app/admin/lib/actions/product-types.actions';
import { Metadata } from 'next';
import ProductTypesTable from '../../ui/product-types/table';
import { lusitana } from '@/app/admin/ui/fonts';
import Search from '../../ui/search';
import { CreateProductType } from '@/app/admin/ui/product-types/buttons';
import { Suspense } from 'react';
import Pagination from '../../ui/invoices/pagination';

export const metadata: Metadata = {
  title: 'Product Types'
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

  const productTypes = await getProductTypes({
    query,
    page: currentPage.toString()
  });
  const totalProductTypes = await fetchTotalProductTypes();

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
      <Suspense key={query + currentPage} fallback={<div>Loading...</div>}>
        <ProductTypesTable productTypes={productTypes} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={Math.ceil(totalProductTypes / 10)} />
      </div>
    </main>
  );
}

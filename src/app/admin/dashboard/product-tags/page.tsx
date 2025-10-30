import { Metadata } from 'next';
import { lusitana } from '@/app/admin/ui/fonts';
import Search from '@/app/admin/ui/search';
import { Suspense } from 'react';
import { CreateProductTag } from '@/app/admin/ui/product-tags/buttons';
import ProductTagsTable from '@/app/admin/ui/product-tags/table';
import {
  fetchTotalProductTags,
  getProductTags
} from '@/app/admin/lib/actions/product-tags.actions';
import Pagination from '@/app/admin/ui/invoices/pagination';

export const metadata: Metadata = {
  title: 'Product Tags'
};

export default async function Page(props: {
  searchParams?: Promise<{ query?: string; page?: string }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;

  const productTags = await getProductTags({
    query,
    page: currentPage.toString()
  });
  const totalProductTags = await fetchTotalProductTags();

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
      <Suspense key={query + currentPage} fallback={<div>Loading...</div>}>
        <ProductTagsTable productTags={productTags} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={Math.ceil(totalProductTags / 10)} />
      </div>
    </main>
  );
}

import ProductsContainer from '@/components/products-container/ProductsContainer';
import { fetchProducts, fetchTotalProducts } from '@/app/[locale]/lib/data';

interface Props {
  searchParams?: {
    readonly query?: string;
    readonly page?: string;
  };
}

export default async function Page(props: Props) {
  const searchParams = await props.searchParams;
  const [products, totalCount] = await Promise.all([
    fetchProducts(searchParams),
    fetchTotalProducts(),
  ]);
  console.log(searchParams, products, totalCount);
  // Replace with actual data fetching logic
  return (
    <ProductsContainer
      key={'products'}
      searchParams={searchParams}
      totalCount={totalCount}
      products={products}
    />
  );
}

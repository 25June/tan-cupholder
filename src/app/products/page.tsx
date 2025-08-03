import ProductsContainer from '@/components/products-container/ProductsContainer';

interface Props {
  searchParams?: {
    readonly query?: string;
    readonly page?: string;
  };
}

export default async function Page(props: Props) {
  return <ProductsContainer />;
}

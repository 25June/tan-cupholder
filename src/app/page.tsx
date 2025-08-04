import { fetchProducts } from '@/app/admin/lib/actions/products.actions';
import Homepage from '@/components/home/Homepage';

export default async function Home() {
  const products = await fetchProducts();
  return <Homepage products={products} />;
}

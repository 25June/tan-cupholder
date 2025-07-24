import { fetchProducts } from '@/app/lib/data';
import Homepage from '@/components/home/Homepage';

export default async function Home() {
  const products = await fetchProducts();
  console.log('products', products);
  return <Homepage products={products} />;
}

import Homepage from '@/components/home/Homepage';
import { publicFetchProducts } from './lib/public-products.actions';

export default async function Home() {
  const { products } = await publicFetchProducts({});
  return <Homepage products={products} />;
}

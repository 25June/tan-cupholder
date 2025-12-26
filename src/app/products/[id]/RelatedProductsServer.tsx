import { publicFetchOtherProducts } from '@/app/lib/public-products.actions';
import SliderContainer from '@/components/product-slider/SliderContainer';

// Server Component - fetches data on the server and streams to client
export default async function RelatedProductsServer() {
  const products = await publicFetchOtherProducts();

  return (
    <section className="mx-auto space-y-12 px-4">
      <h2 className="text-2xl font-bold mb-2 text-center text-logo-orange-border">
        Related Products
      </h2>
      <div>
        <SliderContainer products={products} />
      </div>
    </section>
  );
}

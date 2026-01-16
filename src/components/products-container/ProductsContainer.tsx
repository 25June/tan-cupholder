'use client';

import { yuseiMagic } from '@/styles/fonts';
import ObserverLoading from '@/components/observer-loading/ObserverLoading';
import SearchProducts from '@/components/search-products/SearchProducts';
import { useProducts } from '@/hooks/useProduct';
import Card from '@/components/card/Card';
import CDNImage from '../cdn-image/CDNImage';
import ColorFilter from '@/components/color-filter/ColorFilter';

export default function ProductsContainer() {
  const { onSearch, isEnd, productList, isLoading, onGetNextPage } =
    useProducts();

  return (
    <section>
      {/* Hero banner */}
      <figure className="w-screen h-48 md:h-96">
        <CDNImage
          src="https://pub-485637738840450490e408cee2acb72c.r2.dev/feature-images/IMG_7414.jpg"
          alt="hero-image-1"
          width={1600}
          height={900}
          className="w-screen h-48 md:h-96 object-cover"
        />
      </figure>

      <div className="relative h-full max-w-8xl mx-auto p-4 pb-20 gap-16 md:p-20">
        {/* Header with search and filter */}
        <header className="flex justify-between items-start md:items-end flex-col md:flex-row">
          <div className="shrink-0">
            <h2 className="text-md md:text-lg text-slate-400">
              Environment Friendly
            </h2>
            <h3
              className={`text-xl md:text-3xl antialiased text-logo-orange font-bold tracking-wide mb-4 ${yuseiMagic.className}`}
            >
              Low Impact Collections
            </h3>
          </div>
          <div className="flex grow gap-2 mb-4 w-full justify-end">
            <SearchProducts onSearch={onSearch} />
            <ColorFilter
              defaultColor={''}
              onChange={(color) => onSearch('', color)}
            />
          </div>
        </header>

        {/* Product grid */}
        <div className="relative grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-y-8 gap-x-8 py-2 px-2">
          {(productList || []).map((item) => (
            <Card item={item} key={item.id} />
          ))}
        </div>

        <ObserverLoading
          onGetNextPage={onGetNextPage}
          isLoading={isLoading}
          isEnd={isEnd}
        />
      </div>
    </section>
  );
}

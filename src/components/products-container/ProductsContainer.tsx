'use client';

import { yuseiMagic } from '@/styles/fonts';
import StaticMenuBar from '@/components/menu-bar/StaticMenuBar';
import Footer from '@/components/footer/Footer';
import ObserverLoading from '@/components/observer-loading/ObserverLoading';
import SearchProducts from '@/components/search-products/SearchProducts';
import { useProducts } from '@/hooks/useProduct';
import Card from '@/components/card/Card';

export default function ProductsContainer() {
  const { onSearch, isEnd, productList, isLoading, onGetNextPage } =
    useProducts();

  return (
    <div>
      <StaticMenuBar triggerCartCount={1} />
      <div>
        <div
          className={`w-screen h-48 md:h-96 bg-center bg-cover bg-no-repeat bg-[url('/IMG_7197.jpg')]`}
        ></div>
      </div>
      <div className="relative h-full max-w-8xl mx-auto p-4 pb-20 gap-16 md:p-20 ">
        <div className="flex justify-between items-start md:items-end flex-col md:flex-row">
          <div className="shink-0">
            <h2 className={`text-md md:text-lg text-slate-400`}>
              Environment Friendly
            </h2>
            <h3
              className={`text-xl md:text-3xl antialiased text-logo-orange font-bold tracking-wide mb-4 ${yuseiMagic.className}`}
            >
              Low Impact Collections
            </h3>
          </div>
          <div className="mb-4 w-full md:w-64">
            <SearchProducts onSearch={onSearch} />
          </div>
        </div>

        <div className="relative grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-y-8 gap-x-8 py-2 px-2">
          {(productList || []).map((item) => {
            return <Card item={item} key={item.id} />;
          })}
        </div>
        <ObserverLoading
          onGetNextPage={onGetNextPage}
          isLoading={isLoading}
          isEnd={isEnd}
        />
      </div>
      <Footer />
    </div>
  );
}

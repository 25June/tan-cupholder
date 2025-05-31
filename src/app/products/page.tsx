'use client';

import { yuseiMagic } from '@/styles/fonts';
import { useProducts } from '@/hooks/useProduct';
import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import StaticMenuBar from '@/components/menu-bar/StaticMenuBar';
import Spinner from '@/components/spinner/Spinner';
import { debounce } from '@/shared/utils/debounce';
import Card from '@/components/card/Card';
import { Footer } from '@/components/footer/Footer';

export default function Page() {
  const { products, isLoading, onGetProducts, isEnd } = useProducts();
  const observerTarget = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading && !isEnd) {
          onGetProducts();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [isLoading]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    onGetProducts(e.target.value || '');
  };

  return (
    <div>
      <StaticMenuBar />
      <div>
        <div
          className={`w-screen h-48 md:h-96 bg-center bg-cover bg-no-repeat bg-[url('/IMG_7197.jpg')]`}
        ></div>
      </div>
      <div className="relative h-full max-w-8xl mx-auto p-4 pb-20 gap-16 md:p-20 ">
        <div className="flex justify-between items-start md:items-end flex-col md:flex-row">
          <div className="shink-0">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className={`text-md md:text-lg text-slate-400`}
            >
              Environment Friendly
            </motion.h2>
            <motion.h3
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className={`text-xl md:text-3xl antialiased text-logo-orange font-bold tracking-wide mb-4 ${yuseiMagic.className}`}
            >
              Low Impact Collections
            </motion.h3>
          </div>
          <div className="mb-4 w-full md:w-64">
            <label className="input input-md input-primary w-full">
              <svg
                className="h-[1em] opacity-50"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                  fill="none"
                  stroke="currentColor"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.3-4.3"></path>
                </g>
              </svg>
              <input
                type="search"
                className="grow"
                placeholder="Search"
                onChange={debounce(handleSearch, 500)}
              />
            </label>
          </div>
        </div>

        <div className="relative grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-y-8 gap-x-8 py-2 px-2">
          {products.map((item) => {
            return <Card item={item} key={item.id} />;
          })}
        </div>
        <div ref={observerTarget} className="flex justify-center items-center">
          {isLoading && <Spinner />}
        </div>
      </div>
      <Footer />
    </div>
  );
}

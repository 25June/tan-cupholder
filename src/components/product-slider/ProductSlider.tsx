import * as motion from 'motion/react-client';
import { yuseiMagic } from '@/styles/fonts';
import Image from 'next/image';
import { mockProducts } from '@/mocks/products';
import Card from '@/components/card/Card';
import { useEffect, useState, useRef } from 'react';

export const ProductSlider = () => {
  const [displayedProducts, setDisplayedProducts] = useState(
    mockProducts.slice(0, 8)
  );
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const observerTarget = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          loadMoreProducts();
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
  }, [loading]);

  const loadMoreProducts = () => {
    setLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      const nextPage = page + 1;
      const startIndex = (nextPage - 1) * 8;
      const endIndex = startIndex + 8;
      const newProducts = mockProducts.slice(startIndex, endIndex);

      if (newProducts.length > 0) {
        setDisplayedProducts((prev) => [...prev, ...newProducts]);
        setPage(nextPage);
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="relative">
      <div className="relative z-20 max-w-8xl mx-auto grid grid-rows-[20px_1fr_20px] items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 ">
        <main className="w-full gap-8 row-start-2 text-center">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className={`text-lg text-slate-400`}
          >
            Environment Friendly
          </motion.h2>
          <motion.h3
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className={`text-3xl antialiased text-logo-orange font-bold tracking-wide mb-4 ${yuseiMagic.className}`}
          >
            Low Impact Collections
          </motion.h3>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex gap-8 justify-center mb-10 font-extrabold"
          >
            <button
              type="button"
              className="text-lg tracking-wide text-logo-orange hover:text-slate-100 rounded-full transition-all duration-300 border-logo-orange border-2 hover:bg-logo-orange py-1 px-4"
            >
              All Product
            </button>
            <button
              type="button"
              className="text-lg tracking-wide text-logo-orange hover:text-slate-100 rounded-full transition-all duration-300 border-logo-orange border-2 hover:bg-logo-orange py-1 px-4"
            >
              Latest Products
            </button>
            <button
              type="button"
              className="text-lg tracking-wide text-logo-orange hover:text-slate-100 rounded-full transition-all duration-300 border-logo-orange border-2 hover:bg-logo-orange py-1 px-4"
            >
              Best Seller
            </button>
            <button
              type="button"
              className="text-lg tracking-wide text-logo-orange hover:text-slate-100 rounded-full transition-all duration-300 border-logo-orange border-2 hover:bg-logo-orange py-1 px-4"
            >
              Featured Products
            </button>
          </motion.div>
          <div>
            <div className="relative grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-8 py-2 px-2">
              {displayedProducts.map((item, index) => {
                return <Card item={item} key={index} />;
              })}
            </div>
            <div ref={observerTarget} className="h-10 w-full">
              {loading && (
                <div className="flex justify-center items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-logo-orange"></div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      <div className="absolute top-0 w-screen">
        <Image
          src={'/top-wave.svg'}
          width={160}
          height={90}
          alt="wave"
          className="w-screen"
        />
      </div>
    </div>
  );
};

import * as motion from 'motion/react-client';
import { yuseiMagic } from '@/styles/fonts';
import Image from 'next/image';
import { mockProducts } from '@/mocks/products';
import {
  numberWithCommas,
  calculatePercent,
} from '@/shared/utils/formatNumber';
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
                return (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.25 * (index + 1),
                      scale: {
                        type: 'spring',
                        visualDuration: 0.25 * (index + 1),
                        bounce: 0.25,
                      },
                    }}
                    key={item.id}
                    className="relative justify-self-center shadow-md hover:shadow-2xl transition-shadow duration-300 rounded-xl w-auto"
                  >
                    <div className="relative bg-black rounded-xl overflow-hidden outline outline-2 -outline-offset-8 outline-slate-100 transition-all duration-300 ">
                      <div className="z-10 absolute text-xs top-4 left-4 text-slate-100 rounded-full bg-logo-orange py-1 px-2 tracking-wider font-black">
                        {item.sale}%
                      </div>
                      <Image
                        src={item.image}
                        width={300}
                        height={300}
                        alt={item.image}
                        className="w-72 h-72 min-w-72 hover:scale-110 transform-none transition-all duration-300"
                      />
                    </div>
                    <div className="relative text-left p-2">
                      <div className="text-sm font-light text-slate-500">
                        {item.type}
                      </div>
                      <h4 className="text-lg font-semibold">{item.name}</h4>
                      <div>
                        <span className="text-slate-400 line-through decoration-slate-400">
                          {numberWithCommas(item.price)} vnd
                        </span>
                        {' -> '}
                        <span className="font-medium">
                          {calculatePercent(item.price, item.sale)} vnd
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
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

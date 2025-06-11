'use client';

import { useTranslations } from 'next-intl';
import * as motion from 'motion/react-client';
import { yuseiMagic } from '@/styles/fonts';
import Image from 'next/image';
import { mockProducts } from '@/mocks/products';
import Card from '@/components/card/Card';
import { useEffect, useState, useRef } from 'react';
import { chunkArray } from '@/shared/utils/chunkArray';
import { useQueryMedia } from '@/hooks/useQueryLayout';
import { ScreenLayout } from '@/constants/common';
import ArrowRightCircle from '@/components/icons/ArrowRightCircle';
import ArrowLeftCircle from '@/components/icons/ArrowLeftCircle';

const ProductSlider = () => {
  const t = useTranslations('HomePage.ProductSliderSection');
  const currentLayout = useQueryMedia();
  const [chunkNumber, setChunkNumber] = useState<number>(1);
  const [displayedProducts, setDisplayedProducts] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const observerTarget = useRef(null);
  const productArrayRef = useRef(null);

  useEffect(() => {
    if (currentLayout === ScreenLayout.Tablet) {
      setChunkNumber(2);
      setDisplayedProducts(chunkArray(mockProducts.slice(0, 8), 2));
    } else if (currentLayout === ScreenLayout.Desktop) {
      setChunkNumber(3);
      setDisplayedProducts(chunkArray(mockProducts.slice(0, 8), 3));
    } else {
      setChunkNumber(1);
      setDisplayedProducts(chunkArray(mockProducts.slice(0, 8), 1));
    }
  }, [currentLayout]);

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

  const onScroll = (step: number) => {
    const container = productArrayRef.current as HTMLDivElement | null;
    if (container) {
      const scrollAmount = container.scrollWidth / chunkNumber;
      container.scrollBy({
        left: step * scrollAmount,
        behavior: 'smooth',
      });
    }
  };

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
      <div className="relative z-20 w-full max-w-screen md:max-w-8xl mx-auto grid grid-rows-[40px_1fr_20px] items-center min-h-screen p-4 md:p-8 pb-10 md:pb-20 gap:8 md:gap-16 overflow-hidden">
        <main className="w-full gap-8 row-start-2 text-center">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className={`text-md md:text-lg text-slate-400`}
          >
            {t('title')}
          </motion.h2>
          <motion.h3
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className={`text-xl md:text-3xl antialiased text-logo-orange font-bold tracking-wide mb-4 ${yuseiMagic.className}`}
          >
            {t('subtitle')}
          </motion.h3>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex gap-2 md:gap-8 justify-center flex-wrap mb-2 md:mb-10 font-extrabold"
          >
            <button
              type="button"
              className="text-sm md:text-lg tracking-wide text-logo-orange hover:text-slate-100 rounded-full transition-all duration-300 border-logo-orange border-2 hover:bg-logo-orange py-1 px-4"
            >
              {t('allProducts')}
            </button>
            <button
              type="button"
              className="text-sm md:text-lg tracking-wide text-logo-orange hover:text-slate-100 rounded-full transition-all duration-300 border-logo-orange border-2 hover:bg-logo-orange py-1 px-4"
            >
              {t('latestProducts')}
            </button>
            <button
              type="button"
              className="text-sm md:text-lg tracking-wide text-logo-orange hover:text-slate-100 rounded-full transition-all duration-300 border-logo-orange border-2 hover:bg-logo-orange py-1 px-4"
            >
              {t('bestSellers')}
            </button>
            <button
              type="button"
              className="text-sm md:text-lg tracking-wide text-logo-orange hover:text-slate-100 rounded-full transition-all duration-300 border-logo-orange border-2 hover:bg-logo-orange py-1 px-4"
            >
              {t('featuredProducts')}
            </button>
          </motion.div>
          <div
            ref={productArrayRef}
            className="relative flex flex-row overflow-x-auto gap-8 py-4 px-2 mx-auto snap-x snap-mandatory max-w-[90vw] lg:max-w-[1024px]"
          >
            {displayedProducts.map((chunk, index) => {
              const isFirstChunk = index === 0;
              const isLastChunk = index === displayedProducts.length - 1;
              return (
                <div
                  className="relative w-full flex-shrink-0 flex flex-row gap-8 justify-center snap-center snap-always"
                  key={index}
                >
                  {!isFirstChunk && (
                    <div className="absolute -left-2 md:left-0 h-full flex items-center">
                      <button onClick={() => onScroll(-1)}>
                        <ArrowLeftCircle className="size-6 stroke-logo-orange-border" />
                      </button>
                    </div>
                  )}
                  {Array.from({ length: chunkNumber }).map((_, idx) => {
                    return chunk[idx] ? (
                      <Card item={chunk[idx]} key={idx} />
                    ) : null;
                  })}
                  {!isLastChunk && (
                    <div className="absolute -right-2 md:right-0 h-full flex items-center">
                      <button onClick={() => onScroll(1)}>
                        <ArrowRightCircle className="size-6 stroke-logo-orange-border" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </main>
      </div>
      <div className="absolute -top-1 w-full">
        <Image
          src={'/top-wave.svg'}
          width={160}
          height={90}
          alt="wave"
          className="w-full"
        />
      </div>
    </div>
  );
};

export default ProductSlider;

'use client';
import SpecialCard from '@/components/card/SpecialCard';
import { useEffect, useState, useRef } from 'react';
import { chunkArray } from '@/shared/utils/chunkArray';
import { useQueryMedia } from '@/hooks/useQueryLayout';
import { ScreenLayout } from '@/constants/common';
import {
  ArrowRightCircleIcon,
  ArrowLeftCircleIcon
} from '@heroicons/react/24/outline';
import { ProductResponse } from '@/models/product';

interface Props {
  readonly products: ProductResponse[];
}

export default function SliderContainer({ products }: Props) {
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
      setDisplayedProducts(chunkArray(products.slice(0, 8), 2));
    } else if (currentLayout === ScreenLayout.Desktop) {
      setChunkNumber(3);
      setDisplayedProducts(chunkArray(products.slice(0, 8), 3));
    } else {
      setChunkNumber(1);
      setDisplayedProducts(chunkArray(products.slice(0, 8), 1));
    }
  }, [currentLayout, products]);

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
        behavior: 'smooth'
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
      const newProducts = products.slice(startIndex, endIndex);

      if (newProducts.length > 0) {
        setDisplayedProducts((prev) => [...prev, ...newProducts]);
        setPage(nextPage);
      }
      setLoading(false);
    }, 1000);
  };
  return (
    <div
      ref={productArrayRef}
      className="relative flex flex-row overflow-x-auto gap-8 py-4 px-2 mx-auto snap-x snap-mandatory max-w-[90vw] lg:max-w-[1024px]"
    >
      {displayedProducts.map((chunk, index) => {
        const isFirstChunk = index === 0;
        const isLastChunk = index === displayedProducts.length - 1;
        return (
          <div
            className="relative h-full w-full flex-shrink-0 flex flex-row gap-8 justify-center snap-center snap-always"
            key={index}
          >
            {!isFirstChunk && (
              <div className="absolute -left-2 md:left-0 h-full flex items-center">
                <button onClick={() => onScroll(-1)}>
                  <ArrowLeftCircleIcon className="size-6 stroke-logo-orange-border" />
                </button>
              </div>
            )}
            {Array.from({ length: chunkNumber }).map((_, idx) => {
              return chunk[idx] ? (
                <SpecialCard item={chunk[idx]} key={idx} />
              ) : null;
            })}
            {!isLastChunk && (
              <div className="absolute -right-2 md:right-0 h-full flex items-center">
                <button onClick={() => onScroll(1)}>
                  <ArrowRightCircleIcon className="size-6 stroke-logo-orange-border" />
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';
import Spinner from '@/components/spinner/Spinner';

interface Props {
  readonly isEnd: boolean;
  readonly onGetProducts: (search: string, isNextPage: boolean) => void;
  readonly searchParams?: {
    readonly search?: string;
    readonly page?: string;
  };
}

export default function ObserverLoading({
  isEnd,
  onGetProducts,
  searchParams,
}: Props) {
  const observerTarget = useRef(null);
  useEffect(() => {
    if (searchParams?.page) {
      setIsLoading(false);
    }
  }, [searchParams?.page]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading && !isEnd) {
          onGetProducts(searchParams?.search || '', true);
          setIsLoading(true);
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
  return (
    <div ref={observerTarget} className="flex justify-center items-center">
      {isLoading && <Spinner />}
    </div>
  );
}

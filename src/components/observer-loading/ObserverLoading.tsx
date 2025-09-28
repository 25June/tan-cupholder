'use client';

import { useEffect, useRef } from 'react';
import Spinner from '@/components/spinner/Spinner';

interface Props {
  readonly isLoading: boolean;
  readonly isEnd: boolean;
  readonly onGetNextPage: () => void;
}

export default function ObserverLoading({
  isEnd,
  onGetNextPage,
  isLoading
}: Props) {
  const observerTarget = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading && !isEnd) {
          console.log('onGetNextPage');
          onGetNextPage();
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
  }, [isLoading, isEnd]);
  return (
    <div ref={observerTarget} className="flex justify-center items-center h-10">
      {isLoading && <Spinner />}
    </div>
  );
}

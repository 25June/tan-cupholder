'use client';

import { useEffect, useState } from 'react';
import { animate } from 'motion/react';
import { useProductSummary } from '@/app/admin/hooks/useProductSummary';
import { ArrowRightCircleIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import Spinner from '@/components/spinner/Spinner';

function Card({
  title,
  value,
  onViewMore,
  isLoading
}: {
  title: string;
  value: number;
  onViewMore?: () => void;
  isLoading: boolean;
}) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1.5,
      ease: 'easeOut',
      onUpdate: (latest) => {
        setDisplayValue(Math.round(latest));
      }
    });

    return () => controls.stop();
  }, [value]);

  return (
    <div className="rounded-xl overflow-hidden bg-logo-orange-pale-companion shadow-sm">
      <div className="flex flex-col items-center justify-center">
        <div className="flex items-center justify-between w-full relative">
          <h3 className="text-sm p-2 font-bold w-full text-left text-logo-orange-border">
            {title}
          </h3>
          {onViewMore && (
            <button
              className="text-sm font-bold text-center text-white hover:bg-white hover:text-logo-orange-border transition-all duration-300 rounded-full p-1 absolute right-2 top-0.5"
              onClick={onViewMore}
            >
              <ArrowRightCircleIcon className="w-6 h-6" />
            </button>
          )}
        </div>
        <p className="text-4xl p-2 font-extrabold w-full text-center text-logo-orange">
          {isLoading ? <Spinner /> : displayValue}
        </p>
      </div>
    </div>
  );
}

export default function ProductSummary() {
  const { data, isLoading, error } = useProductSummary();
  const router = useRouter();

  const handleViewProductTags = () => {
    router.push(`/admin/dashboard/product-tags`);
  };

  const handleViewProductTypes = () => {
    router.push(`/admin/dashboard/product-types`);
  };

  if (error || !data) {
    return (
      <div className="rounded-xl overflow-hidden bg-gray-50 shadow-sm p-4">
        <p className="text-center text-red-500">
          {error || 'Failed to load product summary'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-4">
      <Card
        title="Total Products"
        value={data.totalProducts}
        isLoading={isLoading}
      />
      <Card
        title="Total Products Types"
        value={data.totalProductTypes}
        onViewMore={handleViewProductTypes}
        isLoading={isLoading}
      />
      <Card
        title="Total Products Tags"
        value={data.totalProductTags}
        onViewMore={handleViewProductTags}
        isLoading={isLoading}
      />
      <Card
        title="Total Products Images"
        value={data.totalProductImages}
        isLoading={isLoading}
      />
    </div>
  );
}
